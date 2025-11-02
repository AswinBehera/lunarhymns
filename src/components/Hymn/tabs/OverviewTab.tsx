/**
 * Overview Tab
 *
 * Provides a comprehensive overview of the hymn with key metadata,
 * summary, and quick access to study features.
 */

import { motion } from 'framer-motion';
import type { RigvedaHymn, SimpleHymn } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';
import { getHymnReference, getFullHymnTitle } from '../../../lib/hymnAdapter';

interface OverviewTabProps {
  expandedHymn?: RigvedaHymn;
  simpleHymn: SimpleHymn;
  nakshatraName?: string;
  onHymnRead?: (storyId: number) => void;
}

/**
 * Overview tab showing hymn summary and metadata
 */
export function OverviewTab({ expandedHymn, simpleHymn, nakshatraName, onHymnRead }: OverviewTabProps) {
  const hasExpanded = !!expandedHymn;

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return COLORS.accent.cyan;
      case 'intermediate':
        return COLORS.accent.gold;
      case 'advanced':
        return COLORS.accent.purple;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold" style={{ color: COLORS.accent.goldLight }}>
            {hasExpanded ? getFullHymnTitle(expandedHymn) : simpleHymn.title}
          </h2>
          <div
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${getDifficultyColor(expandedHymn?.difficulty || 'beginner')}20`,
              color: getDifficultyColor(expandedHymn?.difficulty || 'beginner'),
            }}
          >
            {expandedHymn?.difficulty || 'Beginner'}
          </div>
        </div>
        <div className="text-sm" style={{ color: COLORS.text.secondary }}>
          {hasExpanded ? getHymnReference(expandedHymn) : `RV ${simpleHymn.mandala}.${simpleHymn.sukta}`}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetadataCard
          label="Rishi"
          value={expandedHymn?.rishi || simpleHymn.rishi || 'Unknown'}
          icon="👤"
        />
        <MetadataCard
          label="Devata"
          value={expandedHymn?.devata || simpleHymn.devata || 'Unknown'}
          icon="🕉️"
        />
        {expandedHymn && (
          <>
            <MetadataCard label="Chhandas" value={expandedHymn.chhandas} icon="📏" />
            <MetadataCard label="Verses" value={expandedHymn.verses.length.toString()} icon="📜" />
          </>
        )}
      </div>

      {/* Nakshatra Context */}
      {nakshatraName && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: `${COLORS.accent.purple}10`,
            borderColor: COLORS.border.subtle,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌙</span>
            <h3 className="text-sm font-semibold" style={{ color: COLORS.accent.purple }}>
              Today's Nakshatra
            </h3>
          </div>
          <p className="text-sm" style={{ color: COLORS.text.primary }}>
            Selected for {nakshatraName} nakshatra - this hymn's themes resonate with the lunar energy of today.
          </p>
        </div>
      )}

      {/* Theme/Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold" style={{ color: COLORS.accent.goldLight }}>
          {hasExpanded ? 'Historical Context' : 'Theme'}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
          {expandedHymn?.historicalContext || simpleHymn.theme}
        </p>
      </div>

      {/* Philosophical Themes */}
      {expandedHymn && expandedHymn.philosophicalThemes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.accent.goldLight }}>
            Philosophical Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {expandedHymn.philosophicalThemes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${COLORS.accent.cyan}20`,
                  color: COLORS.accent.cyan,
                }}
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {expandedHymn && (
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${COLORS.accent.gold}10` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <StatItem
              label="Study Time"
              value={`${expandedHymn.estimatedStudyTime} min`}
              icon="⏱️"
            />
            <StatItem label="Key Terms" value={expandedHymn.keyTerms.length.toString()} icon="📝" />
            <StatItem
              label="Commentaries"
              value={expandedHymn.commentaries.length.toString()}
              icon="💬"
            />
          </div>
        </div>
      )}

      {/* Audio Recitation */}
      {expandedHymn?.audioRecitation && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: `${COLORS.accent.cyan}10`,
            borderColor: COLORS.border.subtle,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎵</span>
              <h3 className="text-sm font-semibold" style={{ color: COLORS.accent.cyan }}>
                Audio Recitation
              </h3>
            </div>
            <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
              {Math.floor(expandedHymn.audioRecitation.duration / 60)}:
              {(expandedHymn.audioRecitation.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: COLORS.text.secondary }}>
            {expandedHymn.audioRecitation.reciter} • {expandedHymn.audioRecitation.tradition}
          </p>
          <button
            className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
            style={{
              backgroundColor: COLORS.accent.cyan,
              color: COLORS.background.primary,
            }}
          >
            ▶ Play Recitation
          </button>
        </div>
      )}

      {/* Tags */}
      {expandedHymn && expandedHymn.tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: COLORS.text.secondary }}>
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {expandedHymn.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: COLORS.background.elevated,
                  color: COLORS.text.tertiary,
                  border: `1px solid ${COLORS.border.subtle}`,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onHymnRead && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onHymnRead(simpleHymn.id)}
            className="flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: COLORS.accent.gold,
              color: COLORS.background.primary,
            }}
          >
            ✓ Mark as Read
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors border"
          style={{
            backgroundColor: 'transparent',
            color: COLORS.accent.goldLight,
            borderColor: COLORS.accent.gold,
          }}
        >
          + Add to Study List
        </motion.button>
      </div>

      {/* Simple Hymn Content (fallback) */}
      {!hasExpanded && (
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: COLORS.border.subtle }}>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.accent.goldLight }}>
              Sanskrit Text
            </h3>
            <p
              className="text-base leading-relaxed font-serif"
              style={{ color: COLORS.text.primary }}
            >
              {simpleHymn.content}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.accent.goldLight }}>
              Translation
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
              {simpleHymn.translation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Metadata card component
 */
function MetadataCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        backgroundColor: COLORS.background.elevated,
        borderColor: COLORS.border.subtle,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
          {label}
        </div>
      </div>
      <div className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
        {value}
      </div>
    </div>
  );
}

/**
 * Stat item component
 */
function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-lg font-bold" style={{ color: COLORS.accent.gold }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
        {label}
      </div>
    </div>
  );
}
