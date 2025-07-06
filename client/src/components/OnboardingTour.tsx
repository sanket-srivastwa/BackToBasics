import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, Play, CheckCircle, Sparkles, Target, BookOpen, Brain, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
  delay?: number;
  animation?: 'bounce' | 'pulse' | 'shake' | 'float';
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AutoDiDact! 🎉',
    description: 'Your AI-powered interview preparation platform. Let me show you around!',
    target: 'tour-hero-section',
    position: 'bottom',
    icon: Sparkles,
    animation: 'bounce'
  },
  {
    id: 'search',
    title: 'Smart Search',
    description: 'Search for questions by topic, company, or skill. Our AI helps you find exactly what you need!',
    target: 'tour-search-bar',
    position: 'bottom',
    icon: Target,
    animation: 'pulse'
  },
  {
    id: 'practice',
    title: 'Practice Questions',
    description: 'Access hundreds of real interview questions from top tech companies. Filter by role and difficulty!',
    target: 'tour-practice-tab',
    position: 'bottom',
    icon: MessageSquare,
    animation: 'float'
  },
  {
    id: 'learning',
    title: 'Learning Materials',
    description: 'Comprehensive courses and modules to master Product Management, Program Management, and more!',
    target: 'tour-learning-tab',
    position: 'bottom',
    icon: BookOpen,
    animation: 'pulse'
  },
  {
    id: 'ai-assistant',
    title: 'AI Case Studies',
    description: 'Generate fresh case studies tailored to your experience level and preferred topics!',
    target: 'tour-case-study-tab',
    position: 'bottom',
    icon: Brain,
    animation: 'bounce'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'Start practicing, learning, and preparing for your dream job. Good luck!',
    target: 'tour-hero-section',
    position: 'top',
    icon: CheckCircle,
    animation: 'float'
  }
];

export default function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (!isOpen) return;

    const updateTooltipPosition = () => {
      if (!currentTourStep) return;

      const targetElement = document.querySelector(`[data-tour="${currentTourStep.target}"]`) as HTMLElement;
      if (!targetElement || !tooltipRef.current) return;

      setHighlightedElement(targetElement);

      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (currentTourStep.position) {
        case 'bottom':
          top = targetRect.bottom + padding;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'top':
          top = targetRect.top - tooltipRect.height - padding;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + padding;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - padding;
          break;
      }

      // Ensure tooltip stays within viewport
      const margin = 16;
      top = Math.max(margin, Math.min(window.innerHeight - tooltipRect.height - margin, top));
      left = Math.max(margin, Math.min(window.innerWidth - tooltipRect.width - margin, left));

      setTooltipPosition({ top, left });
    };

    const timer = setTimeout(updateTooltipPosition, 100);
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [currentStep, isOpen, currentTourStep]);

  useEffect(() => {
    if (!isOpen || !highlightedElement) return;

    // Add highlight class with animation
    highlightedElement.classList.add('tour-highlight');
    if (currentTourStep.animation) {
      highlightedElement.classList.add(`tour-${currentTourStep.animation}`);
    }

    return () => {
      highlightedElement.classList.remove('tour-highlight', 'tour-bounce', 'tour-pulse', 'tour-shake', 'tour-float');
    };
  }, [highlightedElement, currentTourStep, isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen || !currentTourStep) {
    return null;
  }

  const IconComponent = currentTourStep.icon;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className="fixed z-[9999] w-80 shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50 to-pink-50 transition-all duration-300 transform animate-in slide-in-from-bottom-2"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{currentTourStep.title}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  Step {currentStep + 1} of {tourSteps.length}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {currentTourStep.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Arrow Pointer */}
        <div 
          className={cn(
            "absolute w-0 h-0 border-8",
            currentTourStep.position === 'top' && "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white",
            currentTourStep.position === 'bottom' && "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white",
            currentTourStep.position === 'left' && "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-white",
            currentTourStep.position === 'right' && "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-white"
          )}
        />
      </Card>


    </>
  );
}