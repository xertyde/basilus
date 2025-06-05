import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

// Configuration
const CALENDAR_IDS = {
  THOMAS: 'thomasfonferrier@gmail.com',
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

// Fonction pour créer un événement dans le calendrier
async function createCalendarEvent(calendarId: string, eventData: {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
}) {
  try {
    const auth = await getOAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Construire les dates de début et fin
    const startDateTime = `${eventData.date}T${eventData.startTime}:00+01:00`;
    const endDateTime = `${eventData.date}T${eventData.endTime}:00+01:00`;

    const event = {
      summary: eventData.title,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Paris',
      },
      description: 'Rendez-vous réservé via le site web Basilus',
    };

    console.log('Création d\'événement:', {
      summary: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
    });

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log('Événement créé:', response.data.id);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la création de l'événement:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId } = body;

    if (!slotId) {
      return NextResponse.json(
        { error: 'ID du créneau manquant' },
        { status: 400 }
      );
    }

    // Extraire les informations du slotId
    // Format: "YYYY-MM-DD_HH:MM_HH:MM"
    const parts = slotId.split('_');
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: 'Format de créneau invalide' },
        { status: 400 }
      );
    }

    const [date, startTime, endTime] = parts;

    // Convertir les heures au format HH:MM
    const formatTime = (time: string) => {
      // time est au format "HH:MM"
      return time;
    };

    const eventData = {
      date,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      title: 'rdv basilus',
    };

    console.log('Données de réservation:', eventData);

    // Créer l'événement dans le calendrier
    const createdEvent = await createCalendarEvent(CALENDAR_IDS.THOMAS, eventData);

    return NextResponse.json({
      success: true,
      event: {
        id: createdEvent.id,
        summary: createdEvent.summary,
        start: createdEvent.start?.dateTime,
        end: createdEvent.end?.dateTime,
      },
      message: 'Créneau réservé avec succès'
    });

  } catch (error) {
    console.error('Error booking calendar slot:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la réservation du créneau',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 