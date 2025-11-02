/**
 * Symbolism Tab - Multi-level symbolic interpretations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RigvedaHymn, Symbolism } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';

interface SymbolismTabProps {
  hymn: RigvedaHymn;
}

type InterpretationLevel = 'literal' | 'metaphorical' | 'spiritual' | 'psychological';

const LEVELS: { key: InterpretationLevel; label: string; icon: string; description: string; color: string }[] = [
  {
    key: 'literal',
    label: 'Literal (Adhibhautika)',
    icon: '🔥',
    description: 'Physical, ritual, and material meaning',
    color: COLORS.accent.gold,
  },
  {
    key: 'metaphorical',
    label: 'Metaphorical (Adhidaivika)',
    icon: '🌄',
    description: 'Natural forces and cosmic principles',
    color: COLORS.accent.cyan,
  },
  {
    key: 'spiritual',
    label: 'Spiritual (Adhiyajnika)',
    icon: '✨',
    description: 'Divine and transcendent reality',
    color: COLORS.accent.purple,
  },
  {
    key: 'psychological',
    label: 'Psychological (Adhyatmika)',
    icon: '🧘',
    description: 'Inner consciousness and self-realization',
    color: '#9B7EBD',
  },
];

export function SymbolismTab({ hymn }: SymbolismTabProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<InterpretationLevel>('literal');

  const toggleSymbol = (index: number) => {
    setExpandedSymbol(expandedSymbol === index ? null : index);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Symbolic Meanings
        </h2>
        <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
          Four layers of interpretation revealing deeper wisdom
        </p>

        {/* Level Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {LEVELS.map((level) => (
            <button
              key={level.key}
              onClick={() => setSelectedLevel(level.key)}
              className="p-3 rounded-lg text-left transition-all"
              style={{
                backgroundColor:
                  selectedLevel === level.key ? `${level.color}20` : COLORS.background.elevated,
                border: `2px solid ${selectedLevel === level.key ? level.color : COLORS.border.subtle}`,
              }}
            >
              <div className="text-lg mb-1">{level.icon}</div>
              <div className="text-xs font-medium mb-1" style={{ color: level.color }}>
                {level.label.split('(')[0]}
              </div>
              <div className="text-[10px]" style={{ color: COLORS.text.tertiary }}>
                {level.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Symbolism Cards */}
      {hymn.symbolism.length === 0 ? (
        <div className="text-center py-12" style={{ color: COLORS.text.tertiary }}>
          <div className="text-4xl mb-4">🔮</div>
          <p>No symbolic interpretations available yet for this hymn.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hymn.symbolism.map((symbolism, index) => (
            <SymbolismCard
              key={index}
              symbolism={symbolism}
              isExpanded={expandedSymbol === index}
              selectedLevel={selectedLevel}
              onToggle={() => toggleSymbol(index)}
            />
          ))}
        </div>
      )}

      {/* Interpretation Guide */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: `${COLORS.accent.purple}10`,
          borderColor: COLORS.border.subtle,
        }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.accent.purple }}>
          💡 Understanding the Four Levels
        </h3>
        <div className="text-xs space-y-2" style={{ color: COLORS.text.secondary }}>
          <p>
            <strong>Literal:</strong> The surface meaning - what the words directly say. Used in ritual and
            physical practice.
          </p>
          <p>
            <strong>Metaphorical:</strong> Natural forces and universal principles represented by the symbols.
          </p>
          <p>
            <strong>Spiritual:</strong> The transcendent reality, divine truths, and cosmic consciousness.
          </p>
          <p>
            <strong>Psychological:</strong> Inner transformation, consciousness development, and
            self-realization.
          </p>
        </div>
      </div>
    </div>
  );
}

function SymbolismCard({
  symbolism,
  isExpanded,
  selectedLevel,
  onToggle,
}: {
  symbolism: Symbolism;
  isExpanded: boolean;
  selectedLevel: InterpretationLevel;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className="border rounded-lg overflow-hidden"
      style={{
        backgroundColor: COLORS.background.elevated,
        borderColor: isExpanded ? COLORS.accent.gold : COLORS.border.subtle,
      }}
    >
      <button onClick={onToggle} className="w-full p-4 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              {symbolism.symbol}
            </h3>
            {!isExpanded && (
              <p className="text-sm line-clamp-2" style={{ color: COLORS.text.secondary }}>
                {symbolism.levels[selectedLevel]}
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: COLORS.accent.gold }}
          >
            ▼
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: `1px solid ${COLORS.border.subtle}` }}
          >
            <div className="p-4 space-y-4">
              {LEVELS.map((level) => (
                <div key={level.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{level.icon}</span>
                    <h4 className="text-sm font-semibold" style={{ color: level.color }}>
                      {level.label}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed ml-7" style={{ color: COLORS.text.primary }}>
                    {symbolism.levels[level.key]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
