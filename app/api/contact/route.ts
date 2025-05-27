import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thomasfonferrier@gmail.com',
        pass: 'auam gmkf hbkd vork'
      }
    });

    const mailOptions = {
      from: 'thomasfonferrier@gmail.com',
      to: 'thomasfonferrier@gmail.com',
      subject: 'Nouvelle demande de contact - Basilus',
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pack choisi:</strong> ${data.pack}</p>
        <p><strong>Options supplémentaires:</strong> ${data.addons.join(', ') || 'Aucune'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}