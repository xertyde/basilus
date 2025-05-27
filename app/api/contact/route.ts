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

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'thomasfonferrier@gmail.com',
        pass: 'auam gmkf hbkd vork'
      },
      debug: true, // Enable debug logging
      logger: true // Log to console
    });

    const mailOptions = {
      from: '"Basilus Contact Form" <thomasfonferrier@gmail.com>',
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

    console.log('Attempting to verify SMTP connection...');
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    console.log('Attempting to send email...');
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent successfully:', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}