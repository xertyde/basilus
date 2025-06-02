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
    <footer className="bg-[#0A192F] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="container py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-x-2">
              <span className="text-2xl font-bold text-primary">Basilus</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300 max-w-xs">
              Basilus crée des sites web professionnels et sur mesure pour votre entreprise. Notre expertise vous garantit une présence en ligne de qualité.
            </p>
            <div className="mt-6 flex space-x-6">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-300 hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{item.name}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {navigation.main.slice(0, 5).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-300 hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">
                <span className="block">Email: contact@basilus.fr</span>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block">Téléphone: +33 7 68 09 59 59</span>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block">Adresse: Lyon 3ème Arrondissement</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Basilus. Tous droits réservés.
          </p>
          <Link href="/mentions-legales" className="text-xs text-gray-400 hover:text-primary mt-4 md:mt-0">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}