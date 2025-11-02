/**
 * Keyboard Shortcuts Help Modal
 *
 * Displays all available keyboard shortcuts in a modal dialog.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, ANIMATION } from '../../styles/colors';
import type { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

/**
 * Format keyboard shortcut for display
 */
function formatShortcut(shortcut: KeyboardShortcut): string {
  const keys: string[] = [];

  if (shortcut.ctrl) keys.push('Ctrl');
  if (shortcut.alt) keys.push('Alt');
  if (shortcut.shift) keys.push('Shift');
  if (shortcut.meta) keys.push('Cmd');

  keys.push(shortcut.key.toUpperCase());

  return keys.join(' + ');
}

/**
 * Keyboard shortcuts help modal
 */
export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

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
            aria-labelledby="shortcuts-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: ANIMATION.duration.panel / 1000,
                ease: "easeOut",
              }}
              className="relative w-full max-w-2xl rounded-xl overflow-hidden"
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
                <h2
                  id="shortcuts-title"
                  className="text-xl font-bold"
                  style={{ color: COLORS.accent.goldLight }}
                >
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: COLORS.accent.gold }}
                  aria-label="Close shortcuts help"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                    >
                      <span
                        className="text-sm"
                        style={{ color: COLORS.text.secondary }}
                      >
                        {shortcut.description}
                      </span>
                      <kbd
                        className="px-3 py-1 text-xs font-mono rounded"
                        style={{
                          backgroundColor: `${COLORS.accent.gold}20`,
                          border: `1px solid ${COLORS.accent.gold}40`,
                          color: COLORS.accent.goldLight,
                        }}
                      >
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>

                {/* Additional info */}
                <div
                  className="mt-6 pt-4 border-t text-xs"
                  style={{
                    borderColor: COLORS.border.subtle,
                    color: COLORS.text.tertiary,
                  }}
                >
                  <p>
                    Tip: Press <kbd className="px-1 py-0.5 rounded bg-white/10">?</kbd> (Shift + ?)
                    anytime to see these shortcuts.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-3 border-t flex justify-end"
                style={{
                  borderColor: COLORS.border.normal,
                  background: `linear-gradient(to top, ${COLORS.accent.gold}10, transparent)`,
                }}
              >
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
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Import SHADOWS
import { SHADOWS } from '../../styles/colors';
