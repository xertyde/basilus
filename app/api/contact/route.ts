import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const data = await req.json();
    console.log('Received form data:', data);
    
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter with Gmail App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send notification to admin
    const adminMailOptions = {
      from: {
        name: 'Basilus Contact Form',
        address: process.env.GMAIL_USER as string
      },
      to: process.env.GMAIL_USER as string,
      subject: `Nouvelle demande de contact - ${data.name}`,
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pack choisi:</strong> ${data.pack}</p>
        <p><strong>Options supplémentaires:</strong> ${data.addons?.join(', ') || 'Aucune'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: data.email
    };

    // Send confirmation to user
    const userMailOptions = {
      from: {
        name: 'Basilus',
        address: process.env.GMAIL_USER as string
      },
      to: data.email,
      subject: 'Confirmation de votre message - Basilus',
      html: `
        <h2>Merci de nous avoir contacté, ${data.name} !</h2>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Pour rappel, voici un résumé de votre demande :</p>
        <ul>
          <li><strong>Pack choisi :</strong> ${data.pack}</li>
          ${data.addons?.length ? `<li><strong>Options :</strong> ${data.addons.join(', ')}</li>` : ''}
        </ul>
        <p>Votre message :</p>
        <blockquote style="margin: 1em 0; padding: 1em; background: #f5f5f5; border-left: 4px solid #333;">
          ${data.message.replace(/\n/g, '<br>')}
        </blockquote>
        <p>À très bientôt,</p>
        <p>L'équipe Basilus</p>
      `
    };

    console.log('Sending emails...');
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);
    console.log('Emails sent successfully');
    
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}