/**
 * Verses Tab
 *
 * Displays all verses with Sanskrit text, transliteration,
 * word-by-word analysis, and multiple translations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RigvedaHymn, Verse, WordMeaning } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';
import { InteractiveVerse } from '../InteractiveVerse';

interface VersesTabProps {
  hymn: RigvedaHymn;
}

type ViewMode = 'standard' | 'interactive';

/**
 * Verses tab with expandable verse details
 */
export function VersesTab({ hymn }: VersesTabProps) {
  const [expandedVerse, setExpandedVerse] = useState<number | null>(1); // Start with first verse expanded
  const [showWordByWord, setShowWordByWord] = useState<{ [key: number]: boolean }>({});
  const [selectedTranslation, setSelectedTranslation] = useState<{ [key: number]: number }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('standard');

  const toggleVerse = (verseNumber: number) => {
    setExpandedVerse(expandedVerse === verseNumber ? null : verseNumber);
  };

  const toggleWordByWord = (verseNumber: number) => {
    setShowWordByWord((prev) => ({ ...prev, [verseNumber]: !prev[verseNumber] }));
  };

  const selectTranslation = (verseNumber: number, index: number) => {
    setSelectedTranslation((prev) => ({ ...prev, [verseNumber]: index }));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
              Verses
            </h2>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>
              {hymn.verses.length} verse{hymn.verses.length !== 1 ? 's' : ''} •{' '}
              {viewMode === 'interactive'
                ? 'Interactive Sanskrit learning mode'
                : 'Click to expand for detailed analysis'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('standard')}
              className="px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: viewMode === 'standard' ? COLORS.accent.gold : COLORS.background.panel,
                color: viewMode === 'standard' ? COLORS.background.primary : COLORS.text.secondary,
                border: `1px solid ${COLORS.border.subtle}`,
              }}
            >
              📖 Standard View
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className="px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: viewMode === 'interactive' ? COLORS.accent.cyan : COLORS.background.panel,
                color: viewMode === 'interactive' ? COLORS.background.primary : COLORS.text.secondary,
                border: `1px solid ${COLORS.border.subtle}`,
              }}
            >
              🎯 Interactive Learning
            </button>
          </div>
        </div>
      </div>

      {/* Render verses based on view mode */}
      {viewMode === 'interactive' ? (
        // Interactive Learning Mode
        <div className="space-y-6">
          {hymn.verses.map((verse) => {
            const currentTranslation = verse.translation[selectedTranslation[verse.number] || 0];
            return (
              <InteractiveVerse
                key={verse.number}
                sanskrit={verse.sanskrit}
                verseNumber={verse.number}
                transliteration={verse.transliteration}
                translation={currentTranslation?.text}
              />
            );
          })}
        </div>
      ) : (
        // Standard View Mode
        hymn.verses.map((verse) => (
          <VerseCard
            key={verse.number}
            verse={verse}
            isExpanded={expandedVerse === verse.number}
            showWordByWord={showWordByWord[verse.number] || false}
            selectedTranslationIndex={selectedTranslation[verse.number] || 0}
            onToggle={() => toggleVerse(verse.number)}
            onToggleWordByWord={() => toggleWordByWord(verse.number)}
            onSelectTranslation={(index) => selectTranslation(verse.number, index)}
            hymn={hymn}
          />
        ))
      )}
    </div>
  );
}

/**
 * Individual verse card with expandable details
 */
function VerseCard({
  verse,
  isExpanded,
  showWordByWord,
  selectedTranslationIndex,
  onToggle,
  onToggleWordByWord,
  onSelectTranslation,
  hymn,
}: {
  verse: Verse;
  isExpanded: boolean;
  showWordByWord: boolean;
  selectedTranslationIndex: number;
  onToggle: () => void;
  onToggleWordByWord: () => void;
  onSelectTranslation: (index: number) => void;
  hymn: RigvedaHymn;
}) {
  const currentTranslation = verse.translation[selectedTranslationIndex] || verse.translation[0];

  // Find key terms in this verse
  const verseKeyTerms = hymn.keyTerms.filter((term) =>
    verse.sanskrit.toLowerCase().includes(term.sanskrit.toLowerCase())
  );

  return (
    <motion.div
      layout
      className="border rounded-lg overflow-hidden"
      style={{
        backgroundColor: COLORS.background.elevated,
        borderColor: isExpanded ? COLORS.accent.gold : COLORS.border.subtle,
      }}
    >
      {/* Verse Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-bold px-2 py-1 rounded"
                style={{
                  backgroundColor: `${COLORS.accent.gold}20`,
                  color: COLORS.accent.gold,
                }}
              >
                Verse {verse.number}
              </span>
              {verseKeyTerms.length > 0 && (
                <span className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  {verseKeyTerms.length} key term{verseKeyTerms.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-base font-serif leading-relaxed" style={{ color: COLORS.text.primary }}>
              {verse.sanskrit}
            </p>
            <p className="text-sm italic" style={{ color: COLORS.text.secondary }}>
              {verse.transliteration}
            </p>
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

      {/* Expanded Content */}
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
              {/* Word-by-Word Analysis Toggle */}
              {verse.wordByWord.length > 0 && (
                <div>
                  <button
                    onClick={onToggleWordByWord}
                    className="text-sm font-medium hover:underline flex items-center gap-2"
                    style={{ color: COLORS.accent.cyan }}
                  >
                    <span>{showWordByWord ? '▼' : '▶'}</span>
                    Word-by-Word Analysis ({verse.wordByWord.length} words)
                  </button>

                  <AnimatePresence>
                    {showWordByWord && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {verse.wordByWord.map((word, index) => (
                          <WordMeaningCard key={index} word={word} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Translation Selector */}
              {verse.translation.length > 1 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium" style={{ color: COLORS.text.tertiary }}>
                    Translation by:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {verse.translation.map((trans, index) => (
                      <button
                        key={index}
                        onClick={() => onSelectTranslation(index)}
                        className="px-3 py-1 rounded text-xs font-medium transition-colors"
                        style={{
                          backgroundColor:
                            selectedTranslationIndex === index
                              ? COLORS.accent.gold
                              : COLORS.background.panel,
                          color:
                            selectedTranslationIndex === index
                              ? COLORS.background.primary
                              : COLORS.text.secondary,
                          border: `1px solid ${COLORS.border.subtle}`,
                        }}
                      >
                        {trans.translator}
                        {trans.year && ` (${trans.year})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Translation */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${COLORS.accent.gold}10` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium" style={{ color: COLORS.accent.goldLight }}>
                    {currentTranslation.translator}
                    {currentTranslation.year && ` (${currentTranslation.year})`}
                  </div>
                  {currentTranslation.interpretation && (
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: `${COLORS.accent.cyan}20`,
                        color: COLORS.accent.cyan,
                      }}
                    >
                      {currentTranslation.interpretation}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
                  {currentTranslation.text}
                </p>
              </div>

              {/* Verse Commentary */}
              {verse.commentary && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold" style={{ color: COLORS.accent.goldLight }}>
                    Commentary
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
                    {verse.commentary}
                  </p>
                </div>
              )}

              {/* Key Terms in This Verse */}
              {verseKeyTerms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold" style={{ color: COLORS.accent.goldLight }}>
                    Key Terms
                  </div>
                  <div className="space-y-2">
                    {verseKeyTerms.map((term, index) => (
                      <div
                        key={index}
                        className="p-2 rounded border"
                        style={{
                          backgroundColor: `${COLORS.accent.purple}10`,
                          borderColor: COLORS.border.subtle,
                        }}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-serif" style={{ color: COLORS.text.primary }}>
                            {term.sanskrit}
                          </span>
                          <span className="text-xs italic" style={{ color: COLORS.text.tertiary }}>
                            ({term.term})
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                          {term.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  className="px-3 py-1 rounded text-xs font-medium transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: COLORS.background.panel,
                    color: COLORS.text.secondary,
                    border: `1px solid ${COLORS.border.subtle}`,
                  }}
                >
                  📋 Copy Verse
                </button>
                <button
                  className="px-3 py-1 rounded text-xs font-medium transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: COLORS.background.panel,
                    color: COLORS.text.secondary,
                    border: `1px solid ${COLORS.border.subtle}`,
                  }}
                >
                  ✍️ Add Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Word meaning card showing grammatical details
 */
function WordMeaningCard({ word }: { word: WordMeaning }) {
  return (
    <div
      className="p-3 rounded border"
      style={{
        backgroundColor: COLORS.background.panel,
        borderColor: COLORS.border.subtle,
      }}
    >
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="font-semibold mb-1 font-serif" style={{ color: COLORS.text.primary }}>
            {word.sanskrit}
          </div>
          <div className="italic" style={{ color: COLORS.text.tertiary }}>
            {word.transliteration}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1" style={{ color: COLORS.accent.cyan }}>
            {word.meaning}
          </div>
          {word.grammaticalInfo && (
            <div style={{ color: COLORS.text.tertiary }}>{word.grammaticalInfo}</div>
          )}
        </div>
        {word.etymology && (
          <div>
            <div className="text-[10px] uppercase mb-1" style={{ color: COLORS.text.tertiary }}>
              Etymology
            </div>
            <div style={{ color: COLORS.text.secondary }}>{word.etymology}</div>
          </div>
        )}
      </div>
    </div>
  );
}
