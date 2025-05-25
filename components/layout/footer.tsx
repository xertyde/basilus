import Link from 'next/link'

const navigation = {
  main: [
    { name: 'Accueil', href: '/' },
    { name: 'Nos Packs', href: '/packs' },
    { name: 'Réalisations', href: '/realisations' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
    { name: 'Mentions légales', href: '/mentions-legales' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-x-2">
              <span className="text-2xl font-bold text-primary">Basilus</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Basilus crée des sites web professionnels et sur mesure pour votre entreprise. Notre expertise vous garantit une présence en ligne de qualité.
            </p>
            <div className="mt-6 flex space-x-6">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{item.name}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {navigation.main.slice(0, 5).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">
                <span className="block">Email: contact@basilus.fr</span>
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="block">Téléphone: +33 1 23 45 67 89</span>
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="block">Adresse: 123 Rue de Paris, 75001 Paris</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Basilus. Tous droits réservés.
          </p>
          <Link href="/mentions-legales" className="text-xs text-muted-foreground hover:text-primary mt-4 md:mt-0">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}