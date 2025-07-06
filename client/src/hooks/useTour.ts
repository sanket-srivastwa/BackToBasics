import { useState, useEffect } from 'react';

const TOUR_STORAGE_KEY = 'autodidact-tour-completed';

export function useTour() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed the tour before
    const completed = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
    setTourCompleted(completed);
    
    // Auto-start tour for new users after a short delay
    if (!completed) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1500); // 1.5 second delay to let page load
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    setTourCompleted(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsTourOpen(false);
  };

  const resetTour = () => {
    setTourCompleted(false);
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  return {
    isTourOpen,
    tourCompleted,
    startTour,
    closeTour,
    completeTour,
    resetTour
  };
}