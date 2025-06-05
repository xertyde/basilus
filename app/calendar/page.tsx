import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Log de base pour vérifier que le code s'exécute
console.log('=== CALENDAR PAGE LOADING ===');

// Types
interface TimeSlot {
  start: Date;
  end: Date;
}

interface Availability {
  start: string;
  end: string;
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

    console.log('Recherche des événements pour:', {
      calendarId,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });

    const response = await calendar.events.list({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Événements trouvés:', response.data.items?.length || 0);
    if (response.data.items?.length) {
      console.log('Premier événement:', response.data.items[0]);
    }

    return response.data.items || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des événements du calendrier ${calendarId}:`, error);
    return [];
  }
}

// Fonction pour fusionner les événements de deux calendriers
function mergeEvents(events1: GoogleCalendarEvent[], events2: GoogleCalendarEvent[]): TimeSlot[] {
  console.log('Fusion des événements:', {
    events1: events1.length,
    events2: events2.length
  });

  const allEvents = [...events1, ...events2].map(event => {
    if (!event.start || !event.end) {
      console.warn('Événement invalide:', event);
      return null;
    }

    const startTime = event.start.dateTime || event.start.date;
    const endTime = event.end.dateTime || event.end.date;

    if (!startTime || !endTime) {
      console.warn('Événement invalide: dateTime ou date manquant', event);
      return null;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    
    console.log('Événement traité:', {
      summary: event.summary,
      start: start.toISOString(),
      end: end.toISOString()
    });

    return { start, end };
  }).filter((event): event is TimeSlot => event !== null);

  // Trier les événements par date de début
  return allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Fonction pour décomposer un créneau en créneaux d'une heure
function splitIntoHourlySlots(startTime: Date, endTime: Date): Availability[] {
  const hourlySlots: Availability[] = [];
  const current = new Date(startTime);
  
  while (current < endTime) {
    const slotEnd = new Date(current);
    slotEnd.setHours(slotEnd.getHours() + 1);
    
    // S'assurer de ne pas dépasser l'heure de fin
    if (slotEnd <= endTime) {
      hourlySlots.push({
        start: formatTime(current),
        end: formatTime(slotEnd),
      });
    }
    
    current.setHours(current.getHours() + 1);
  }
  
  return hourlySlots;
}

// Fonction pour calculer les créneaux libres
function calculateFreeSlots(events: TimeSlot[], date: Date): Availability[] {
  const freeSlots: Availability[] = [];
  
  // Créer les limites de la journée de travail
  const workStart = new Date(date);
  workStart.setHours(WORK_HOURS.start, 0, 0, 0);
  
  const workEnd = new Date(date);
  workEnd.setHours(WORK_HOURS.end, 0, 0, 0);

  // Si pas d'événements, toute la journée est libre
  if (events.length === 0) {
    return splitIntoHourlySlots(workStart, workEnd);
  }

  // Vérifier le créneau avant le premier événement
  if (events[0].start > workStart) {
    const slotStart = workStart;
    const slotEnd = roundDownToPreviousHour(events[0].start);
    
    // Vérifier que le créneau arrondi est valide (au moins 1 heure)
    if (slotEnd > slotStart) {
      freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd));
    }
  }

  // Vérifier les créneaux entre les événements
  for (let i = 0; i < events.length - 1; i++) {
    if (events[i].end < events[i + 1].start) {
      const slotStart = roundUpToNextHour(events[i].end);
      const slotEnd = roundDownToPreviousHour(events[i + 1].start);
      
      // Vérifier que le créneau arrondi est valide (au moins 1 heure)
      if (slotEnd > slotStart) {
        freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd));
      }
    }
  }

  // Vérifier le créneau après le dernier événement
  if (events[events.length - 1].end < workEnd) {
    const slotStart = roundUpToNextHour(events[events.length - 1].end);
    const slotEnd = workEnd;
    
    // Vérifier que le créneau arrondi est valide (au moins 1 heure)
    if (slotEnd > slotStart) {
      freeSlots.push(...splitIntoHourlySlots(slotStart, slotEnd));
    }
  }

  return freeSlots;
}

// Fonction utilitaire pour formater l'heure
function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Fonction pour arrondir une heure de début à l'heure supérieure
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

// Fonction pour arrondir une heure de fin à l'heure inférieure
function roundDownToPreviousHour(date: Date): Date {
  const rounded = new Date(date);
  if (rounded.getMinutes() > 0 || rounded.getSeconds() > 0) {
    rounded.setMinutes(0);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
  } else {
    // Si c'est déjà une heure ronde, on garde la même heure
    rounded.setMinutes(0);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
  }
  return rounded;
}

// Fonction pour formater la date
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Fonction pour obtenir les 5 prochains jours ouvrables
function getNextBusinessDays(count: number = 5): Date[] {
  const businessDays: Date[] = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  let daysAdded = 0;
  let checkDate = new Date(currentDate);
  
  while (daysAdded < count) {
    const dayOfWeek = checkDate.getDay();
    // 0 = Dimanche, 6 = Samedi
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays.push(new Date(checkDate));
      daysAdded++;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return businessDays;
}

// Exemple de données fictives pour les tests
const mockEvents = {
  [CALENDAR_IDS.THOMAS]: [
    {
      start: { dateTime: '2024-03-20T10:00:00+01:00' },
      end: { dateTime: '2024-03-20T12:00:00+01:00' },
    },
    {
      start: { dateTime: '2024-03-20T14:00:00+01:00' },
      end: { dateTime: '2024-03-20T16:00:00+01:00' },
    },
  ],
};

// Fonction simulée pour les tests
async function getMockEvents(calendarId: string) {
  return mockEvents[calendarId] || [];
}

// Composant principal
export default async function CalendarPage() {
  console.log('=== CALENDAR PAGE RENDERING ===');
  const businessDays = getNextBusinessDays(5);
  
  try {
    // Récupération des événements pour tous les jours ouvrables
    console.log('Fetching calendar events for business days...');
    
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
        
        return {
          date,
          freeSlots
        };
      })
    );

    console.log('Events fetched for all business days');

    return (
      <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Réservez votre rendez-vous
            </h1>
            <div className="text-lg text-muted-foreground mb-2">
              Rendez-vous téléphoniques ou visioconférence
            </div>
            <div className="text-base text-muted-foreground">
              Disponibilités des 5 prochains jours ouvrables
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center mb-8">
            <p>Heures de disponibilité : {WORK_HOURS.start}h - {WORK_HOURS.end}h</p>
          </div>

          <div className="space-y-8">
            {dailyAvailabilities.map((dayAvailability, dayIndex) => (
              <div key={dayIndex} className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {formatDate(dayAvailability.date)}
                </h2>
                
                {dayAvailability.freeSlots.length === 0 ? (
                  <p className="text-muted-foreground">
                    Aucune disponibilité pour cette journée.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dayAvailability.freeSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="p-3 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-base font-medium">
                          {slot.start} - {slot.end}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CalendarPage:', error);
    return (
      <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-red-500">
            Erreur lors du chargement du calendrier
          </h1>
          <p className="text-center text-muted-foreground">
            Une erreur est survenue lors de la récupération des disponibilités.
          </p>
        </div>
      </div>
    );
  }
} 