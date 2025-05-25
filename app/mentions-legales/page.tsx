import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Mentions Légales | Basilus',
  description: 'Mentions légales du site Basilus.',
}

export default function MentionsLegalesPage() {
  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Mentions Légales</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Informations légales</h2>
            <p>
              Le site Basilus est édité par la société Basilus, SAS au capital de 10 000 euros, 
              immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789, 
              dont le siège social est situé au 123 Rue de Paris, 75001 Paris.
            </p>
            <p>
              Numéro de TVA intracommunautaire : FR 12 123 456 789<br />
              Directeur de la publication : Jean Dupont
            </p>
            
            <h2>2. Hébergement</h2>
            <p>
              Le site Basilus est hébergé par la société Hébergeur Pro, SAS au capital de 100 000 euros, 
              immatriculée au RCS de Lyon sous le numéro 987 654 321, 
              dont le siège social est situé au 456 Avenue de Lyon, 69000 Lyon.
            </p>
            
            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site Basilus (textes, images, vidéos, logos, etc.) est protégé par 
              le droit d'auteur et est la propriété exclusive de la société Basilus ou de ses partenaires.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation ou exploitation 
              de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
              sauf autorisation écrite préalable de la société Basilus.
            </p>
            
            <h2>4. Données personnelles</h2>
            <p>
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général 
              sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression 
              et d'opposition aux données personnelles vous concernant.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez contacter la société Basilus par email à l'adresse 
              rgpd@basilus.fr ou par courrier à l'adresse du siège social.
            </p>
            
            <h2>5. Cookies</h2>
            <p>
              Le site Basilus utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur le site, 
              vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.
            </p>
            
            <h2>6. Limitation de responsabilité</h2>
            <p>
              La société Basilus ne saurait être tenue responsable des dommages directs ou indirects résultant de 
              l'utilisation du site Basilus ou de l'impossibilité d'y accéder.
            </p>
            
            <h2>7. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français 
              seront seuls compétents.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}