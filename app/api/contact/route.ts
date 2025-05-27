import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'thomasfonferrier@gmail.com',
        pass: 'auam gmkf hbkd vork'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: 'thomasfonferrier@gmail.com',
      to: 'thomasfonferrier@gmail.com',
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

    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent successfully:', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}