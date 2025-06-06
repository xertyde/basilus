import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Configuration
const CALENDAR_IDS = {
  THOMAS: 'thomasfonferrier@gmail.com',
};

const resend = new Resend(process.env.RESEND_API_KEY);

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

// Fonction pour envoyer un email avec le lien Jitsi
async function sendJitsiEmail(email: string, jitsiLink: string, eventDate: string, eventTime: string) {
  try {
    // Corriger le formatage de la date
    const [year, month, day] = eventDate.split('-');
    const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const { data, error } = await resend.emails.send({
      from: 'Basilus <contact@basilus.fr>',
      to: [email],
      subject: 'Votre lien de visioconférence - Rendez-vous Basilus',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style type="text/css">
            body { 
              background-color: #f9fafb; 
              font-family: 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .container {
              background-color: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #f63c7a;
              padding-bottom: 20px;
            }
            .divider { 
              border-top: 1px solid #e5e7eb; 
              margin: 25px 0; 
            }
            .footer { 
              font-size: 14px; 
              color: #6B7280; 
              text-align: center; 
              margin-top: 30px; 
            }
            .button { 
              background-color: #f63c7a; 
              color: white !important; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 8px; 
              display: inline-block; 
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .meeting-info {
              background-color: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .jitsi-link {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 6px;
              padding: 15px;
              font-family: monospace;
              word-break: break-all;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #f63c7a; margin: 0;">Basilus</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Votre rendez-vous en visioconférence</p>
            </div>

            <p>Bonjour,</p>
            
            <p>Nous vous confirmons votre rendez-vous en visioconférence avec notre équipe Basilus.</p>
            
            <div class="meeting-info">
              <h3 style="color: #0ea5e9; margin-top: 0;">📅 Détails du rendez-vous</h3>
              <p><strong>Date :</strong> ${formattedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Heure :</strong> ${eventTime}</p>
              <p><strong>Type :</strong> Visioconférence Jitsi Meet</p>
            </div>

            <h3 style="color: #f63c7a;">🎥 Lien de la réunion</h3>
            <p>Cliquez sur le bouton ci-dessous pour rejoindre la visioconférence :</p>
            
            <div style="text-align: center;">
              <a href="${jitsiLink}" class="button">
                🎥 Rejoindre la visioconférence
              </a>
            </div>

            <p><strong>Ou copiez ce lien dans votre navigateur :</strong></p>
            <div class="jitsi-link">
              ${jitsiLink}
            </div>

            <div class="divider"></div>

            <h3 style="color: #374151;">💡 Conseils pour une meilleure expérience</h3>
            <ul style="color: #6B7280;">
              <li>Testez votre caméra et votre microphone avant la réunion</li>
              <li>Utilisez un navigateur récent (Chrome, Firefox, Safari)</li>
              <li>Connectez-vous quelques minutes avant l'heure prévue</li>
              <li>Privilégiez une connexion internet stable</li>
            </ul>

            <div class="divider"></div>

            <p style="color: #6B7280;">
              Si vous rencontrez des difficultés techniques, n'hésitez pas à nous contacter par email ou par téléphone.
            </p>

            <p>À très bientôt !</p>
            <p><strong>L'équipe Basilus</strong></p>

            <div class="footer">
              <p>Basilus - Création de sites web sur-mesure</p>
              <p>
                <a href="https://www.basilus.fr" style="color: #f63c7a; text-decoration: none;">www.basilus.fr</a> | 
                <a href="mailto:contact@basilus.fr" style="color: #f63c7a; text-decoration: none;">contact@basilus.fr</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Fonction pour envoyer un email de confirmation pour les rendez-vous téléphoniques
async function sendPhoneEmail(email: string, phoneNumber: string, eventDate: string, eventTime: string) {
  try {
    // Corriger le formatage de la date
    const [year, month, day] = eventDate.split('-');
    const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const { data, error } = await resend.emails.send({
      from: 'Basilus <contact@basilus.fr>',
      to: [email],
      subject: 'Confirmation de votre rendez-vous téléphonique - Basilus',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style type="text/css">
            body { 
              background-color: #f9fafb; 
              font-family: 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .container {
              background-color: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #f63c7a;
              padding-bottom: 20px;
            }
            .divider { 
              border-top: 1px solid #e5e7eb; 
              margin: 25px 0; 
            }
            .footer { 
              font-size: 14px; 
              color: #6B7280; 
              text-align: center; 
              margin-top: 30px; 
            }
            .meeting-info {
              background-color: #f0fdf4;
              border: 1px solid #22c55e;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .phone-info {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 6px;
              padding: 15px;
              margin: 15px 0;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #f63c7a; margin: 0;">Basilus</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Votre rendez-vous téléphonique</p>
            </div>

            <p>Bonjour,</p>
            
            <p>Nous vous confirmons votre rendez-vous téléphonique avec notre équipe Basilus.</p>
            
            <div class="meeting-info">
              <h3 style="color: #22c55e; margin-top: 0;">📅 Détails du rendez-vous</h3>
              <p><strong>Date :</strong> ${formattedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Heure :</strong> ${eventTime}</p>
              <p><strong>Type :</strong> Rendez-vous téléphonique</p>
            </div>

            <h3 style="color: #f63c7a;">📞 Informations d'appel</h3>
            <p>Nous vous appellerons au numéro que vous avez fourni :</p>
            
            <div class="phone-info">
              <p style="font-size: 18px; font-weight: 600; color: #374151; margin: 0;">
                📱 ${phoneNumber}
              </p>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⚠️ Important :</strong> Assurez-vous d'être disponible à l'heure prévue. Notre équipe vous contactera directement sur ce numéro.
              </p>
            </div>

            <div class="divider"></div>

            <h3 style="color: #374151;">💡 Conseils pour votre rendez-vous</h3>
            <ul style="color: #6B7280;">
              <li>Assurez-vous que votre téléphone est chargé et accessible</li>
              <li>Préparez vos questions en amont de l'appel</li>
              <li>Privilégiez un environnement calme pour l'entretien</li>
              <li>Ayez un carnet et un stylo à portée de main</li>
            </ul>

            <div class="divider"></div>

            <p style="color: #6B7280;">
              Si vous devez reporter ou annuler votre rendez-vous, contactez-nous par email au plus tôt.
            </p>

            <p>À très bientôt !</p>
            <p><strong>L'équipe Basilus</strong></p>

            <div class="footer">
              <p>Basilus - Création de sites web sur-mesure</p>
              <p>
                <a href="https://www.basilus.fr" style="color: #f63c7a; text-decoration: none;">www.basilus.fr</a> | 
                <a href="mailto:contact@basilus.fr" style="color: #f63c7a; text-decoration: none;">contact@basilus.fr</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Fonction pour créer un événement dans le calendrier
async function createCalendarEvent(calendarId: string, eventData: {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
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
      description: eventData.description,
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, meetingType, email, phoneNumber } = body;

    if (!slotId) {
      return NextResponse.json(
        { error: 'ID du créneau manquant' },
        { status: 400 }
      );
    }

    if (!meetingType) {
      return NextResponse.json(
        { error: 'Type de rendez-vous manquant' },
        { status: 400 }
      );
    }

    // Validation des champs requis
    if (!email) {
      return NextResponse.json(
        { error: 'Adresse email requise pour la confirmation' },
        { status: 400 }
      );
    }

    if (meetingType === 'phone' && !phoneNumber) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis pour un rendez-vous téléphonique' },
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

    // Créer la description selon le type de rendez-vous
    let description = 'Rendez-vous réservé via le site web Basilus\n\n';
    
    if (meetingType === 'phone') {
      description += 'Type: rdv téléphonique\n';
      description += `Numéro de téléphone: ${phoneNumber}`;
    } else if (meetingType === 'video') {
      description += 'Type: rdv visio\n';
      description += `Email: ${email}`;
    }

    const eventData = {
      date,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      title: 'rdv basilus',
      description,
    };

    // Créer l'événement dans le calendrier
    const createdEvent = await createCalendarEvent(CALENDAR_IDS.THOMAS, eventData);

    // Envoi de l'email de confirmation selon le type de rendez-vous
    try {
      if (meetingType === 'video') {
        const meetingRoomId = `basilus-${slotId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
        const jitsiLink = `https://meet.jit.si/${meetingRoomId}`;
        await sendJitsiEmail(email, jitsiLink, date, `${formatTime(startTime)} - ${formatTime(endTime)}`);
      } else if (meetingType === 'phone') {
        await sendPhoneEmail(email, phoneNumber, date, `${formatTime(startTime)} - ${formatTime(endTime)}`);
      }
    } catch (emailError) {
      // On ne fait pas échouer la réservation si l'email échoue
    }
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
    return NextResponse.json(
      { 
        error: 'Erreur lors de la réservation du créneau',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 