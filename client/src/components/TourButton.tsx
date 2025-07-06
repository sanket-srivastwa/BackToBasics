import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle } from 'lucide-react';
import { useTour } from '@/hooks/useTour';

export default function TourButton() {
  const { tourCompleted, startTour } = useTour();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startTour}
      className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 border-gray-200"
    >
      {tourCompleted ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          Tour Complete
        </>
      ) : (
        <>
          <Play className="h-4 w-4 text-purple-500" />
          Take Tour
        </>
      )}
    </Button>
  );
}