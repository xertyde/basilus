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
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 8l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8zm0-8l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4zm-18 36l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4zm36 0l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="container py-16 md:py-20 lg:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-x-2">
              <span className="text-2xl font-bold text-primary">Basilus</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300 max-w-sm">
              Basilus crée des sites web professionnels et sur mesure pour votre entreprise. Notre expertise vous garantit une présence en ligne de qualité.
            </p>
            <div className="flex space-x-6 pt-2">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-300 hover:text-primary transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{item.name}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-white">Navigation</h3>
            <ul className="space-y-3">
              {navigation.main.slice(0, 5).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-300 hover:text-primary transition-colors duration-200 block py-1">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="text-sm text-gray-300">
                <span className="block font-medium text-gray-200 mb-1">Email</span>
                <span className="block">contact@basilus.fr</span>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block font-medium text-gray-200 mb-1">Téléphone</span>
                <span className="block">+33 7 68 09 59 59</span>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block font-medium text-gray-200 mb-1">Adresse</span>
                <span className="block">Lyon 3ème Arrondissement</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Basilus. Tous droits réservés.
            </p>
            <Link href="/mentions-legales" className="text-xs text-gray-400 hover:text-primary transition-colors duration-200">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}