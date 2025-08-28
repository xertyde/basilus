import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@^1.16.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Prix des packs et options
const PACK_PRICES = {
  'starter': 590,
  'pro': 990,
  'sur-mesure': 1790,
  'custom': 1790  // Alias pour sur-mesure
};

const ADDON_PRICES = {
  'mobile': 190,            // Adaptation mobile
  'backend': 799,           // Backend personnalisé
  'page-supplementaire': 50 // Page supplémentaire
};

// Mapping des noms d'options pour l'affichage
const ADDON_DISPLAY_NAMES = {
  'mobile': 'Adaptation mobile',
  'backend': 'Backend personnalisé',
  'page-supplementaire': 'Page supplémentaire'
};

// Fonction pour valider et nettoyer les options
function validateAddons(addons: string[]): string[] {
  console.log('Options reçues dans validateAddons:', addons);
  
  // S'assurer que addons est un tableau
  const addonsArray = Array.isArray(addons) ? addons : [];
  
  // Filtrer uniquement les options valides
  const validAddons = addonsArray.filter(addon => {
    const isValid = addon in ADDON_PRICES;
    console.log(`Option "${addon}" est ${isValid ? 'valide' : 'invalide'}`);
    return isValid;
  });
  
  console.log('Options valides après filtrage:', validAddons);
  return validAddons;
}

async function generateDevisPDF(name: string, pack: string, addons: string[] = [], companyName?: string, companyAddress?: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Couleurs
  const primaryColor = rgb(0.15, 0.15, 0.15); // Gris foncé
  const accentColor = rgb(0.96, 0.24, 0.48); // Rose Basilus
  const textColor = rgb(0.2, 0.2, 0.2); // Texte principal
  const lightGray = rgb(0.9, 0.9, 0.9); // Gris clair pour les séparateurs

  // En-tête avec logo et informations
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width: width,
    height: 100,
    color: accentColor,
  });

  // Titre du devis
  page.drawText('DEVIS', {
    x: 50,
    y: height - 70,
    size: 32,
    font,
    color: rgb(1, 1, 1),
  });

  // Informations de l'entreprise
  page.drawText('Basilus', {
    x: width - 200,
    y: height - 60,
    size: 20,
    font,
    color: rgb(1, 1, 1),
  });

  page.drawText('Création de sites web sur-mesure', {
    x: width - 200,
    y: height - 80,
    size: 10,
    font: regularFont,
    color: rgb(1, 1, 1),
  });

  // Informations du client
  let yPosition = height - 150;
  page.drawText('Informations client', {
    x: 50,
    y: yPosition,
    size: 14,
    font,
    color: primaryColor,
  });

  yPosition -= 25;
  page.drawText(`Client: ${name}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  if (companyName) {
    yPosition -= 15;
    page.drawText(`Entreprise: ${companyName}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: textColor,
    });
  }

  if (companyAddress) {
    yPosition -= 15;
    page.drawText(`Adresse: ${companyAddress}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: textColor,
  });
  }

  yPosition -= 15;
  page.drawText(`Date: ${new Date().toLocaleDateString('fr-FR')}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  // Mention du caractère provisoire
  yPosition -= 30;
  page.drawRectangle({
    x: 50,
    y: yPosition - 30,
    width: width - 100,
    height: 50,
    color: rgb(0.98, 0.98, 0.98),
  });

  page.drawText('DEVIS PROVISOIRE', {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: accentColor,
  });

  yPosition -= 15;
  page.drawText('Ce devis est une estimation préliminaire basée sur les informations fournies.', {
    x: 50,
    y: yPosition,
    size: 9,
    font: regularFont,
    color: textColor,
  });

  yPosition -= 12;
  page.drawText('Un devis final sera établi suite à un échange détaillé avec notre équipe.', {
    x: 50,
    y: yPosition,
    size: 9,
    font: regularFont,
    color: textColor,
  });

  // Ligne de séparation
  yPosition -= 20;
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: lightGray,
  });

  // Détails du devis
  yPosition -= 30;
  page.drawText('Détails du devis', {
    x: 50,
    y: yPosition,
    size: 14,
    font,
    color: primaryColor,
  });

  // Pack choisi
  yPosition -= 25;
  page.drawText('Pack sélectionné:', {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: textColor,
  });
  
  yPosition -= 20;
  const packPrice = PACK_PRICES[pack as keyof typeof PACK_PRICES] || 0;
  const displayPackName = pack === 'custom' ? 'sur-mesure' : pack;
  page.drawText(`${displayPackName}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  page.drawText(`${packPrice}€ HT`, {
    x: width - 150,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  // Options
  yPosition -= 30;
  page.drawText('Options:', {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: textColor,
  });

  yPosition -= 20;
  const validAddons = validateAddons(addons);
  if (validAddons.length > 0) {
    validAddons.forEach(addon => {
      const price = ADDON_PRICES[addon as keyof typeof ADDON_PRICES] ?? 0;
      const displayName = ADDON_DISPLAY_NAMES[addon as keyof typeof ADDON_DISPLAY_NAMES] || addon;
      
      page.drawText(displayName, {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: textColor,
      });
      page.drawText(`${price}€ HT`, {
        x: width - 150,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: textColor,
      });
      yPosition -= 15;
    });
  } else {
    page.drawText('Aucune option supplémentaire', {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    yPosition -= 15;
  }

  // Ligne de séparation
  yPosition -= 15;
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: lightGray,
  });

  // Total
  yPosition -= 30;
  const addonsPrice = validAddons.reduce((sum, addon) => {
    const price = ADDON_PRICES[addon as keyof typeof ADDON_PRICES] || 0;
    return sum + price;
  }, 0);
  
  const totalHT = packPrice + addonsPrice;
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;

  page.drawText('Total HT:', {
    x: width - 250,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  page.drawText(`${totalHT.toFixed(2)}€`, {
    x: width - 150,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  yPosition -= 15;
  page.drawText('TVA (20%):', {
    x: width - 250,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  page.drawText(`${tva.toFixed(2)}€`, {
    x: width - 150,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  yPosition -= 15;
  page.drawText('Total TTC:', {
    x: width - 250,
    y: yPosition,
    size: 12,
    font,
    color: primaryColor,
  });
  page.drawText(`${totalTTC.toFixed(2)}€`, {
    x: width - 150,
    y: yPosition,
    size: 12,
    font,
    color: primaryColor,
  });

  // Conditions de paiement simplifiées
  yPosition -= 40;
  page.drawText('Conditions de paiement', {
    x: 50,
    y: yPosition,
    size: 14,
    font,
    color: primaryColor,
  });

  yPosition -= 25;
  const acompte = totalTTC * 0.3;
  const solde = totalTTC * 0.7;

  page.drawText('Acompte (30%) :', {
    x: 50,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  page.drawText(`${acompte.toFixed(2)}€`, {
    x: 200,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  yPosition -= 20;
  page.drawText('Solde (70%) :', {
    x: 50,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  page.drawText(`${solde.toFixed(2)}€`, {
    x: 200,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor,
  });

  // Pied de page
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 80,
    color: lightGray,
  });

  page.drawText('Basilus - Création de sites web sur-mesure', {
    x: 50,
    y: 50,
    size: 10,
    font: regularFont,
    color: textColor,
  });

  page.drawText('contact@basilus.fr - www.basilus.fr', {
    x: 50,
    y: 35,
    size: 10,
    font: regularFont,
    color: textColor,
  });

  // Mentions légales
  page.drawText('Ce devis est valable 30 jours à compter de sa date d\'émission', {
    x: 50,
    y: 20,
    size: 8,
    font: regularFont,
    color: textColor,
  });

  return await pdfDoc.save();
}

async function sendEmailWithResend(to: string[], subject: string, html: string, pdfBytes: Uint8Array, pdfName: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Basilus <contact@basilus.fr>',
        to,
        subject,
        html,
        attachments: [{
          content: btoa(String.fromCharCode(...pdfBytes)),
          filename: pdfName,
          contentType: 'application/pdf'
        }]
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      throw new Error(`Email failed: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    if (!body.name || !body.email) {
      return new Response(JSON.stringify({
        error: "Name and email are required"
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Log détaillé des données reçues
    console.log('Données reçues:', {
      name: body.name,
      email: body.email,
      companyName: body.companyName,
      companyAddress: body.companyAddress,
      pack: body.pack,
      addons: body.addons,
      message: body.message
    });

    // Validation des options
    const validAddons = validateAddons(body.addons || []);
    console.log('Options finales validées:', validAddons);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      db: { schema: 'public' },
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: body.name,
        email: body.email,
        companyName: body.companyName || null,
        companyAddress: body.companyAddress || null,
        pack: body.pack || null,
        addons: validAddons,
        message: body.message || null
      }])
      .select();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    // Génération du PDF avec les options validées
    const pdfBytes = await generateDevisPDF(
      body.name, 
      body.pack || 'starter', 
      validAddons,
      body.companyName,
      body.companyAddress
    );
    const pdfName = `Devis_Basilus_${new Date().toISOString().split('T')[0]}.pdf`;

    // Envoi de l'email à votre équipe
    await sendEmailWithResend(
      ['contact@basilus.fr'],
      `Nouveau contact : ${body.name}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${body.name}</p>
          <p><strong>Email :</strong> <a href="mailto:${body.email}">${body.email}</a></p>
          ${body.companyName ? `<p><strong>Entreprise :</strong> ${body.companyName}</p>` : ''}
          ${body.companyAddress ? `<p><strong>Adresse :</strong> ${body.companyAddress}</p>` : ''}
          ${body.pack ? `<p><strong>Pack :</strong> ${body.pack}</p>` : ''}
          ${body.addons?.length ? `<p><strong>Addons :</strong> ${body.addons.join(', ')}</p>` : ''}
          ${body.message ? `<div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <strong>Message :</strong>
            <p style="white-space: pre-line;">${body.message}</p>
          </div>` : ''}
          <p>Un devis PDF a été généré et envoyé au client.</p>
        </div>
      `,
      pdfBytes,
      pdfName
    );

    // Envoi de l'email de confirmation au client
    await sendEmailWithResend(
      [body.email],
      'Votre devis Basilus',
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style type="text/css">
          body { background-color: #11172a; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { max-width: 150px; height: auto; }
          .divider { border-top: 2px solid #f63c7a; margin: 25px 0; }
          .footer { font-size: 14px; color: #6B7280; text-align: center; margin-top: 30px; }
          .button { background-color: #f63c7a; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; }
          .button:hover { color: white !important; }
          .signature { margin-top: 30px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color: #f63c7a; margin-top: 20px;">Basilus</h1>
        </div>

        <p>Bonjour ${body.name},</p>
        
        <p>Nous vous remercions chaleureusement pour votre demande de devis sur notre site Basilus.</p>
        
        <p>Vous trouverez ci-joint notre devis détaillé pour le pack <strong>${body.pack || 'Non spécifié'}</strong> et les options suivantes :</p>
        <ul>
          ${body.addons?.length ? body.addons.map(addon => `<li>${addon}</li>`).join('') : '<li>Aucune option supplémentaire</li>'}
        </ul>

        <div class="divider"></div>

        <p>Ce devis est valable 30 jours à compter de ce jour.</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://www.basilus.fr/contact" class="button">Nous contacter</a>
        </p>

        <p style="margin: 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
          Si vous n'avez pas encore répondu à notre formulaire pour préparer notre futur rendez-vous, cliquez sur ce lien : 
          <a href="https://www.basilus.fr/app/form" style="color: #f63c7a; text-decoration: none; font-weight: 500;">Accéder au formulaire</a>
        </p>

        <p style="margin: 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
          Besoin d'inspiration pour votre futur site ? Découvrez notre sélection de templates modernes et professionnels : 
          <a href="https://webflow.com/templates" style="color: #f63c7a; text-decoration: none; font-weight: 500;">Explorer les templates</a>
        </p>

        <div class="signature">
          <p>À très bientôt,</p>
          <p><strong>L'équipe Basilus</strong></p>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p>Basilus - Création de sites web sur-mesure</p>
          <p>
            <a href="https://www.basilus.fr" style="color: #f63c7a; text-decoration: none;">www.basilus.fr</a> | 
            <a href="mailto:contact@basilus.fr" style="color: #f63c7a; text-decoration: none;">contact@basilus.fr</a>
          </p>
        </div>
      </body>
      </html>
      `,
      pdfBytes,
      pdfName
    );

    return new Response(JSON.stringify({
      success: true,
      data: data
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});