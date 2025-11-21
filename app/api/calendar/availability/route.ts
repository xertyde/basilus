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

    // Créer les dates de début et fin de journée en Europe/Paris
    // On utilise les composants de la date pour créer des dates cohérentes
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const startOfDay = new Date(year, month, day, WORK_HOURS.start, 0, 0);
    const endOfDay = new Date(year, month, day, WORK_HOURS.end, 0, 0);

    // Convertir en ISO string pour l'API Google Calendar
    // L'API Google Calendar attend des dates en UTC avec le fuseau horaire spécifié
    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();

    console.log(`[CALENDAR API] Requête Google Calendar pour ${date.toISOString().split('T')[0]}:`);
    console.log(`[CALENDAR API]   timeMin: ${timeMin}`);
    console.log(`[CALENDAR API]   timeMax: ${timeMax}`);

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'Europe/Paris', // Spécifier explicitement le fuseau horaire
    });

    const events = response.data.items || [];
    console.log(`[CALENDAR API]   ${events.length} événements récupérés`);
    
    return events;
  } catch (error) {
    console.error('[CALENDAR API] Erreur lors de la récupération des événements du calendrier:', error);
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
  // Obtenir la date/heure actuelle
  const now = new Date();
  
  // Utiliser Intl.DateTimeFormat pour obtenir les composants de date/heure en Europe/Paris
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')!.value);
  const month = parseInt(parts.find(p => p.type === 'month')!.value) - 1; // Les mois sont 0-indexés
  const day = parseInt(parts.find(p => p.type === 'day')!.value);
  const hour = parseInt(parts.find(p => p.type === 'hour')!.value);
  const minute = parseInt(parts.find(p => p.type === 'minute')!.value);
  const second = parseInt(parts.find(p => p.type === 'second')!.value);
  
  // Pour les comparaisons de dates, on a besoin d'une date qui représente correctement
  // la date/heure en Europe/Paris. La meilleure approche est de créer une date locale
  // avec ces composants, car on va comparer avec d'autres dates créées de la même manière.
  // On crée une date en utilisant les composants directement (cela créera une date locale)
  const parisDate = new Date(year, month, day, hour, minute, second);
  
  // Log pour le débogage
  console.log('[CALENDAR API] Date actuelle UTC:', now.toISOString());
  console.log('[CALENDAR API] Date actuelle en Europe/Paris:', parisDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
  
  return parisDate;
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
  
  // Obtenir la date/heure actuelle en France de manière cohérente
  const currentDateTime = getCurrentDateTimeInParis();
  
  // Extraire la date (sans l'heure) en Europe/Paris
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const now = new Date();
  const dateParts = formatter.formatToParts(now);
  const year = parseInt(dateParts.find(p => p.type === 'year')!.value);
  const month = parseInt(dateParts.find(p => p.type === 'month')!.value) - 1;
  const day = parseInt(dateParts.find(p => p.type === 'day')!.value);
  
  // Créer une date de référence à midi (12h) pour éviter les problèmes de fuseau horaire
  // On utilise les composants directement pour créer une date locale
  let checkDate = new Date(year, month, day, 12, 0, 0);
  
  // Obtenir le jour de la semaine
  const currentDayOfWeek = checkDate.getDay();
  
  // Si nous sommes un week-end (samedi=6 ou dimanche=0), commencer à partir du lundi suivant
  if (currentDayOfWeek === 0) { // Dimanche
    checkDate.setDate(checkDate.getDate() + 1); // Passer au lundi
  } else if (currentDayOfWeek === 6) { // Samedi
    checkDate.setDate(checkDate.getDate() + 2); // Passer au lundi
  } else {
    // Si nous sommes un jour ouvré, vérifier si nous sommes encore dans les heures de travail
    const currentHour = currentDateTime.getHours();
    if (currentHour >= WORK_HOURS.end) {
      // Si nous avons dépassé les heures de travail, commencer à partir de demain
      checkDate.setDate(checkDate.getDate() + 1);
    }
  }
  
  let daysAdded = 0;
  let attempts = 0;
  const maxAttempts = 14; // Éviter les boucles infinies

  while (daysAdded < count && attempts < maxAttempts) {
    // Obtenir le jour de la semaine
    const dayOfWeek = checkDate.getDay();
    
    // Inclure seulement les jours ouvrés (lundi=1 à vendredi=5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Créer une copie de la date pour éviter les références partagées
      businessDays.push(new Date(checkDate));
      daysAdded++;
    }
    
    // Passer au jour suivant
    checkDate.setDate(checkDate.getDate() + 1);
    attempts++;
  }

  // Log pour le débogage (toujours actif pour le suivi)
  const businessDaysFormatted = businessDays.map(d => {
    // Formater la date en YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  console.log('[CALENDAR API] Date actuelle en Europe/Paris:', currentDateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
  console.log('[CALENDAR API] Jours ouvrés calculés:', businessDaysFormatted);

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
    // Vérifier les variables d'environnement requises
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('[CALENDAR API] Variables d\'environnement Google manquantes');
      return NextResponse.json(
        { error: 'Configuration Google Calendar manquante' },
        { status: 500 }
      );
    }

    // Obtenir l'heure actuelle pour le débogage
    const currentTime = getCurrentDateTimeInParis();
    console.log('[CALENDAR API] ===== DÉBUT DE LA REQUÊTE =====');
    console.log('[CALENDAR API] Timestamp serveur:', new Date().toISOString());
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
        console.log(`[CALENDAR API] Jour ${date.toISOString().split('T')[0]}: ${events.length} événements trouvés`);

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
        
        // Log pour le débogage (toujours actif)
        console.log(`[CALENDAR API] Jour ${date.toISOString().split('T')[0]}: ${freeSlots.length} créneaux avant filtrage, ${filteredSlots.length} après filtrage`);
        
        return {
          date: date.toISOString(),
          freeSlots: filteredSlots
        };
      })
    );

    console.log('[CALENDAR API] ===== FIN DE LA REQUÊTE =====');
    console.log(`[CALENDAR API] Total: ${dailyAvailabilities.length} jours avec disponibilités`);

    // Désactiver le cache pour cette route
    // IMPORTANT: Ces headers empêchent Vercel et les CDN de mettre en cache la réponse
    return NextResponse.json(
      { dailyAvailabilities },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
        }
      }
    );
  } catch (error) {
    console.error('[CALENDAR API] Erreur dans l\'API availability:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        }
      }
    );
  }
} 