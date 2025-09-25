import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';

// Types
interface TimeSlot {
  start: Date;
  end: Date;
}

interface Availability {
  start: string;
  end: string;
  id: string;
}

interface GoogleCalendarEvent {
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  summary?: string;
}

// Configuration
const CALENDAR_IDS = {
  THOMAS: 'thomasfonferrier@gmail.com',
};

const WORK_HOURS = {
  start: 9, // 9h
  end: 20,  // 20h
};

// Fonction pour créer un client OAuth2
async function getOAuthClient() {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

// Fonction pour récupérer les événements d'un calendrier
async function getCalendarEvents(calendarId: string, date: Date) {
  try {
    const auth = await getOAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startOfDay = new Date(date);
    startOfDay.setHours(WORK_HOURS.start, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(WORK_HOURS.end, 0, 0, 0);

    const response = await calendar.events.list({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    
    return [];
  }
}

// Fonctions utilitaires (copiées du composant original)
function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function roundUpToNextHour(date: Date): Date {
  const rounded = new Date(date);
  if (rounded.getMinutes() > 0 || rounded.getSeconds() > 0) {
    rounded.setHours(rounded.getHours() + 1);
  }
  rounded.setMinutes(0);
  rounded.setSeconds(0);
  rounded.setMilliseconds(0);
  return rounded;
}

function roundDownToPreviousHour(date: Date): Date {
  const rounded = new Date(date);
  if (rounded.getMinutes() > 0 || rounded.getSeconds() > 0) {
    rounded.setMinutes(0);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
  } else {
    rounded.setMinutes(0);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
  }
  return rounded;
}

function splitIntoHourlySlots(startTime: Date, endTime: Date, dateStr: string): Availability[] {
  const hourlySlots: Availability[] = [];
  const current = new Date(startTime);
  
  while (current < endTime) {
    const slotEnd = new Date(current);
    slotEnd.setHours(slotEnd.getHours() + 1);
    
    if (slotEnd <= endTime) {
      const startStr = formatTime(current);
      const endStr = formatTime(slotEnd);
      hourlySlots.push({
        start: startStr,
        end: endStr,
        id: `${dateStr}_${startStr}_${endStr}`
      });
    }
    
    current.setHours(current.getHours() + 1);
  }
  
  return hourlySlots;
}

function calculateFreeSlots(events: TimeSlot[], date: Date): Availability[] {
  const freeSlots: Availability[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  const workStart = new Date(date);
  workStart.setHours(WORK_HOURS.start, 0, 0, 0);
  
  const workEnd = new Date(date);
  workEnd.setHours(WORK_HOURS.end, 0, 0, 0);

  if (events.length === 0) {
    return splitIntoHourlySlots(workStart, workEnd, dateStr);
  }

  if (events[0].start > workStart) {
    const slotStart = workStart;
    const slotEnd = roundDownToPreviousHour(events[0].start);
    
    if (slotEnd > slotStart) {
      freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd, dateStr));
    }
  }

  for (let i = 0; i < events.length - 1; i++) {
    if (events[i].end < events[i + 1].start) {
      const slotStart = roundUpToNextHour(events[i].end);
      const slotEnd = roundDownToPreviousHour(events[i + 1].start);
      
      if (slotEnd > slotStart) {
        freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd, dateStr));
      }
    }
  }

  if (events[events.length - 1].end < workEnd) {
    const slotStart = roundUpToNextHour(events[events.length - 1].end);
    const slotEnd = workEnd;
    
    if (slotEnd > slotStart) {
      freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd, dateStr));
    }
  }

  return freeSlots;
}

// Fonction pour obtenir la date/heure actuelle en France de manière fiable
function getCurrentDateTimeInParis(): Date {
  // Utiliser Intl.DateTimeFormat pour une gestion correcte du fuseau horaire
  const now = new Date();
  const parisTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(now);
  
  const year = parseInt(parisTime.find(part => part.type === 'year')!.value);
  const month = parseInt(parisTime.find(part => part.type === 'month')!.value) - 1; // Les mois commencent à 0
  const day = parseInt(parisTime.find(part => part.type === 'day')!.value);
  const hour = parseInt(parisTime.find(part => part.type === 'hour')!.value);
  const minute = parseInt(parisTime.find(part => part.type === 'minute')!.value);
  const second = parseInt(parisTime.find(part => part.type === 'second')!.value);
  
  return new Date(year, month, day, hour, minute, second);
}

// Fonction pour filtrer les créneaux passés de manière fiable
function filterPastSlots(slots: Availability[], date: Date): Availability[] {
  const currentDateTime = getCurrentDateTimeInParis();
  
  return slots.filter(slot => {
    // Créer une date complète pour le créneau (date + heure) en utilisant le fuseau horaire de Paris
    const slotDate = new Date(date);
    const [startHour, startMinute] = slot.start.split(':').map(Number);
    
    // Créer la date du créneau en utilisant le même fuseau horaire que la date de référence
    const slotDateTime = new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(), startHour, startMinute, 0, 0);
    
    // Comparer avec l'heure actuelle (les deux dates sont dans le même fuseau horaire)
    return slotDateTime > currentDateTime;
  });
}

function getNextBusinessDays(count: number = 5): Date[] {
  const businessDays: Date[] = [];
  // Obtenir la date actuelle en France de manière cohérente
  const currentDateTime = getCurrentDateTimeInParis();
  const parisNow = new Date(currentDateTime);
  parisNow.setHours(0, 0, 0, 0);

  let checkDate = new Date(parisNow);
  let daysAdded = 0;

  while (daysAdded < count) {
    const dayOfWeek = checkDate.getDay();
    // Inclure seulement les jours ouvrés (lundi=1 à vendredi=5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDays.push(new Date(checkDate));
      daysAdded++;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return businessDays;
}

// Fonction pour valider qu'une date est dans les 5 prochains jours ouvrables
function isValidBusinessDay(date: Date): boolean {
  const businessDays = getNextBusinessDays(5);
  const dateStr = date.toISOString().split('T')[0];
  
  return businessDays.some(businessDay => 
    businessDay.toISOString().split('T')[0] === dateStr
  );
}

// Fonction utilitaire pour déboguer les dates (peut être supprimée en production)
function debugDateInfo(date: Date, label: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label}:`, {
      date: date.toISOString(),
      localString: date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      dayOfWeek: date.getDay(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
}

export async function GET() {
  try {
    // Obtenir l'heure actuelle pour le débogage
    const currentTime = getCurrentDateTimeInParis();
    debugDateInfo(currentTime, 'Heure actuelle en France');
    
    // Récupérer les 5 prochains jours ouvrés
    const businessDays = getNextBusinessDays(5);
    debugDateInfo(businessDays[0], 'Premier jour ouvré');
    debugDateInfo(businessDays[businessDays.length - 1], 'Dernier jour ouvré');
    
    const dailyAvailabilities = await Promise.all(
      businessDays.map(async (date) => {
        debugDateInfo(date, `Traitement du jour: ${date.toISOString().split('T')[0]}`);
        
        // Récupérer les événements du calendrier pour cette date
        const events = await getCalendarEvents(CALENDAR_IDS.THOMAS, date);

        // Calculer les créneaux libres
        const freeSlots = calculateFreeSlots(events.map(event => {
          if (!event.start || !event.end) {
            throw new Error('Événement invalide: start ou end manquant');
          }

          const startTime = event.start.dateTime || event.start.date;
          const endTime = event.end.dateTime || event.end.date;

          if (!startTime || !endTime) {
            throw new Error('Événement invalide: dateTime ou date manquant');
          }

          return {
            start: new Date(startTime),
            end: new Date(endTime)
          };
        }), date);
        
        // Filtrer les créneaux passés de manière fiable
        const filteredSlots = filterPastSlots(freeSlots, date);
        
        // Log pour le débogage
        if (process.env.NODE_ENV === 'development') {
          console.log(`Jour ${date.toISOString().split('T')[0]}: ${freeSlots.length} créneaux avant filtrage, ${filteredSlots.length} après filtrage`);
        }
        
        return {
          date: date.toISOString(),
          freeSlots: filteredSlots
        };
      })
    );

    return NextResponse.json({ dailyAvailabilities });
  } catch (error) {
    console.error('Erreur dans l\'API availability:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
} 