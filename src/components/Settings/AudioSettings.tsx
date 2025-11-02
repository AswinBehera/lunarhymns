/**
 * Audio Settings Component
 *
 * Provides UI controls for background music and sound effects.
 * Includes volume sliders and toggle switches.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, ANIMATION, SHADOWS } from '../../styles/colors';
import type { AudioPreferences } from '../../hooks/useAudio';
import type { MusicTrack } from '../../data/musicPlaylist';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AudioPreferences;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  onToggleMusic: () => void;
  onMusicVolumeChange: (volume: number) => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onToggleShuffle: () => void;
}

/**
 * Audio settings modal
 */
export function AudioSettings({
  isOpen,
  onClose,
  preferences,
  isPlaying,
  currentTrack,
  onToggleMusic,
  onMusicVolumeChange,
  onNextTrack,
  onPreviousTrack,
  onToggleShuffle,
}: AudioSettingsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.duration.normal / 1000 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audio-settings-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: ANIMATION.duration.panel / 1000,
                ease: "easeOut",
              }}
              className="relative w-full max-w-md rounded-xl overflow-hidden"
              style={{
                backgroundColor: COLORS.background.panel,
                border: `1px solid ${COLORS.border.normal}`,
                boxShadow: SHADOWS.xl,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{
                  borderColor: COLORS.border.normal,
                  background: `linear-gradient(to bottom, ${COLORS.accent.gold}10, transparent)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: COLORS.accent.gold }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <h2
                    id="audio-settings-title"
                    className="text-xl font-bold"
                    style={{ color: COLORS.accent.goldLight }}
                  >
                    Audio Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: COLORS.accent.gold }}
                  aria-label="Close audio settings"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Background Music */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium" style={{ color: COLORS.text.primary }}>
                        Spiritual Meditation Music
                      </span>
                      {isPlaying && (
                        <span
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: `${COLORS.accent.cyan}20`,
                            color: COLORS.accent.cyan,
                          }}
                        >
                          Playing
                        </span>
                      )}
                    </div>
                    <button
                      onClick={onToggleMusic}
                      className="relative w-12 h-6 rounded-full transition-colors"
                      style={{
                        backgroundColor: preferences.enableMusic
                          ? COLORS.accent.gold
                          : COLORS.border.subtle,
                      }}
                      aria-label="Toggle background music"
                      aria-pressed={preferences.enableMusic}
                    >
                      <motion.div
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white"
                        animate={{ x: preferences.enableMusic ? 24 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </button>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
                    Curated playlist of spiritual meditation music for peaceful ambience.
                  </p>

                  {/* Current Track Display */}
                  {currentTrack && preferences.enableMusic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 pb-2"
                    >
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: `${COLORS.accent.gold}10`,
                          border: `1px solid ${COLORS.border.subtle}`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: COLORS.accent.goldLight }}
                            >
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium truncate"
                              style={{ color: COLORS.text.primary }}
                            >
                              {currentTrack.title}
                            </div>
                            <div
                              className="text-xs truncate mt-0.5"
                              style={{ color: COLORS.text.tertiary }}
                            >
                              {currentTrack.artist}
                            </div>
                            {currentTrack.description && (
                              <div
                                className="text-xs mt-1"
                                style={{ color: COLORS.text.secondary }}
                              >
                                {currentTrack.description}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center gap-2 mt-3">
                          {/* Shuffle Button */}
                          <button
                            onClick={onToggleShuffle}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{
                              backgroundColor: preferences.shuffle
                                ? `${COLORS.accent.gold}30`
                                : 'transparent',
                              color: preferences.shuffle
                                ? COLORS.accent.gold
                                : COLORS.text.tertiary,
                            }}
                            aria-label="Toggle shuffle"
                            title="Shuffle"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                            </svg>
                          </button>

                          {/* Previous Button */}
                          <button
                            onClick={onPreviousTrack}
                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            style={{ color: COLORS.accent.goldLight }}
                            aria-label="Previous track"
                            title="Previous"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                          </button>

                          {/* Play/Pause Display (info only, controlled by main toggle) */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${COLORS.accent.gold}20`,
                              color: COLORS.accent.gold,
                            }}
                          >
                            {isPlaying ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={onNextTrack}
                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            style={{ color: COLORS.accent.goldLight }}
                            aria-label="Next track"
                            title="Next"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                          </button>

                          {/* Loop Indicator (always looping playlist) */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ color: COLORS.text.tertiary }}
                            title="Playlist loops automatically"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {preferences.enableMusic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2"
                    >
                      <label className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: COLORS.accent.goldLight }}
                        >
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={preferences.musicVolume * 100}
                          onChange={(e) => onMusicVolumeChange(Number(e.target.value) / 100)}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${COLORS.accent.gold} 0%, ${COLORS.accent.gold} ${preferences.musicVolume * 100}%, ${COLORS.border.subtle} ${preferences.musicVolume * 100}%, ${COLORS.border.subtle} 100%)`,
                          }}
                          aria-label="Music volume"
                        />
                        <span className="text-sm w-12 text-right font-medium" style={{ color: COLORS.accent.goldLight }}>
                          {Math.round(preferences.musicVolume * 100)}%
                        </span>
                      </label>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-3 border-t flex justify-between items-center"
                style={{
                  borderColor: COLORS.border.normal,
                  background: `linear-gradient(to top, ${COLORS.accent.gold}10, transparent)`,
                }}
              >
                <p className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  Audio may require user interaction to start
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: COLORS.accent.gold,
                    color: COLORS.background.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.accent.goldLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.accent.gold;
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
