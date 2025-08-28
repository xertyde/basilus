import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Fonction utilitaire pour encoder en base64 (compatible Deno)
function toBase64(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}

serve(async (req) => {
  try {
    console.log('Function started')
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    // Récupérer le body de la requête
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)
    
    // Parser le JSON
    const payload = JSON.parse(rawBody)
    console.log('Parsed JSON body:', payload)
    
    // Vérifier que c'est bien un webhook d'insertion
    if (payload.type !== 'INSERT' || payload.table !== 'client_form') {
      throw new Error('Invalid webhook payload')
    }
    
    // Récupérer les données du record
    const record = payload.record
    console.log('Record data:', record)
    
    // Vérifier que l'email est présent
    if (!record.email) {
      throw new Error('Email is missing from record')
    }
    
    const {
      id,
      email,
      company_name,
      phone,
      contact_person,
      physical_address,
      reason_for_website,
      strategic_objectives,
      vision_1_3_years,
      target_description,
      what_to_find,
      brand_universe,
      site_type,
      industry_sector,
      created_at,
      has_logo,
      has_brand_guidelines,
      need_brand_guidelines,
      has_site_map,
      has_texts,
      has_media,
      has_domain,
      has_hosting,
      wants_training,
      wants_maintenance,
      wants_future_updates,
      devices_used,
      pages_to_include,
      expected_features,
      external_tools,
      liked_sites,
      disliked_sites,
      design_constraints,
      editorial_tone,
      seo_competitors,
      hosting_details,
      additional_comments
    } = record
    
    console.log('Processing form submission:', {
      id,
      company_name,
      email,
      phone,
      site_type
    })
    
    // Envoyer l'email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    
    // Générer le contenu TXT pour la pièce jointe
    const txtContent = `
===== Demande de projet Basilus =====

Entreprise : ${company_name}
Contact    : ${contact_person}
Email      : ${email}
Téléphone  : ${phone}
Secteur    : ${industry_sector}
Type de site : ${site_type}
Adresse    : ${physical_address}

--- Objectifs & Vision ---
Raison du site         : ${reason_for_website}
Objectifs stratégiques : ${strategic_objectives}
Vision 1-3 ans         : ${vision_1_3_years}

--- Cible & Utilisateurs ---
Description de la cible : ${target_description}
Ce qu'ils cherchent     : ${what_to_find}
Appareils utilisés      : ${devices_used}

--- Identité de marque ---
Logo                : ${has_logo ? 'Oui' : 'Non'}
Charte graphique    : ${has_brand_guidelines ? 'Oui' : 'Non'}
Créer charte        : ${need_brand_guidelines ? 'Oui' : 'Non'}
Univers de marque   : ${brand_universe}

--- Contenu & Structure ---
Architecture        : ${has_site_map ? 'Oui' : 'Non'}
Textes              : ${has_texts}
Médias              : ${has_media}
Pages à inclure     : ${pages_to_include}

--- Hébergement & Domaine ---
Nom de domaine      : ${has_domain ? 'Oui' : 'Non'}
Hébergement         : ${has_hosting ? 'Oui' : 'Non'}
Détails hébergement : ${hosting_details || ''}

--- Accompagnement ---
Formation           : ${wants_training ? 'Oui' : 'Non'}
Maintenance         : ${wants_maintenance ? 'Oui' : 'Non'}
Évolutions futures  : ${wants_future_updates ? 'Oui' : 'Non'}

${expected_features ? `Fonctionnalités souhaitées : ${expected_features}` : ''}
${external_tools ? `Outils externes : ${external_tools}` : ''}
${liked_sites ? `Sites appréciés : ${liked_sites}` : ''}
${disliked_sites ? `Sites non appréciés : ${disliked_sites}` : ''}
${design_constraints ? `Contraintes design : ${design_constraints}` : ''}
${editorial_tone ? `Ton rédactionnel : ${editorial_tone}` : ''}
${seo_competitors ? `Concurrents SEO : ${seo_competitors}` : ''}
${additional_comments ? `Commentaires supplémentaires : ${additional_comments}` : ''}

ID de la demande : ${id}
Date de soumission : ${new Date(created_at).toLocaleString('fr-FR')}
====================================
`;

    // Email de notification avec pièce jointe TXT encodée en base64
    const notificationEmail = {
      from: 'Basilus <noreply@basilus.fr>',
      to: 'contact@basilus.fr',
      subject: `Nouvelle demande de ${company_name}`,
      html: `
        <h2>Nouvelle demande de formulaire</h2>
        <p>Une nouvelle demande a été soumise pour <strong>${company_name}</strong>.</p>
        <p><strong>Contact:</strong> ${contact_person} (${email})</p>
        <p><strong>Type de site:</strong> ${site_type}</p>
        <p><strong>Secteur:</strong> ${industry_sector}</p>
        <hr>
        <p>Consultez les détails complets dans le fichier TXT ci-joint.</p>
        <p><small>ID: ${id} | Date: ${new Date(created_at).toLocaleString('fr-FR')}</small></p>
      `,
      attachments: [
        {
          filename: `demande-${company_name}-${id}.txt`,
          content: toBase64(txtContent),
          contentType: 'text/plain',
          encoding: 'base64'
        }
      ]
    };
    
    // Email de confirmation pour le client
    const confirmationEmail = {
      from: 'Basilus <noreply@basilus.fr>',
      to: email,
      subject: 'Confirmation de votre demande - Basilus',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 1.75rem; font-weight: 600;">Merci pour votre demande !</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Bonjour ${contact_person},</p>
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Nous avons bien reçu votre demande pour <strong>${company_name}</strong> et nous vous en remercions.</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Notre équipe va analyser vos besoins et vous contacter dans les plus brefs délais pour discuter de votre projet.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">Récapitulatif</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Entreprise:</strong> ${company_name}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Type de site:</strong> ${site_type}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Secteur:</strong> ${industry_sector}</p>
            </div>
            
            <p style="margin: 25px 0 0 0; font-size: 16px; line-height: 1.6;">Cordialement,<br><strong>L'équipe Basilus</strong></p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">Basilus - Création de sites web modernes</p>
          </div>
        </div>
      `
    }
    
    // Envoyer les emails
    console.log('Envoi des emails via Resend...')
    
    const notificationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationEmail)
    })
    
    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(confirmationEmail)
    })
    
    if (!notificationResponse.ok) {
      const error = await notificationResponse.text()
      console.error('Erreur envoi email notification:', error)
      throw new Error(`Erreur envoi email notification: ${error}`)
    }
    
    if (!confirmationResponse.ok) {
      const error = await confirmationResponse.text()
      console.error('Erreur envoi email confirmation:', error)
      throw new Error(`Erreur envoi email confirmation: ${error}`)
    }
    
    const notificationResult = await notificationResponse.json()
    const confirmationResult = await confirmationResponse.json()
    
    console.log('Email de notification envoyé:', notificationResult)
    console.log('Email de confirmation envoyé:', confirmationResult)
    console.log('Email de notification envoyé à: contact@basilus.fr')
    console.log('Email de confirmation envoyé à:', email)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails envoyés avec succès',
        record_id: id,
        notification_email_id: notificationResult.id,
        confirmation_email_id: confirmationResult.id,
        notification_sent_to: 'contact@basilus.fr',
        confirmation_sent_to: email
      }),
      { 
        headers: { "Content-Type": "application/json" } 
      }
    )
    
  } catch (error) {
    console.error('Erreur dans la fonction:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
}) 