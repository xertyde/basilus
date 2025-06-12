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

// Fonction pour filtrer les créneaux passés (pour aujourd'hui seulement)
function filterPastSlots(slots: Availability[], date: Date): Availability[] {
  // Obtenir l'heure actuelle en France
  const now = new Date();
  const parisTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  
  // Créer une date de comparaison pour aujourd'hui en France
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayParis = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  todayParis.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Si ce n'est pas aujourd'hui, retourner tous les créneaux
  if (checkDate.getTime() !== todayParis.getTime()) {
    return slots;
  }
  
  // Si c'est aujourd'hui, filtrer les créneaux passés
  const currentHour = parisTime.getHours();
  const currentMinute = parisTime.getMinutes();
  
  return slots.filter(slot => {
    // Extraire l'heure de début du créneau (format "HH:MM")
    const startTime = slot.start;
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    // Comparer avec l'heure actuelle
    if (startHour > currentHour) {
      return true; // Créneau dans le futur
    } else if (startHour === currentHour) {
      return startMinute > currentMinute; // Même heure, mais minutes futures
    } else {
      return false; // Créneau passé
    }
  });
}

function getNextBusinessDays(count: number = 5): Date[] {
  const businessDays: Date[] = [];
  // Obtenir la date actuelle en France
  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  parisNow.setHours(0, 0, 0, 0);

  let daysAdded = 0;
  let checkDate = new Date(parisNow);

  while (daysAdded < count) {
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays.push(new Date(checkDate));
      daysAdded++;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return businessDays;
}

export async function GET() {
  try {
    const businessDays = getNextBusinessDays(5);
    
    const dailyAvailabilities = await Promise.all(
      businessDays.map(async (date) => {
        const events = await getCalendarEvents(CALENDAR_IDS.THOMAS, date);

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
        
        // Filtrer les créneaux passés pour aujourd'hui
        const filteredSlots = filterPastSlots(freeSlots, date);
        
        return {
          date: date.toISOString(),
          freeSlots: filteredSlots
        };
      })
    );

    return NextResponse.json({ dailyAvailabilities });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
} 