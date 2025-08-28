import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Vérification CSS - Basilus
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Test complet de tous les composants et styles
          </p>
        </div>

        {/* Composants UI de base */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-pink-600 dark:text-pink-400">Boutons</CardTitle>
              <CardDescription>Test des composants Button</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="default" className="w-full">Bouton Principal</Button>
              <Button variant="secondary" className="w-full">Bouton Secondaire</Button>
              <Button variant="outline" className="w-full">Bouton Contour</Button>
              <Button variant="ghost" className="w-full">Bouton Fantôme</Button>
              <Button variant="destructive" className="w-full">Bouton Destructeur</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Formulaires</CardTitle>
              <CardDescription>Test des composants Input et Label</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Badges</CardTitle>
              <CardDescription>Test des composants Badge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Par défaut</Badge>
                <Badge variant="secondary">Secondaire</Badge>
                <Badge variant="outline">Contour</Badge>
                <Badge variant="destructive">Destructeur</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs et gradients */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Palette de couleurs</CardTitle>
            <CardDescription className="text-center">Vérification des variables CSS personnalisées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                Primary
              </div>
              <div className="h-20 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-semibold">
                Secondary
              </div>
              <div className="h-20 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-semibold">
                Accent
              </div>
              <div className="h-20 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-semibold">
                Muted
              </div>
              <div className="h-20 bg-destructive rounded-lg flex items-center justify-center text-destructive-foreground font-semibold">
                Destructive
              </div>
              <div className="h-20 bg-card rounded-lg flex items-center justify-center text-card-foreground font-semibold border">
                Card
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des animations */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Animations et transitions</CardTitle>
            <CardDescription className="text-center">Test des animations Tailwind et CSS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pulse</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 animate-bounce"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bounce</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 animate-spin"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Spin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test de la responsivité */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Responsivité</CardTitle>
            <CardDescription className="text-center">Test des breakpoints Tailwind</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-500 text-white p-4 rounded text-center sm:hidden">
                Visible uniquement sur mobile (xs)
              </div>
              <div className="hidden sm:block bg-yellow-500 text-white p-4 rounded text-center md:hidden">
                Visible sur tablette (sm)
              </div>
              <div className="hidden md:block bg-green-500 text-white p-4 rounded text-center lg:hidden">
                Visible sur desktop (md)
              </div>
              <div className="hidden lg:block bg-blue-500 text-white p-4 rounded text-center xl:hidden">
                Visible sur grand écran (lg)
              </div>
              <div className="hidden xl:block bg-purple-500 text-white p-4 rounded text-center">
                Visible sur très grand écran (xl)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message de succès */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Si vous voyez cette page avec tous les styles, le CSS fonctionne parfaitement !
          </div>
        </div>
      </div>
    </div>
  );
}
