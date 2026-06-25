'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

export type GuideTourStep = {
  selector?: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

type GuideTourProps = {
  steps: GuideTourStep[];
  scrollBehavior?: ScrollBehavior;
  storageKey?: string;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const HIGHLIGHT_PADDING = 10;
const POPOVER_WIDTH = 340;
const VIEWPORT_GAP = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFallbackRect(): HighlightRect {
  const width = Math.min(window.innerWidth - VIEWPORT_GAP * 2, 520);
  const height = 220;

  return {
    top: Math.max((window.innerHeight - height) / 2, VIEWPORT_GAP),
    left: Math.max((window.innerWidth - width) / 2, VIEWPORT_GAP),
    width,
    height,
  };
}

function getPopoverPosition(
  rect: HighlightRect,
  placement: GuideTourStep['placement'] = 'bottom'
) {
  const maxLeft = Math.max(window.innerWidth - POPOVER_WIDTH - VIEWPORT_GAP, VIEWPORT_GAP);
  const centeredLeft = rect.left + rect.width / 2 - POPOVER_WIDTH / 2;
  const left = clamp(centeredLeft, VIEWPORT_GAP, maxLeft);
  const belowTop = rect.top + rect.height + VIEWPORT_GAP;
  const aboveTop = rect.top - 236 - VIEWPORT_GAP;

  if (placement === 'top') {
    return {
      left,
      top: clamp(aboveTop, VIEWPORT_GAP, window.innerHeight - 236),
    };
  }

  if (placement === 'left' || placement === 'right') {
    const sideLeft =
      placement === 'left'
        ? rect.left - POPOVER_WIDTH - VIEWPORT_GAP
        : rect.left + rect.width + VIEWPORT_GAP;

    return {
      left: clamp(sideLeft, VIEWPORT_GAP, maxLeft),
      top: clamp(rect.top + rect.height / 2 - 110, VIEWPORT_GAP, window.innerHeight - 236),
    };
  }

  const hasRoomBelow = belowTop + 220 < window.innerHeight;

  return {
    left,
    top: hasRoomBelow ? belowTop : clamp(aboveTop, VIEWPORT_GAP, window.innerHeight - 220),
  };
}

export default function GuideTour({
  steps,
  scrollBehavior = 'auto',
  storageKey = 'personal-site-guide-tour-complete',
}: GuideTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<HighlightRect | null>(null);
  const currentStep = steps[currentIndex];

  const popoverStyle = useMemo(() => {
    if (!targetRect || !currentStep) {
      return null;
    }

    return getPopoverPosition(targetRect, currentStep.placement);
  }, [currentStep, targetRect]);

  const updateTargetRect = useCallback(() => {
    if (!currentStep) {
      return;
    }

    const target = currentStep.selector
      ? document.querySelector<HTMLElement>(currentStep.selector)
      : null;

    if (!target) {
      setTargetRect(getFallbackRect());
      return;
    }

    const rect = target.getBoundingClientRect();
    setTargetRect({
      top: Math.max(rect.top - HIGHLIGHT_PADDING, VIEWPORT_GAP),
      left: Math.max(rect.left - HIGHLIGHT_PADDING, VIEWPORT_GAP),
      width: Math.min(rect.width + HIGHLIGHT_PADDING * 2, window.innerWidth - VIEWPORT_GAP * 2),
      height: Math.min(rect.height + HIGHLIGHT_PADDING * 2, window.innerHeight - VIEWPORT_GAP * 2),
    });
  }, [currentStep]);

  const scrollToCurrentTarget = useCallback(() => {
    if (!currentStep?.selector) {
      setTargetRect(getFallbackRect());
      return;
    }

    const target = document.querySelector<HTMLElement>(currentStep.selector);

    if (!target) {
      setTargetRect(getFallbackRect());
      return;
    }

    target.scrollIntoView({
      behavior: scrollBehavior,
      block: 'center',
      inline: 'center',
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateTargetRect);
    });
  }, [currentStep, scrollBehavior, updateTargetRect]);

  const finishTour = useCallback(() => {
    window.localStorage.setItem(storageKey, 'true');
    setIsActive(false);
    setCurrentIndex(0);
  }, [storageKey]);

  const startTour = () => {
    window.localStorage.removeItem(storageKey);
    setCurrentIndex(0);
    setIsActive(true);
  };

  const goToNextStep = () => {
    if (currentIndex >= steps.length - 1) {
      finishTour();
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const goToPreviousStep = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    scrollToCurrentTarget();
  }, [currentIndex, isActive, scrollToCurrentTarget]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, { passive: true });

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [isActive, updateTargetRect]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finishTour();
      }

      if (event.key === 'ArrowRight') {
        goToNextStep();
      }

      if (event.key === 'ArrowLeft') {
        goToPreviousStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, finishTour, isActive]);

  if (!steps.length) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={startTour}
        className="fixed bottom-6 right-6 z-[75] inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/85 px-4 py-3 text-sm font-bold text-cyan-200 shadow-2xl backdrop-blur-md hover:bg-slate-900"
        aria-label="打开页面指引"
      >
        <HelpCircle size={22} />
        页面指引
      </button>

      <AnimatePresence>
        {isActive && currentStep && targetRect && popoverStyle && (
          <div className="fixed inset-0 z-[80] pointer-events-none">
            <motion.div
              className="absolute inset-0 bg-black/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute rounded-2xl border-2 border-cyan-300 shadow-[0_0_38px_rgba(103,232,249,0.42)]"
              initial={false}
              animate={targetRect}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />

            <motion.div
              className="absolute w-[calc(100vw-32px)] max-w-[340px] rounded-2xl border border-white/15 bg-slate-950 p-5 text-white shadow-2xl pointer-events-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                top: popoverStyle.top,
                left: popoverStyle.left,
              }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="页面指引"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-cyan-200">
                    {currentIndex + 1} / {steps.length}
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight">
                    {currentStep.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={finishTour}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gray-200 hover:bg-white/20"
                  aria-label="关闭页面指引"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mb-5 text-sm leading-6 text-gray-300">
                {currentStep.description}
              </p>

              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-cyan-300"
                  animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.25 }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={finishTour}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  跳过
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={currentIndex === 0}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    上一步
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200"
                  >
                    {currentIndex === steps.length - 1 ? '完成' : '下一步'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
