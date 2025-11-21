'use client';

import { useState, useEffect } from 'react';



// Types
interface Availability {
  start: string;
  end: string;
  id: string;
}

interface DailyAvailability {
  date: string;
  freeSlots: Availability[];
}

type MeetingType = 'phone' | 'video' | null;

// Configuration
const WORK_HOURS = {
  start: 9, // 9h
  end: 20,  // 20h
};

// Fonction pour formater la date de manière fiable
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      console.error('Date invalide reçue:', dateStr);
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Paris' // S'assurer que le formatage utilise le bon fuseau horaire
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
}

// Composant principal
export default function CalendarPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dailyAvailabilities, setDailyAvailabilities] = useState<DailyAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [jitsiLink, setJitsiLink] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>(null);
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    async function loadAvailabilities() {
      try {
        setIsLoading(true);
        setError(null); // Reset any previous errors
        
        const timestamp = new Date().toISOString();
        console.log('[CALENDAR CLIENT] ===== CHARGEMENT DES DISPONIBILITÉS =====');
        console.log('[CALENDAR CLIENT] Timestamp client:', timestamp);
        console.log('[CALENDAR CLIENT] Date locale:', new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
        
        // Désactiver le cache pour cette requête
        const response = await fetch('/api/calendar/availability', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Valider la structure des données reçues
        if (!data.dailyAvailabilities || !Array.isArray(data.dailyAvailabilities)) {
          throw new Error('Format de données invalide reçu du serveur');
        }
        
        console.log('[CALENDAR CLIENT] Disponibilités chargées:', data.dailyAvailabilities.length, 'jours');
        data.dailyAvailabilities.forEach((day: DailyAvailability, index: number) => {
          console.log(`[CALENDAR CLIENT]   Jour ${index + 1}: ${day.date} - ${day.freeSlots.length} créneaux disponibles`);
        });
        console.log('[CALENDAR CLIENT] ===== FIN DU CHARGEMENT =====');
        
        setDailyAvailabilities(data.dailyAvailabilities);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors du chargement des disponibilités';
        console.error('[CALENDAR CLIENT] Erreur lors du chargement des disponibilités:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadAvailabilities();
    
    // Revalidation périodique : recharger les disponibilités toutes les 5 minutes
    // Cela garantit que les données restent à jour même si l'utilisateur garde la page ouverte
    const intervalId = setInterval(() => {
      console.log('[CALENDAR CLIENT] Revalidation périodique des disponibilités...');
      loadAvailabilities();
    }, 5 * 60 * 1000); // 5 minutes
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setBookingSuccess(false); // Reset booking success when selecting a new slot
    setMeetingType(null); // Reset meeting type when selecting a new slot
    setEmail(''); // Reset email when selecting a new slot
    setPhoneNumber(''); // Reset phone number when selecting a new slot
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !meetingType) return;
    
    // Validation des champs requis selon le type
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }
    if (meetingType === 'phone' && !phoneNumber.trim()) {
      setError('Veuillez saisir votre numéro de téléphone');
      return;
    }

    setIsBooking(true);
    setError(null); // Reset error
    try {
      
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot,
          meetingType: meetingType,
          email: email.trim(), // Email toujours envoyé pour la confirmation
          phoneNumber: meetingType === 'phone' ? phoneNumber.trim() : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setBookingSuccess(true);
      
      // Créer un lien Jitsi Meet uniquement pour les rendez-vous en visio
      if (meetingType === 'video') {
        const meetingRoomId = `basilus-${selectedSlot.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
        const jitsiMeetLink = `https://meet.jit.si/${meetingRoomId}`;
        setJitsiLink(jitsiMeetLink);
      } else {
        setJitsiLink(null);
      }
      
      // Optionnel: Recharger les disponibilités après réservation
      // On pourrait reload les disponibilités ici pour voir le créneau disparaître
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {/* Bâtons tournants */}
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto relative">
              {/* Bâton principal */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-1 bg-primary rounded-full animate-spin origin-center"></div>
              </div>
              {/* Bâton secondaire */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-primary/60 rounded-full animate-spin origin-center animation-delay-300" style={{animationDirection: 'reverse'}}></div>
              </div>
            </div>
          </div>

          {/* Texte simple */}
          <div className="space-y-3">
            <h1 className="text-xl font-semibold text-foreground">
              Chargement des disponibilités
            </h1>
            
            {/* Points de chargement minimalistes */}
            <div className="flex justify-center space-x-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce animation-delay-150"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce animation-delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-red-500">
            Erreur lors du chargement du calendrier
          </h1>
          <p className="text-center text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Réservez votre rendez-vous
          </h1>
          <div className="text-lg text-muted-foreground mb-1">
            Rendez-vous téléphoniques ou visioconférence
          </div>
          <div className="text-base text-muted-foreground mb-1">
            Disponibilités des 5 prochains jours ouvrables
          </div>
          <div className="text-sm text-muted-foreground">
            Heures de disponibilité : {WORK_HOURS.start}h - {WORK_HOURS.end}h
          </div>
        </div>

        {selectedSlot && (
          <div className={`rounded-lg p-4 mb-6 text-center shadow-md animate-in fade-in-0 slide-in-from-top-2 duration-500 ${
            bookingSuccess 
              ? 'bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-2 border-cyan-400 dark:border-cyan-500 dark:shadow-cyan-900/20'
              : 'bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-2 border-cyan-300 dark:border-cyan-600 dark:shadow-cyan-900/20'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                bookingSuccess 
                  ? 'bg-cyan-500 dark:bg-cyan-400' 
                  : 'bg-cyan-500 dark:bg-cyan-400 animate-pulse'
              }`}></div>
              <p className={`font-semibold text-base ${
                bookingSuccess 
                  ? 'text-cyan-800 dark:text-cyan-200' 
                  : 'text-cyan-800 dark:text-cyan-200'
              }`}>
                {bookingSuccess ? 'Réservation confirmée !' : 'Créneau sélectionné'}
              </p>
            </div>
            <div className="mb-4">
              <p className={`font-medium text-sm mb-0.5 ${
                bookingSuccess 
                  ? 'text-cyan-600 dark:text-cyan-400' 
                  : 'text-cyan-600 dark:text-cyan-400'
              }`}>
                {formatDate(selectedSlot.split('_')[0])}
              </p>
              <p className={`font-semibold text-xl ${
                bookingSuccess 
                  ? 'text-cyan-700 dark:text-cyan-300' 
                  : 'text-cyan-700 dark:text-cyan-300'
              }`}>
                {selectedSlot.split('_').slice(1).join(' ')}
              </p>
            </div>
            
            {bookingSuccess ? (
              <div className="text-center space-y-3">
                <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {meetingType === 'phone' ? (
                      <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    <p className="font-semibold text-cyan-800 dark:text-cyan-200">
                      Rendez-vous {meetingType === 'phone' ? 'téléphonique' : 'en visioconférence'} confirmé
                    </p>
                  </div>
                  {meetingType === 'phone' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-cyan-100 dark:border-cyan-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📞 Vous serez contacté par téléphone</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Assurez-vous d'être disponible à l'heure prévue. Un numéro de téléphone de contact vous sera demandé par email.
                      </p>
                    </div>
                  ) : (
                    jitsiLink && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-cyan-100 dark:border-cyan-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rejoindre la réunion :</p>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={jitsiLink} 
                            readOnly 
                            className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-700 dark:text-gray-300"
                          />
                          <button
                            onClick={() => navigator.clipboard.writeText(jitsiLink)}
                            className="px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm"
                            title="Copier le lien"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <button 
                  onClick={() => {
                    // Recharger la page pour récupérer les vraies disponibilités
                    window.location.reload();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-cyan-300 dark:border-cyan-600 rounded-lg text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-200 font-medium text-sm shadow-sm"
                >
                  Choisir un autre créneau
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {!meetingType ? (
                  <div className="space-y-3">
                    <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                      Choisissez le type de rendez-vous :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setMeetingType('phone')}
                        className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">Téléphonique</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Appel téléphonique classique</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setMeetingType('video')}
                        className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">Visioconférence</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Lien Jitsi Meet fourni</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                        {meetingType === 'phone' ? (
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Rendez-vous {meetingType === 'phone' ? 'téléphonique' : 'en visioconférence'}
                      </p>
                    </div>
                    
                    {/* Champs de contact selon le type de rendez-vous */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                      {/* Email toujours requis pour la confirmation */}
                      <div className="space-y-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Adresse email *
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pour recevoir la confirmation de votre rendez-vous
                        </p>
                      </div>

                      {/* Numéro de téléphone uniquement pour les RDV téléphoniques */}
                      {meetingType === 'phone' && (
                        <div className="space-y-3">
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Numéro de téléphone *
                          </label>
                          <div className="relative">
                            <input
                              id="phoneNumber"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Ex: +33 6 12 34 56 78"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Vous serez contacté à ce numéro à l'heure prévue du rendez-vous
                          </p>
                        </div>
                      )}

                      {meetingType === 'video' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Le lien de visioconférence vous sera envoyé par email
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={handleBookSlot}
                        disabled={isBooking}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-700 border border-cyan-600 dark:border-cyan-700 rounded-lg text-white hover:bg-cyan-700 dark:hover:bg-cyan-800 hover:border-cyan-700 dark:hover:border-cyan-800 transition-all duration-200 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBooking ? (
                          <>
                            <div className="w-4 h-0.5 bg-white rounded-full animate-spin"></div>
                            <span>Réservation...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Réserver ce créneau
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setMeetingType(null);
                          setEmail('');
                          setPhoneNumber('');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-pink-300 dark:border-pink-600 rounded-lg text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-200 font-medium text-sm shadow-sm w-full sm:w-auto justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Changer le type
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <button 
                    onClick={() => setSelectedSlot(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-cyan-300 dark:border-cyan-600 rounded-lg text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-200 font-medium text-sm shadow-sm w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Changer de créneau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {dailyAvailabilities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucune disponibilité trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aucun créneau disponible n'a été trouvé pour les 5 prochains jours ouvrés.
              </p>
            </div>
          ) : (
            dailyAvailabilities.map((dayAvailability, dayIndex) => (
              <div key={dayIndex} className="bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 capitalize text-foreground dark:text-gray-100">
                  {formatDate(dayAvailability.date)}
                </h2>
                
                {dayAvailability.freeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground dark:text-gray-400 font-medium">
                      Aucune disponibilité pour cette journée
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-500 mt-1">
                      Tous les créneaux sont déjà réservés ou passés
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dayAvailability.freeSlots.map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        onClick={() => handleSlotSelect(slot.id)}
                        className={`group p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                          selectedSlot === slot.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 shadow-lg scale-105 ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <div className={`flex items-center justify-between ${
                          selectedSlot === slot.id 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          <div>
                            <p className="text-lg font-semibold">
                              {slot.start} - {slot.end}
                            </p>
                            <p className="text-sm opacity-75 mt-1">
                              Disponible
                            </p>
                          </div>
                          {selectedSlot === slot.id && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 