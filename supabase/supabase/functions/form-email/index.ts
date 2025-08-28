import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@^1.16.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Vérification des variables d'environnement
console.log('Checking environment variables...');
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set!');
}
if (!SUPABASE_URL) {
  console.error('SUPABASE_URL is not set!');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set!');
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

async function generateFormPDF(formData: any) {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // Format A4
  let yPosition = currentPage.getSize().height - 150;
  const MARGIN_BOTTOM = 100; // Marge minimale en bas de page
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const HEADER_HEIGHT = 100;
  const HEADER_PADDING = 20;
  
  const { width, height } = currentPage.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Couleurs
  const primaryColor = rgb(0.15, 0.15, 0.15); // Gris foncé
  const accentColor = rgb(0.96, 0.24, 0.48); // Rose Basilus
  const textColor = rgb(0.2, 0.2, 0.2); // Texte principal
  const lightGray = rgb(0.9, 0.9, 0.9); // Gris clair pour les séparateurs

  // Fonction pour créer une nouvelle page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([595, 842]);
    yPosition = height - 150;
    
    // Ajouter l'en-tête sur la nouvelle page
    currentPage.drawRectangle({
      x: 0,
      y: height - HEADER_HEIGHT,
      width: width,
      height: HEADER_HEIGHT,
      color: accentColor,
    });

    // Titre principal
    currentPage.drawText('NOUVELLE DEMANDE DE PROJET', {
      x: MARGIN_LEFT,
      y: height - HEADER_HEIGHT + HEADER_PADDING + 30,
      size: 24,
      font,
      color: rgb(1, 1, 1),
    });

    // Logo et sous-titre à droite
    const rightSectionWidth = 200;
    const rightSectionX = width - rightSectionWidth - MARGIN_RIGHT;

    currentPage.drawText('Basilus', {
      x: rightSectionX,
      y: height - HEADER_HEIGHT + HEADER_PADDING + 30,
      size: 20,
      font,
      color: rgb(1, 1, 1),
    });

    currentPage.drawText('Création de sites web sur-mesure', {
      x: rightSectionX,
      y: height - HEADER_HEIGHT + HEADER_PADDING + 10,
      size: 10,
      font: regularFont,
      color: rgb(1, 1, 1),
    });
  };

  // Fonction pour ajouter le pied de page
  const addFooter = (page: PDFPage) => {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 80,
      color: lightGray,
    });

    page.drawText('Basilus - Création de sites web sur-mesure', {
      x: MARGIN_LEFT,
      y: 50,
      size: 10,
      font: regularFont,
      color: textColor,
    });
  };

  // Ajouter l'en-tête sur la première page
  currentPage.drawRectangle({
    x: 0,
    y: height - HEADER_HEIGHT,
    width: width,
    height: HEADER_HEIGHT,
    color: accentColor,
  });

  // Titre principal
  currentPage.drawText('NOUVELLE DEMANDE DE PROJET', {
    x: MARGIN_LEFT,
    y: height - HEADER_HEIGHT + HEADER_PADDING + 30,
    size: 24,
    font,
    color: rgb(1, 1, 1),
  });

  // Logo et sous-titre à droite
  const rightSectionWidth = 200;
  const rightSectionX = width - rightSectionWidth - MARGIN_RIGHT;

  currentPage.drawText('Basilus', {
    x: rightSectionX,
    y: height - HEADER_HEIGHT + HEADER_PADDING + 30,
    size: 20,
    font,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Création de sites web sur-mesure', {
    x: rightSectionX,
    y: height - HEADER_HEIGHT + HEADER_PADDING + 10,
    size: 10,
    font: regularFont,
    color: rgb(1, 1, 1),
  });

  // Fonction utilitaire pour ajouter une section
  const addSection = (title: string, content: { label: string; value: any }[]) => {
    // Vérifier si on a assez d'espace pour la section
    if (yPosition < MARGIN_BOTTOM + 100) { // 100px pour le titre et le premier élément
      addNewPage();
    }

    currentPage.drawText(title, {
      x: MARGIN_LEFT,
      y: yPosition,
      size: 14,
      font,
      color: primaryColor,
    });
    yPosition -= 25;

    content.forEach(item => {
      if (item.value !== null && item.value !== undefined && item.value !== '') {
        const label = `${item.label}: `;
        const value = String(item.value);
        
        // Vérifier si le texte dépasse la largeur de la page
        const maxWidth = width - MARGIN_LEFT - MARGIN_RIGHT;
        const textWidth = regularFont.widthOfTextAtSize(label + value, 10);
        
        if (textWidth > maxWidth) {
          // Diviser le texte en plusieurs lignes
          const words = value.split(' ');
          let currentLine = '';
          
          // Vérifier si on a assez d'espace pour le label
          if (yPosition < MARGIN_BOTTOM + 15) {
            addNewPage();
          }

          // Afficher le label sur la première ligne
          currentPage.drawText(label, {
            x: MARGIN_LEFT,
            y: yPosition,
            size: 10,
            font: regularFont,
            color: textColor,
          });
          
          // Calculer la position X pour le début du texte après le label
          const labelWidth = regularFont.widthOfTextAtSize(label, 10);
          let currentX = MARGIN_LEFT + labelWidth;
          
          for (const word of words) {
            const testLine = currentLine + word + ' ';
            const testWidth = regularFont.widthOfTextAtSize(testLine, 10);
            
            if (testWidth > maxWidth - labelWidth) {
              // Vérifier si on a assez d'espace pour une nouvelle ligne
              if (yPosition < MARGIN_BOTTOM + 15) {
                addNewPage();
              }

              currentPage.drawText(currentLine, {
                x: currentX,
                y: yPosition,
                size: 10,
                font: regularFont,
                color: textColor,
              });
              yPosition -= 15;
              currentLine = word + ' ';
              currentX = MARGIN_LEFT + labelWidth; // Réinitialiser la position X pour les lignes suivantes
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine) {
            // Vérifier si on a assez d'espace pour la dernière ligne
            if (yPosition < MARGIN_BOTTOM + 15) {
              addNewPage();
            }

            currentPage.drawText(currentLine, {
              x: currentX,
              y: yPosition,
              size: 10,
              font: regularFont,
              color: textColor,
            });
            yPosition -= 15;
          }
        } else {
          // Vérifier si on a assez d'espace pour une ligne
          if (yPosition < MARGIN_BOTTOM + 15) {
            addNewPage();
          }

          currentPage.drawText(label + value, {
            x: MARGIN_LEFT,
            y: yPosition,
            size: 10,
            font: regularFont,
            color: textColor,
          });
          yPosition -= 15;
        }
      }
    });
    
    yPosition -= 20;
  };

  // 1. Informations générales
  addSection('1. Informations générales', [
    { label: 'Nom de l\'entreprise', value: formData.company_name },
    { label: 'Secteur d\'activité', value: formData.industry_sector },
    { label: 'Slogan', value: formData.slogan },
    { label: 'Personne à contacter', value: formData.contact_person },
    { label: 'Email', value: formData.email },
    { label: 'Téléphone', value: formData.phone },
    { label: 'Site web existant', value: formData.existing_website },
    { label: 'Liens réseaux sociaux', value: formData.social_links },
    { label: 'Adresse physique', value: formData.physical_address },
  ]);

  // 2. Objectifs & vision
  addSection('2. Objectifs & vision', [
    { label: 'Raison du site web', value: formData.reason_for_website },
    { label: 'Objectifs stratégiques', value: formData.strategic_objectives },
    { label: 'Vision 1-3 ans', value: formData.vision_1_3_years },
    { label: 'Outil central', value: formData.is_central_tool },
    { label: 'Lié à un événement', value: formData.linked_to_event ? 'Oui' : 'Non' },
    { label: 'Détails de l\'événement', value: formData.event_details },
  ]);

  // 3. Cible & utilisateurs
  addSection('3. Cible & utilisateurs', [
    { label: 'Description de la cible', value: formData.target_description },
    { label: 'Ce qu\'ils doivent trouver', value: formData.what_to_find },
    { label: 'Appareils utilisés', value: formData.devices_used },
  ]);

  // 4. Identité de marque
  addSection('4. Identité de marque', [
    { label: 'Logo existant', value: formData.has_logo ? 'Oui' : 'Non' },
    { label: 'Charte graphique existante', value: formData.has_brand_guidelines ? 'Oui' : 'Non' },
    { label: 'Besoin de charte graphique', value: formData.need_brand_guidelines ? 'Oui' : 'Non' },
    { label: 'Univers de marque', value: formData.brand_universe },
    { label: 'Style souhaité', value: formData.desired_style },
  ]);

  // 5. Contenu & structure
  addSection('5. Contenu & structure', [
    { label: 'Plan du site existant', value: formData.has_site_map ? 'Oui' : 'Non' },
    { label: 'Pages à inclure', value: formData.pages_to_include },
    { label: 'Textes disponibles', value: formData.has_texts },
    { label: 'Médias disponibles', value: formData.has_media },
  ]);

  // 6. Design / inspiration
  addSection('6. Design / inspiration', [
    { label: 'Sites appréciés', value: formData.liked_sites },
    { label: 'Sites non appréciés', value: formData.disliked_sites },
    { label: 'Contraintes de design', value: formData.design_constraints },
    { label: 'Ton éditorial', value: formData.editorial_tone },
  ]);

  // 7. Fonctionnalités attendues
  addSection('7. Fonctionnalités attendues', [
    { label: 'Fonctionnalités attendues', value: formData.expected_features },
    { label: 'Outils externes', value: formData.external_tools },
    { label: 'Type de site', value: formData.site_type },
  ]);

  // 8. Référencement SEO
  addSection('8. Référencement SEO', [
    { label: 'Travail SEO précédent', value: formData.has_worked_on_seo !== undefined ? (formData.has_worked_on_seo ? 'Oui' : 'Non') : undefined },
    { label: 'Service SEO souhaité', value: formData.wants_seo_service !== undefined ? (formData.wants_seo_service ? 'Oui' : 'Non') : undefined },
    { label: 'Concurrents SEO', value: formData.seo_competitors },
  ]);

  // 9. Hébergement & nom de domaine
  addSection('9. Hébergement & nom de domaine', [
    { label: 'Nom de domaine existant', value: formData.has_domain !== undefined ? (formData.has_domain ? 'Oui' : 'Non') : undefined },
    { label: 'Achat de nom de domaine nécessaire', value: formData.needs_domain_purchase !== undefined ? (formData.needs_domain_purchase ? 'Oui' : 'Non') : undefined },
    { label: 'Hébergement existant', value: formData.has_hosting !== undefined ? (formData.has_hosting ? 'Oui' : 'Non') : undefined },
    { label: 'Détails hébergement', value: formData.hosting_details },
    { label: 'Gestion hébergement souhaitée', value: formData.wants_hosting_management !== undefined ? (formData.wants_hosting_management ? 'Oui' : 'Non') : undefined },
  ]);

  // 10. Suivi & accompagnement
  addSection('10. Suivi & accompagnement', [
    { label: 'Formation souhaitée', value: formData.wants_training ? 'Oui' : 'Non' },
    { label: 'Maintenance souhaitée', value: formData.wants_maintenance ? 'Oui' : 'Non' },
    { label: 'Mises à jour futures souhaitées', value: formData.wants_future_updates ? 'Oui' : 'Non' },
  ]);

  // 11. Commentaires et remarques
  if (formData.additional_comments) {
    addSection('11. Commentaires et remarques', [
      { label: 'Commentaires additionnels', value: formData.additional_comments },
    ]);
  }

  // Ajouter le pied de page sur toutes les pages
  pdfDoc.getPages().forEach(page => {
    addFooter(page);
  });

  return await pdfDoc.save();
}

async function sendEmailWithResend(to: string[], subject: string, html: string, pdfBytes: Uint8Array, pdfName: string) {
  try {
    console.log('Starting email send process...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('PDF Name:', pdfName);
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    console.log('Making request to Resend API...');
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

    console.log('Received response from Resend API');
    const data = await response.json();
    console.log('Resend API response:', data);
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      throw new Error(`Email failed: ${JSON.stringify(data)}`);
    }

    console.log('Email sent successfully');
    return data;
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
}

serve(async (req) => {
  console.log('Function started');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === "OPTIONS") {
    console.log('Handling OPTIONS request');
    return new Response(null, { 
      status: 204, 
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400",
      }
    });
  }

  if (req.method !== "POST") {
    console.log('Invalid method:', req.method);
    return new Response(JSON.stringify({
      error: "Method not allowed",
      method: req.method
    }), { 
      status: 405, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  try {
    console.log('Parsing request body...');
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType);

    let body;
    let requestText = '';
    
    try {
      // Lire le corps de la requête comme texte d'abord
      requestText = await req.text();
      console.log('Raw request body:', requestText);
      console.log('Request body length:', requestText.length);
      
      if (!requestText) {
        throw new Error('Empty request body');
      }

      try {
        // Essayer de parser le texte comme JSON
        body = JSON.parse(requestText);
        console.log('Parsed JSON body:', body);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid JSON in request body');
      }

      if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body format');
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(JSON.stringify({
        error: "Invalid request body",
        details: e.message,
        contentType,
        headers: Object.fromEntries(req.headers.entries()),
        body: requestText // Inclure le corps brut dans la réponse d'erreur
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    console.log('Received form data:', JSON.stringify(body, null, 2));
    
    if (!body.email) {
      console.log('Email is missing from request');
      return new Response(JSON.stringify({
        error: "Email is required",
        receivedData: body
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Generate PDF
    console.log('Generating PDF...');
    const pdfBytes = await generateFormPDF(body);
    const pdfName = `Formulaire_${body.company_name || 'Client'}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('PDF generated successfully');

    // Send email to Basilus
    console.log('Sending email...');
    await sendEmailWithResend(
      ['contact@basilus.fr'],
      `Nouveau formulaire client : ${body.company_name || 'Sans nom d\'entreprise'}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f63c7a;">Nouveau formulaire client reçu</h2>
          <p><strong>Entreprise :</strong> ${body.company_name || 'Non spécifié'}</p>
          <p><strong>Contact :</strong> ${body.contact_person || 'Non spécifié'}</p>
          <p><strong>Email :</strong> <a href="mailto:${body.email}">${body.email}</a></p>
          <p><strong>Téléphone :</strong> ${body.phone || 'Non spécifié'}</p>
          <p><strong>Secteur d'activité :</strong> ${body.industry_sector || 'Non spécifié'}</p>
          <p><strong>Slogan :</strong> ${body.slogan || 'Non spécifié'}</p>
          <p><strong>Site web existant :</strong> ${body.existing_website || 'Non spécifié'}</p>
          <p><strong>Adresse :</strong> ${body.physical_address || 'Non spécifié'}</p>
          <p><strong>Raison du site web :</strong> ${body.reason_for_website || 'Non spécifié'}</p>
          <p><strong>Objectifs stratégiques :</strong> ${body.strategic_objectives || 'Non spécifié'}</p>
          <p><strong>Vision 1-3 ans :</strong> ${body.vision_1_3_years || 'Non spécifié'}</p>
          <p><strong>Description de la cible :</strong> ${body.target_description || 'Non spécifié'}</p>
          <p><strong>Ce qu'ils doivent trouver :</strong> ${body.what_to_find || 'Non spécifié'}</p>
          <p><strong>Appareils utilisés :</strong> ${body.devices_used || 'Non spécifié'}</p>
          <p><strong>Logo existant :</strong> ${body.has_logo ? 'Oui' : 'Non'}</p>
          <p><strong>Charte graphique existante :</strong> ${body.has_brand_guidelines ? 'Oui' : 'Non'}</p>
          <p><strong>Besoin de charte graphique :</strong> ${body.need_brand_guidelines ? 'Oui' : 'Non'}</p>
          <p><strong>Univers de marque :</strong> ${body.brand_universe || 'Non spécifié'}</p>
          <p><strong>Style souhaité :</strong> ${body.desired_style || 'Non spécifié'}</p>
          <p><strong>Plan du site existant :</strong> ${body.has_site_map ? 'Oui' : 'Non'}</p>
          <p><strong>Pages à inclure :</strong> ${body.pages_to_include || 'Non spécifié'}</p>
          <p><strong>Textes disponibles :</strong> ${body.has_texts ? 'Oui' : 'Non'}</p>
          <p><strong>Médias disponibles :</strong> ${body.has_media ? 'Oui' : 'Non'}</p>
          <p><strong>Besoin de rédaction SEO :</strong> ${body.needs_seo_copywriting ? 'Oui' : 'Non'}</p>
          <p><strong>Sites appréciés :</strong> ${body.liked_sites || 'Non spécifié'}</p>
          <p><strong>Sites non appréciés :</strong> ${body.disliked_sites || 'Non spécifié'}</p>
          <p><strong>Contraintes de design :</strong> ${body.design_constraints || 'Non spécifié'}</p>
          <p><strong>Ton éditorial :</strong> ${body.editorial_tone || 'Non spécifié'}</p>
          <p><strong>Fonctionnalités attendues :</strong> ${body.expected_features || 'Non spécifié'}</p>
          <p><strong>Outils externes :</strong> ${body.external_tools || 'Non spécifié'}</p>
          <p><strong>Type de site :</strong> ${body.site_type || 'Non spécifié'}</p>
          <p><strong>Travail SEO précédent :</strong> ${body.has_worked_on_seo ? 'Oui' : 'Non'}</p>
          <p><strong>Service SEO souhaité :</strong> ${body.wants_seo_service ? 'Oui' : 'Non'}</p>
          <p><strong>Concurrents SEO :</strong> ${body.seo_competitors || 'Non spécifié'}</p>
          <p><strong>Nom de domaine existant :</strong> ${body.has_domain ? 'Oui' : 'Non'}</p>
          <p><strong>Achat de nom de domaine nécessaire :</strong> ${body.needs_domain_purchase ? 'Oui' : 'Non'}</p>
          <p><strong>Hébergement existant :</strong> ${body.has_hosting ? 'Oui' : 'Non'}</p>
          <p><strong>Détails hébergement :</strong> ${body.hosting_details || 'Non spécifié'}</p>
          <p><strong>Gestion hébergement souhaitée :</strong> ${body.wants_hosting_management ? 'Oui' : 'Non'}</p>
          <p><strong>Formation souhaitée :</strong> ${body.wants_training ? 'Oui' : 'Non'}</p>
          <p><strong>Maintenance souhaitée :</strong> ${body.wants_maintenance ? 'Oui' : 'Non'}</p>
          <p><strong>Mises à jour futures souhaitées :</strong> ${body.wants_future_updates ? 'Oui' : 'Non'}</p>
          ${body.additional_comments ? `<p><strong>Commentaires additionnels :</strong> ${body.additional_comments}</p>` : ''}
          <p>Un PDF détaillé a été généré et joint à cet email.</p>
        </div>
      `,
      pdfBytes,
      pdfName
    );
    console.log('Email sent successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      data: body
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack,
      details: err
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
