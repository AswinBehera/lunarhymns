/**
 * Related Tab - Connections to other hymns and themes
 */

import type { RigvedaHymn } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';
import { getHymnsByDeity, getHymnsByTheme } from '../../../lib/hymnAdapter';
import { EXPANDED_HYMNS } from '../../../data/expandedHymns';

interface RelatedTabProps {
  hymn: RigvedaHymn;
}

export function RelatedTab({ hymn }: RelatedTabProps) {
  const sameDeityHymns = getHymnsByDeity(EXPANDED_HYMNS, hymn.devata).filter((h) => h.id !== hymn.id);
  const sameThemeHymns = hymn.philosophicalThemes.length > 0
    ? getHymnsByTheme(EXPANDED_HYMNS, hymn.philosophicalThemes[0]).filter((h) => h.id !== hymn.id)
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Related Hymns & Connections
        </h2>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Explore thematic and conceptual connections
        </p>
      </div>

      {/* Explicitly Related Hymns */}
      {hymn.relatedHymns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🔗</span> Directly Related Hymns
          </h3>
          <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
            These hymns are explicitly connected through themes, structure, or tradition:
          </p>
          <div className="space-y-2">
            {hymn.relatedHymns.map((hymnId, index) => {
              const related = EXPANDED_HYMNS.find((h) => h.id === hymnId);
              if (!related) {
                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: COLORS.background.elevated,
                      borderColor: COLORS.border.subtle,
                    }}
                  >
                    <div className="text-sm font-medium" style={{ color: COLORS.accent.cyan }}>
                      {hymnId}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                      Full data coming soon
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border hover:border-gold-500 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: COLORS.background.elevated,
                    borderColor: COLORS.border.subtle,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium" style={{ color: COLORS.accent.cyan }}>
                      RV {related.mandala}.{related.sukta}
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: `${COLORS.accent.gold}20`,
                        color: COLORS.accent.gold,
                      }}
                    >
                      {related.devata}
                    </span>
                  </div>
                  <div className="text-sm mb-2" style={{ color: COLORS.text.primary }}>
                    {related.rishi}
                  </div>
                  <div className="text-xs line-clamp-2" style={{ color: COLORS.text.secondary }}>
                    {related.historicalContext}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Same Deity Hymns */}
      {sameDeityHymns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🕉️</span> More Hymns to {hymn.devata}
          </h3>
          <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
            Other hymns dedicated to {hymn.devata}:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sameDeityHymns.slice(0, 6).map((related) => (
              <div
                key={related.id}
                className="p-3 rounded-lg border hover:border-gold-500 transition-colors cursor-pointer"
                style={{
                  backgroundColor: COLORS.background.elevated,
                  borderColor: COLORS.border.subtle,
                }}
              >
                <div className="text-sm font-medium mb-1" style={{ color: COLORS.accent.cyan }}>
                  RV {related.mandala}.{related.sukta}
                </div>
                <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  {related.rishi} • {related.verses.length} verses
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Same Theme Hymns */}
      {sameThemeHymns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>💡</span> Similar Themes
          </h3>
          <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
            Hymns exploring {hymn.philosophicalThemes[0]}:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sameThemeHymns.slice(0, 6).map((related) => (
              <div
                key={related.id}
                className="p-3 rounded-lg border hover:border-gold-500 transition-colors cursor-pointer"
                style={{
                  backgroundColor: COLORS.background.elevated,
                  borderColor: COLORS.border.subtle,
                }}
              >
                <div className="text-sm font-medium mb-1" style={{ color: COLORS.accent.purple }}>
                  RV {related.mandala}.{related.sukta} - {related.devata}
                </div>
                <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  {related.rishi}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Philosophical Themes */}
      {hymn.philosophicalThemes.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🌟</span> Explore More Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {hymn.philosophicalThemes.slice(1).map((theme, index) => (
              <button
                key={index}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: `${COLORS.accent.purple}20`,
                  color: COLORS.accent.purple,
                }}
              >
                {theme} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {hymn.relatedHymns.length === 0 && sameDeityHymns.length === 0 && sameThemeHymns.length === 0 && (
        <div className="text-center py-12" style={{ color: COLORS.text.tertiary }}>
          <div className="text-4xl mb-4">🔍</div>
          <p>No related hymns available yet.</p>
          <p className="text-xs mt-2">Check back as we expand the database!</p>
        </div>
      )}
    </div>
  );
}
