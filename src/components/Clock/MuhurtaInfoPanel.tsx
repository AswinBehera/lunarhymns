/**
 * MuhurtaInfoPanel Component
 *
 * Displays detailed information about a selected muhurta including:
 * - Name, ruling deity, category
 * - Significance and best activities
 * - Auspiciousness level with color coding
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { MuhurtaDetail } from '../../data/muhurtaDetails';

interface MuhurtaInfoPanelProps {
  /** Muhurta details to display */
  muhurta: MuhurtaDetail | null;
  /** Callback to close the panel */
  onClose: () => void;
}

/**
 * Get color based on muhurta category
 */
function getCategoryColor(category: MuhurtaDetail['category']): {
  bg: string;
  border: string;
  text: string;
} {
  switch (category) {
    case 'auspicious':
      return {
        bg: 'rgba(34, 197, 94, 0.1)', // Green
        border: '#22C55E',
        text: '#22C55E',
      };
    case 'neutral':
      return {
        bg: 'rgba(234, 179, 8, 0.1)', // Yellow
        border: '#EAB308',
        text: '#EAB308',
      };
    case 'inauspicious':
      return {
        bg: 'rgba(239, 68, 68, 0.1)', // Red
        border: '#EF4444',
        text: '#EF4444',
      };
  }
}

/**
 * Muhurta information display panel
 */
export function MuhurtaInfoPanel({ muhurta, onClose }: MuhurtaInfoPanelProps) {
  if (!muhurta) return null;

  const categoryColors = getCategoryColor(muhurta.category);
  const goldColor = '#D4AF37';

  return (
    <AnimatePresence>
      {muhurta && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 overflow-hidden"
              style={{ borderColor: goldColor }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 border-b-2"
                style={{
                  borderColor: `${goldColor}40`,
                  background: `linear-gradient(to bottom, ${goldColor}20, transparent)`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Muhurta number */}
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: goldColor, opacity: 0.8 }}
                    >
                      Muhurta {muhurta.number} of 30
                    </div>

                    {/* English name */}
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ color: '#F4E5B8' }}
                    >
                      {muhurta.nameEnglish}
                    </h2>

                    {/* Sanskrit name */}
                    <div
                      className="text-lg"
                      style={{
                        color: goldColor,
                        fontFamily: '"Noto Sans Devanagari", serif',
                      }}
                    >
                      {muhurta.nameSanskrit}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="ml-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    style={{ color: goldColor }}
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

                {/* Category badge */}
                <div className="mt-3">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
                    style={{
                      backgroundColor: categoryColors.bg,
                      borderColor: categoryColors.border,
                      color: categoryColors.text,
                    }}
                  >
                    {muhurta.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Ruling deity */}
                {muhurta.rulingDeity && (
                  <div>
                    <h3
                      className="text-sm font-semibold uppercase tracking-wider mb-1"
                      style={{ color: goldColor, opacity: 0.7 }}
                    >
                      Ruling Deity
                    </h3>
                    <p style={{ color: '#F4E5B8' }}>{muhurta.rulingDeity}</p>
                  </div>
                )}

                {/* Significance */}
                <div>
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider mb-1"
                    style={{ color: goldColor, opacity: 0.7 }}
                  >
                    Significance
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {muhurta.significance}
                  </p>
                </div>

                {/* Best activities */}
                <div>
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider mb-2"
                    style={{ color: goldColor, opacity: 0.7 }}
                  >
                    Best For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {muhurta.bestFor.map((activity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs bg-slate-800/60 border"
                        style={{
                          borderColor: `${goldColor}40`,
                          color: '#F4E5B8',
                        }}
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {muhurta.notes && (
                  <div>
                    <h3
                      className="text-sm font-semibold uppercase tracking-wider mb-1"
                      style={{ color: goldColor, opacity: 0.7 }}
                    >
                      Additional Notes
                    </h3>
                    <p className="text-slate-300 leading-relaxed italic">
                      {muhurta.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-3 border-t-2 text-center"
                style={{
                  borderColor: `${goldColor}40`,
                  background: `linear-gradient(to top, ${goldColor}15, transparent)`,
                }}
              >
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
                  style={{ color: goldColor }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
