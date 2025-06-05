'use client';

import { useState, useEffect } from 'react';

// Log de base pour vérifier que le code s'exécute
console.log('=== CALENDAR PAGE LOADING ===');

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

// Configuration
const WORK_HOURS = {
  start: 9, // 9h
  end: 20,  // 20h
};

// Fonction pour formater la date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Composant principal
export default function CalendarPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dailyAvailabilities, setDailyAvailabilities] = useState<DailyAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadAvailabilities() {
      console.log('=== CALENDAR PAGE LOADING ===');
      
      try {
        setIsLoading(true);
        console.log('Fetching calendar events from API...');
        
        const response = await fetch('/api/calendar/availability');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }
        
        const data = await response.json();
        setDailyAvailabilities(data.dailyAvailabilities);
        console.log('Events fetched for all business days');
      } catch (err) {
        console.error('Error loading availabilities:', err);
        setError('Erreur lors du chargement des disponibilités');
      } finally {
        setIsLoading(false);
      }
    }

    loadAvailabilities();
  }, []);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setBookingSuccess(false); // Reset booking success when selecting a new slot
    console.log('Créneau sélectionné:', slotId);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      console.log('Réservation du créneau:', selectedSlot);
      
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      console.log('Réservation réussie:', data);
      setBookingSuccess(true);
      
      // Optionnel: Recharger les disponibilités après réservation
      // On pourrait reload les disponibilités ici pour voir le créneau disparaître
      
    } catch (err) {
      console.error('Erreur de réservation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Chargement...</h1>
            <p className="text-muted-foreground">Récupération des disponibilités en cours...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Réservez votre rendez-vous
          </h1>
          <div className="text-lg text-muted-foreground mb-2">
            Rendez-vous téléphoniques ou visioconférence
          </div>
          <div className="text-base text-muted-foreground">
            Disponibilités des 5 prochains jours ouvrables
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground text-center mb-8">
          <p>Heures de disponibilité : {WORK_HOURS.start}h - {WORK_HOURS.end}h</p>
        </div>

        {selectedSlot && (
          <div className={`rounded-xl p-6 mb-8 text-center shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-500 ${
            bookingSuccess 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-400 dark:border-emerald-500 dark:shadow-emerald-900/20'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-600 dark:shadow-green-900/20'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                bookingSuccess 
                  ? 'bg-emerald-500 dark:bg-emerald-400' 
                  : 'bg-green-500 dark:bg-green-400 animate-pulse'
              }`}></div>
              <p className={`font-semibold text-lg ${
                bookingSuccess 
                  ? 'text-emerald-800 dark:text-emerald-200' 
                  : 'text-green-800 dark:text-green-200'
              }`}>
                {bookingSuccess ? 'Réservation confirmée !' : 'Créneau sélectionné'}
              </p>
            </div>
            <div className="mb-6">
              <p className={`font-medium text-base mb-1 ${
                bookingSuccess 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {formatDate(selectedSlot.split('_')[0])}
              </p>
              <p className={`font-semibold text-2xl ${
                bookingSuccess 
                  ? 'text-emerald-700 dark:text-emerald-300' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {selectedSlot.split('_').slice(1).join(' ')}
              </p>
            </div>
            
            {bookingSuccess ? (
              <div className="text-center">
                <button 
                  onClick={() => {
                    setSelectedSlot(null);
                    setBookingSuccess(false);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-600 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 font-medium text-sm shadow-sm"
                >
                  Choisir un autre créneau
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleBookSlot}
                  disabled={isBooking}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-700 border border-green-600 dark:border-green-700 rounded-lg text-white hover:bg-green-700 dark:hover:bg-green-800 hover:border-green-700 dark:hover:border-green-800 transition-all duration-200 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Réservation...
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
                  onClick={() => setSelectedSlot(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 font-medium text-sm shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Changer de créneau
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {dailyAvailabilities.map((dayAvailability, dayIndex) => (
            <div key={dayIndex} className="bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 capitalize text-foreground dark:text-gray-100">
                {formatDate(dayAvailability.date)}
              </h2>
              
              {dayAvailability.freeSlots.length === 0 ? (
                <p className="text-muted-foreground dark:text-gray-400">
                  Aucune disponibilité pour cette journée.
                </p>
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
          ))}
        </div>
      </div>
    </div>
  );
} 