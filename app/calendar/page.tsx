import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Types
interface TimeSlot {
  start: Date;
  end: Date;
}

interface Availability {
  start: string;
  end: string;
}

// Configuration
const CALENDAR_IDS = {
  THOMAS: 'thomasfonferrier@gmail.com',
  // Gardons un second calendrier pour la démonstration
  CALENDAR_2: 'calendar2@group.calendar.google.com',
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
    console.error(`Erreur lors de la récupération des événements du calendrier ${calendarId}:`, error);
    return [];
  }
}

// Fonction pour fusionner les événements de deux calendriers
function mergeEvents(events1: any[], events2: any[]): TimeSlot[] {
  const allEvents = [...events1, ...events2].map(event => ({
    start: new Date(event.start.dateTime || event.start.date),
    end: new Date(event.end.dateTime || event.end.date),
  }));

  // Trier les événements par date de début
  return allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
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
    return [{
      start: formatTime(workStart),
      end: formatTime(workEnd),
    }];
  }

  // Vérifier le créneau avant le premier événement
  if (events[0].start > workStart) {
    freeSlots.push({
      start: formatTime(workStart),
      end: formatTime(events[0].start),
    });
  }

  // Vérifier les créneaux entre les événements
  for (let i = 0; i < events.length - 1; i++) {
    if (events[i].end < events[i + 1].start) {
      freeSlots.push({
        start: formatTime(events[i].end),
        end: formatTime(events[i + 1].start),
      });
    }
  }

  // Vérifier le créneau après le dernier événement
  if (events[events.length - 1].end < workEnd) {
    freeSlots.push({
      start: formatTime(events[events.length - 1].end),
      end: formatTime(workEnd),
    });
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
  [CALENDAR_IDS.CALENDAR_2]: [
    {
      start: { dateTime: '2024-03-20T11:00:00+01:00' },
      end: { dateTime: '2024-03-20T13:00:00+01:00' },
    },
    {
      start: { dateTime: '2024-03-20T15:00:00+01:00' },
      end: { dateTime: '2024-03-20T17:00:00+01:00' },
    },
  ],
};

// Fonction simulée pour les tests
async function getMockEvents(calendarId: string) {
  return mockEvents[calendarId] || [];
}

// Composant principal
export default async function CalendarPage() {
  const today = new Date();
  
  // Utilisation de la vraie fonction getCalendarEvents
  const events1 = await getCalendarEvents(CALENDAR_IDS.THOMAS, today);
  const events2 = await getCalendarEvents(CALENDAR_IDS.CALENDAR_2, today);
  
  const mergedEvents = mergeEvents(events1, events2);
  const freeSlots = calculateFreeSlots(mergedEvents, today);

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Disponibilités pour le {today.toLocaleDateString('fr-FR')}
        </h1>

        {freeSlots.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucune disponibilité pour aujourd'hui.
          </p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Créneaux disponibles :</h2>
            <div className="grid gap-4">
              {freeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-lg border border-border shadow-sm"
                >
                  <p className="text-lg font-medium">
                    {slot.start} - {slot.end}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 