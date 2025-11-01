/**
 * BreathingModal Component
 *
 * Full-screen meditation/breathing modal with guided sessions.
 * Features:
 * - Large breathing visualization
 * - Multiple session durations
 * - Progress tracking
 * - Completion summary
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface BreathingModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Current prana data */
  pranaData: PranaData;
  /** Callback to close modal */
  onClose: () => void;
}

type SessionState = 'selection' | 'active' | 'paused' | 'completed';

interface SessionOption {
  label: string;
  pranas: number;
  minutes: number;
}

const SESSION_OPTIONS: SessionOption[] = [
  { label: 'Quick', pranas: 25, minutes: 1.67 },
  { label: 'Short', pranas: 75, minutes: 5 },
  { label: 'Medium', pranas: 225, minutes: 15 },
  { label: 'Long', pranas: 450, minutes: 30 },
];

/**
 * Full-screen breathing meditation modal
 */
export function BreathingModal({ isOpen, pranaData, onClose }: BreathingModalProps) {
  const [sessionState, setSessionState] = useState<SessionState>('selection');
  const [selectedOption, setSelectedOption] = useState<SessionOption | null>(null);
  const [customPranas, setCustomPranas] = useState<number>(100);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Session tracking
  const [sessionStartPrana, setSessionStartPrana] = useState<number>(0);
  const [sessionTargetPranas, setSessionTargetPranas] = useState<number>(0);
  const [completedPranas, setCompletedPranas] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';
  const cyanColor = '#87CEEB';
  const purpleColor = '#9B7EBD';

  // Track elapsed time during active session
  useEffect(() => {
    if (sessionState === 'active' && sessionStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionState, sessionStartTime]);

  // Track prana progress during active session
  useEffect(() => {
    if (sessionState === 'active' && sessionStartPrana > 0) {
      const pranasCompleted = pranaData.number - sessionStartPrana;
      setCompletedPranas(pranasCompleted);

      // Check if session is complete
      if (pranasCompleted >= sessionTargetPranas) {
        setSessionState('completed');
      }
    }
  }, [pranaData.number, sessionState, sessionStartPrana, sessionTargetPranas]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSessionState('selection');
      setSelectedOption(null);
      setShowCustomInput(false);
      setCompletedPranas(0);
      setElapsedTime(0);
    }
  }, [isOpen]);

  /**
   * Start a breathing session
   */
  const startSession = (option: SessionOption) => {
    setSelectedOption(option);
    setSessionStartPrana(pranaData.number);
    setSessionTargetPranas(option.pranas);
    setSessionStartTime(new Date());
    setCompletedPranas(0);
    setElapsedTime(0);
    setSessionState('active');
  };

  /**
   * Start custom session
   */
  const startCustomSession = () => {
    const option: SessionOption = {
      label: 'Custom',
      pranas: customPranas,
      minutes: customPranas / 15,
    };
    startSession(option);
  };

  /**
   * Format time in MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Pause session
   */
  const pauseSession = () => {
    setSessionState('paused');
  };

  /**
   * Resume session
   */
  const resumeSession = () => {
    setSessionState('active');
  };

  /**
   * End session early
   */
  const endSession = () => {
    setSessionState('completed');
  };

  /**
   * Return to selection
   */
  const returnToSelection = () => {
    setSessionState('selection');
    setSelectedOption(null);
    setCompletedPranas(0);
    setElapsedTime(0);
  };

  const remainingPranas = sessionTargetPranas - completedPranas;
  const progress = sessionTargetPranas > 0 ? (completedPranas / sessionTargetPranas) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              border: `2px solid ${goldColor}`,
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: goldColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Content */}
          <div className="w-full max-w-2xl px-8">
            {/* Session Selection Screen */}
            {sessionState === 'selection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-bold mb-4" style={{ color: lightGoldColor }}>
                    Guided Breathing
                  </h2>
                  <p className="text-lg" style={{ color: dimGoldColor }}>
                    Choose your meditation duration
                  </p>
                  <p className="text-sm mt-2" style={{ color: dimGoldColor }}>
                    Current: Prana {pranaData.number} of 21,600 today
                  </p>
                </div>

                {/* Session Options */}
                <div className="grid grid-cols-2 gap-4">
                  {SESSION_OPTIONS.map((option) => (
                    <motion.button
                      key={option.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startSession(option)}
                      className="p-6 rounded-xl text-center transition-all"
                      style={{
                        backgroundColor: 'rgba(155, 126, 189, 0.15)',
                        border: `2px solid ${purpleColor}60`,
                      }}
                    >
                      <div className="text-2xl font-bold mb-2" style={{ color: purpleColor }}>
                        {option.label}
                      </div>
                      <div className="text-sm" style={{ color: lightGoldColor }}>
                        {option.pranas} pranas
                      </div>
                      <div className="text-xs mt-1" style={{ color: dimGoldColor }}>
                        ~{Math.round(option.minutes)} min
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Option */}
                <div className="pt-4">
                  {!showCustomInput ? (
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="text-sm hover:underline"
                      style={{ color: dimGoldColor }}
                    >
                      Custom duration →
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3 justify-center">
                        <input
                          type="number"
                          value={customPranas}
                          onChange={(e) => setCustomPranas(Math.max(1, parseInt(e.target.value) || 0))}
                          min="1"
                          className="w-24 px-3 py-2 rounded-md text-center outline-none"
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            border: `1px solid ${goldColor}40`,
                            color: lightGoldColor,
                          }}
                        />
                        <span style={{ color: dimGoldColor }}>pranas</span>
                        <span style={{ color: dimGoldColor }}>
                          (~{Math.round(customPranas / 15)} min)
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startCustomSession}
                        className="px-6 py-2 rounded-md"
                        style={{
                          backgroundColor: goldColor,
                          color: '#0F172A',
                        }}
                      >
                        Start Custom Session
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Active Session Screen */}
            {(sessionState === 'active' || sessionState === 'paused') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                {/* Breathing Visualization */}
                <div className="flex justify-center">
                  <motion.div
                    className="relative flex items-center justify-center"
                    style={{ width: 400, height: 400 }}
                  >
                    {/* Outer ring */}
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: 400,
                        height: 400,
                        background: `radial-gradient(circle, ${
                          pranaData.breathPhase === 'inhale' ? `${cyanColor}20` : `${goldColor}20`
                        }, transparent 70%)`,
                        border: `3px solid ${
                          pranaData.breathPhase === 'inhale' ? cyanColor : goldColor
                        }40`,
                      }}
                      animate={
                        sessionState === 'active'
                          ? {
                              scale: pranaData.breathPhase === 'inhale' ? [0.8, 1] : [1, 0.8],
                              opacity: [0.5, 1, 0.5],
                            }
                          : { scale: 0.9, opacity: 0.3 }
                      }
                      transition={{
                        duration: 2,
                        repeat: sessionState === 'active' ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Inner circle */}
                    <motion.div
                      className="absolute rounded-full flex items-center justify-center"
                      style={{
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, ${
                          pranaData.breathPhase === 'inhale' ? cyanColor : goldColor
                        }, ${pranaData.breathPhase === 'inhale' ? `${cyanColor}40` : `${goldColor}40`})`,
                        boxShadow: `0 0 60px ${
                          pranaData.breathPhase === 'inhale' ? cyanColor : goldColor
                        }80`,
                      }}
                      animate={
                        sessionState === 'active'
                          ? {
                              scale: pranaData.breathPhase === 'inhale' ? [0.9, 1.1] : [1.1, 0.9],
                            }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: 2,
                        repeat: sessionState === 'active' ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.div
                        className="text-6xl"
                        style={{ fontFamily: '"Noto Sans Devanagari", serif', color: '#0F172A' }}
                      >
                        ॐ
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Breathing Instruction */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pranaData.breathPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl font-bold"
                    style={{
                      color: pranaData.breathPhase === 'inhale' ? cyanColor : goldColor,
                    }}
                  >
                    {sessionState === 'paused'
                      ? 'Paused'
                      : pranaData.breathPhase === 'inhale'
                      ? 'Breathe In'
                      : 'Breathe Out'}
                  </motion.div>
                </AnimatePresence>

                {/* Progress Info */}
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold mb-2" style={{ color: lightGoldColor }}>
                      {remainingPranas} pranas remaining
                    </div>
                    <div className="text-lg" style={{ color: dimGoldColor }}>
                      {completedPranas} of {sessionTargetPranas} completed
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${cyanColor}, ${purpleColor})`,
                        }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="text-sm mt-2" style={{ color: dimGoldColor }}>
                      Elapsed: {formatTime(elapsedTime)}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {sessionState === 'active' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={pauseSession}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{
                        backgroundColor: `${goldColor}30`,
                        border: `2px solid ${goldColor}`,
                        color: lightGoldColor,
                      }}
                    >
                      Pause
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resumeSession}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{
                        backgroundColor: cyanColor,
                        color: '#0F172A',
                      }}
                    >
                      Resume
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={endSession}
                    className="px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '2px solid #ef4444',
                      color: '#fca5a5',
                    }}
                  >
                    End Session
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Completion Screen */}
            {sessionState === 'completed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${purpleColor}, ${purpleColor}40)`,
                      boxShadow: `0 0 60px ${purpleColor}80`,
                    }}
                  >
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#0F172A' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-4xl font-bold mb-4" style={{ color: lightGoldColor }}>
                    Well Done!
                  </h2>
                  <p className="text-xl mb-6" style={{ color: purpleColor }}>
                    You completed your meditation session
                  </p>
                </div>

                {/* Summary */}
                <div
                  className="max-w-md mx-auto p-6 rounded-xl space-y-3"
                  style={{
                    backgroundColor: 'rgba(155, 126, 189, 0.15)',
                    border: `2px solid ${purpleColor}60`,
                  }}
                >
                  <div className="text-lg" style={{ color: lightGoldColor }}>
                    <strong>Session Summary</strong>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: dimGoldColor }}>
                    <span>Duration:</span>
                    <span style={{ color: lightGoldColor }}>
                      {selectedOption?.label} ({formatTime(elapsedTime)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: dimGoldColor }}>
                    <span>Pranas:</span>
                    <span style={{ color: lightGoldColor }}>
                      {completedPranas} breaths
                    </span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: dimGoldColor }}>
                    <span>Progress:</span>
                    <span style={{ color: lightGoldColor }}>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={returnToSelection}
                    className="w-full max-w-xs mx-auto block px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: purpleColor,
                      color: '#0F172A',
                    }}
                  >
                    Start Another Session
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-full max-w-xs mx-auto block px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: `${goldColor}30`,
                      border: `2px solid ${goldColor}`,
                      color: lightGoldColor,
                    }}
                  >
                    Return to Clock
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
