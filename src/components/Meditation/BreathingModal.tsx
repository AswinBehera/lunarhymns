/**
 * BreathingModal Component
 *
 * Full-screen meditation/breathing modal with guided sessions.
 * Features:
 * - Large breathing visualization
 * - Multiple session durations
 * - Progress tracking
 * - Completion summary
 * - Proper 4-phase breathing cycle (inhale, hold, exhale, hold)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface BreathingModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Current prana data (kept for compatibility but not used) */
  pranaData?: PranaData;
  /** Callback to close modal */
  onClose: () => void;
}

type SessionState = 'selection' | 'active' | 'paused' | 'completed';
type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  totalSeconds: number;
}

interface SessionOption {
  label: string;
  minutes: number;
}

const SESSION_OPTIONS: SessionOption[] = [
  { label: 'Quick', minutes: 2 },
  { label: 'Short', minutes: 5 },
  { label: 'Medium', minutes: 10 },
  { label: 'Long', minutes: 20 },
];

// Scientifically-backed breathing patterns
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal timing - great for focus and stress relief',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    totalSeconds: 16,
  },
  {
    name: '4-7-8 Breathing',
    description: 'Relaxation technique - promotes calmness and sleep',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    totalSeconds: 19,
  },
  {
    name: 'Coherent Breathing',
    description: 'Simple and effective - 5 breaths per minute',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    totalSeconds: 10,
  },
  {
    name: 'Deep Calm',
    description: 'Extended exhale - deeply relaxing',
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
    totalSeconds: 14,
  },
];

/**
 * Full-screen breathing meditation modal
 */
export function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [sessionState, setSessionState] = useState<SessionState>('selection');
  const [selectedOption, setSelectedOption] = useState<SessionOption | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Session tracking
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionTargetSeconds, setSessionTargetSeconds] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [breathCount, setBreathCount] = useState<number>(0);

  // Breathing cycle tracking
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState<number>(0); // 0-100 for current phase
  const [cycleStartTime, setCycleStartTime] = useState<number>(Date.now());

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

        // Check if session is complete
        if (elapsed >= sessionTargetSeconds) {
          setSessionState('completed');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionState, sessionStartTime, sessionTargetSeconds]);

  // Breathing cycle timer - runs during active session
  useEffect(() => {
    if (sessionState !== 'active') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - cycleStartTime) / 1000; // seconds since cycle start
      const pattern = selectedPattern;

      // Determine current phase and progress
      let newPhase: BreathPhase = 'inhale';
      let phaseStartTime = 0;
      let phaseDuration = 0;

      // Inhale phase
      if (elapsed < pattern.inhale) {
        newPhase = 'inhale';
        phaseStartTime = 0;
        phaseDuration = pattern.inhale;
      }
      // Hold-in phase
      else if (elapsed < pattern.inhale + pattern.holdIn) {
        newPhase = 'hold-in';
        phaseStartTime = pattern.inhale;
        phaseDuration = pattern.holdIn;
      }
      // Exhale phase
      else if (elapsed < pattern.inhale + pattern.holdIn + pattern.exhale) {
        newPhase = 'exhale';
        phaseStartTime = pattern.inhale + pattern.holdIn;
        phaseDuration = pattern.exhale;
      }
      // Hold-out phase
      else if (elapsed < pattern.totalSeconds) {
        newPhase = 'hold-out';
        phaseStartTime = pattern.inhale + pattern.holdIn + pattern.exhale;
        phaseDuration = pattern.holdOut;
      }
      // Cycle complete - start new cycle
      else {
        setCycleStartTime(now);
        setBreathCount(prev => prev + 1);
        return;
      }

      // Calculate progress within current phase (0-100)
      const phaseElapsed = elapsed - phaseStartTime;
      const progress = phaseDuration > 0 ? Math.min(100, (phaseElapsed / phaseDuration) * 100) : 100;

      setCurrentPhase(newPhase);
      setPhaseProgress(progress);
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [sessionState, cycleStartTime, selectedPattern]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSessionState('selection');
      setSelectedOption(null);
      setShowCustomInput(false);
      setElapsedTime(0);
      setBreathCount(0);
      setCurrentPhase('inhale');
      setPhaseProgress(0);
    }
  }, [isOpen]);

  /**
   * Start a breathing session
   */
  const startSession = (option: SessionOption) => {
    setSelectedOption(option);
    setSessionTargetSeconds(option.minutes * 60);
    setSessionStartTime(new Date());
    setElapsedTime(0);
    setBreathCount(0);
    setCycleStartTime(Date.now());
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setSessionState('active');
  };

  /**
   * Start custom session
   */
  const startCustomSession = () => {
    const option: SessionOption = {
      label: 'Custom',
      minutes: customMinutes,
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
    // Reset cycle timer when resuming
    setCycleStartTime(Date.now());
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
    setElapsedTime(0);
    setBreathCount(0);
  };

  /**
   * Get instruction text for current phase
   */
  const getPhaseInstruction = (): string => {
    if (sessionState === 'paused') return 'Paused';
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold-in':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold-out':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  /**
   * Get color for current phase
   */
  const getPhaseColor = (): string => {
    switch (currentPhase) {
      case 'inhale':
        return cyanColor;
      case 'hold-in':
        return purpleColor;
      case 'exhale':
        return goldColor;
      case 'hold-out':
        return lightGoldColor;
      default:
        return goldColor;
    }
  };

  /**
   * Get scale for breathing animation
   */
  const getAnimationScale = (): number => {
    const baseScale = 0.8;
    const maxScale = 1.2;

    if (currentPhase === 'inhale') {
      return baseScale + (maxScale - baseScale) * (phaseProgress / 100);
    } else if (currentPhase === 'hold-in') {
      return maxScale;
    } else if (currentPhase === 'exhale') {
      return maxScale - (maxScale - baseScale) * (phaseProgress / 100);
    } else {
      return baseScale;
    }
  };

  const remainingSeconds = sessionTargetSeconds - elapsedTime;
  const progress = sessionTargetSeconds > 0 ? (elapsedTime / sessionTargetSeconds) * 100 : 0;

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
                className="text-center space-y-6"
              >
                <div>
                  <h2 className="text-4xl font-bold mb-4" style={{ color: lightGoldColor }}>
                    Guided Breathing
                  </h2>
                  <p className="text-lg" style={{ color: dimGoldColor }}>
                    Choose your meditation duration and breathing pattern
                  </p>
                </div>

                {/* Breathing Pattern Selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium" style={{ color: lightGoldColor }}>
                    Breathing Pattern
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {BREATHING_PATTERNS.map((pattern) => (
                      <motion.button
                        key={pattern.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedPattern(pattern)}
                        className="p-3 rounded-lg text-left transition-all"
                        style={{
                          backgroundColor:
                            selectedPattern.name === pattern.name
                              ? `${goldColor}30`
                              : 'rgba(155, 126, 189, 0.1)',
                          border: `2px solid ${
                            selectedPattern.name === pattern.name ? goldColor : `${purpleColor}40`
                          }`,
                        }}
                      >
                        <div
                          className="text-base font-semibold mb-1"
                          style={{ color: selectedPattern.name === pattern.name ? goldColor : purpleColor }}
                        >
                          {pattern.name}
                        </div>
                        <div className="text-xs" style={{ color: dimGoldColor }}>
                          {pattern.description}
                        </div>
                        <div className="text-xs mt-1.5" style={{ color: lightGoldColor }}>
                          {pattern.inhale}s in
                          {pattern.holdIn > 0 && ` • ${pattern.holdIn}s hold`} • {pattern.exhale}s out
                          {pattern.holdOut > 0 && ` • ${pattern.holdOut}s hold`}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Duration Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium" style={{ color: lightGoldColor }}>
                    Session Duration
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {SESSION_OPTIONS.map((option) => (
                      <motion.button
                        key={option.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startSession(option)}
                        className="p-4 rounded-xl text-center transition-all"
                        style={{
                          backgroundColor: 'rgba(135, 206, 235, 0.15)',
                          border: `2px solid ${cyanColor}60`,
                        }}
                      >
                        <div className="text-xl font-bold mb-1" style={{ color: cyanColor }}>
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: lightGoldColor }}>
                          {option.minutes} min
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Option */}
                <div className="pt-2">
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
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                          min="1"
                          className="w-24 px-3 py-2 rounded-md text-center outline-none"
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            border: `1px solid ${goldColor}40`,
                            color: lightGoldColor,
                          }}
                        />
                        <span style={{ color: dimGoldColor }}>minutes</span>
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
                        background: `radial-gradient(circle, ${getPhaseColor()}20, transparent 70%)`,
                        border: `3px solid ${getPhaseColor()}40`,
                      }}
                      animate={
                        sessionState === 'active'
                          ? {
                              scale: getAnimationScale(),
                              opacity: 0.4 + (phaseProgress / 100) * 0.6,
                            }
                          : { scale: 0.9, opacity: 0.3 }
                      }
                      transition={{
                        duration: 0.1,
                        ease: 'linear',
                      }}
                    />

                    {/* Inner circle */}
                    <motion.div
                      className="absolute rounded-full flex items-center justify-center"
                      style={{
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, ${getPhaseColor()}, ${getPhaseColor()}40)`,
                        boxShadow: `0 0 60px ${getPhaseColor()}80`,
                      }}
                      animate={
                        sessionState === 'active'
                          ? {
                              scale: getAnimationScale(),
                            }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: 0.1,
                        ease: 'linear',
                      }}
                    >
                      <motion.div
                        className="text-6xl"
                        style={{ fontFamily: '"Noto Sans Devanagari", serif', color: '#0F172A' }}
                      >
                        ॐ
                      </motion.div>
                    </motion.div>

                    {/* Progress indicator ring */}
                    <svg className="absolute" width="400" height="400" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="200"
                        cy="200"
                        r="195"
                        fill="none"
                        stroke={`${getPhaseColor()}40`}
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="200"
                        cy="200"
                        r="195"
                        fill="none"
                        stroke={getPhaseColor()}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 195}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 195 * (1 - phaseProgress / 100),
                        }}
                        transition={{
                          duration: 0.1,
                          ease: 'linear',
                        }}
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Breathing Instruction */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-5xl font-bold"
                    style={{
                      color: getPhaseColor(),
                    }}
                  >
                    {getPhaseInstruction()}
                  </motion.div>
                </AnimatePresence>

                {/* Pattern name and timing */}
                <div className="text-sm" style={{ color: dimGoldColor }}>
                  {selectedPattern.name} • {breathCount} breaths completed
                </div>

                {/* Progress Info */}
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold mb-2" style={{ color: lightGoldColor }}>
                      {formatTime(remainingSeconds)} remaining
                    </div>
                    <div className="text-lg" style={{ color: dimGoldColor }}>
                      {formatTime(elapsedTime)} of {formatTime(sessionTargetSeconds)} completed
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
                      {Math.round(progress)}% complete
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
                    <span>Pattern:</span>
                    <span style={{ color: lightGoldColor }}>
                      {selectedPattern.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: dimGoldColor }}>
                    <span>Breaths:</span>
                    <span style={{ color: lightGoldColor }}>
                      {breathCount} cycles
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
