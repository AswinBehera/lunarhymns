/**
 * Context Tab - Historical and cultural background
 */

import type { RigvedaHymn } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';
import { getHymnReference } from '../../../lib/hymnAdapter';

interface ContextTabProps {
  hymn: RigvedaHymn;
}

export function ContextTab({ hymn }: ContextTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Historical & Cultural Context
        </h2>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Understanding the background of {getHymnReference(hymn)}
        </p>
      </div>

      {/* Historical Context */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
          <span>🏛️</span> Historical Context
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
          {hymn.historicalContext}
        </p>
      </div>

      {/* Position in Rigveda */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent.gold}10` }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.accent.gold }}>
          📍 Position in Rigveda Structure
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div style={{ color: COLORS.text.tertiary }}>Mandala</div>
            <div className="font-medium" style={{ color: COLORS.text.primary }}>{hymn.mandala} (Book {hymn.mandala})</div>
          </div>
          <div>
            <div style={{ color: COLORS.text.tertiary }}>Sukta</div>
            <div className="font-medium" style={{ color: COLORS.text.primary }}>{hymn.sukta}</div>
          </div>
          <div>
            <div style={{ color: COLORS.text.tertiary }}>Meters Used</div>
            <div className="font-medium" style={{ color: COLORS.text.primary }}>{hymn.chhandas}</div>
          </div>
          <div>
            <div style={{ color: COLORS.text.tertiary }}>Verses</div>
            <div className="font-medium" style={{ color: COLORS.text.primary }}>{hymn.verses.length}</div>
          </div>
        </div>
      </div>

      {/* Related Deities */}
      {hymn.relatedDeities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🕉️</span> Related Deities
          </h3>
          <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
            Other deities mentioned or invoked in this hymn:
          </p>
          <div className="flex flex-wrap gap-2">
            {hymn.relatedDeities.map((deity, index) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${COLORS.accent.purple}20`,
                  color: COLORS.accent.purple,
                }}
              >
                {deity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Concepts */}
      {hymn.relatedConcepts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>💡</span> Key Concepts
          </h3>
          <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
            Important Vedic concepts explored in this hymn:
          </p>
          <div className="space-y-2">
            {hymn.relatedConcepts.map((concept, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded border"
                style={{
                  backgroundColor: COLORS.background.elevated,
                  borderColor: COLORS.border.subtle,
                }}
              >
                <div className="text-sm font-medium" style={{ color: COLORS.accent.cyan }}>
                  {concept}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Hymns Context */}
      {hymn.relatedHymns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🔗</span> Related Hymns
          </h3>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            This hymn connects with {hymn.relatedHymns.length} other hymn{hymn.relatedHymns.length !== 1 ? 's' : ''} in the Rigveda through shared themes, deities, or compositional patterns.
          </p>
        </div>
      )}
    </div>
  );
}
