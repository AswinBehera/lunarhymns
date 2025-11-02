/**
 * InteractiveVerse Component
 *
 * Provides an immersive Sanskrit learning experience with:
 * - Clickable Sanskrit words showing detailed analysis
 * - Popup with transliteration, root, grammar, meaning, etymology
 * - Learning mode with hidden translations and flashcards
 * - Progress tracking for learned words
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../../styles/colors';
import sanskritDictionary from '../../data/sanskritDictionary.json';

// Types
export interface SanskritWord {
  sanskrit: string;
  transliteration: string;
  root: string;
  dhatu: string;
  meaning: string;
  grammaticalForm: string;
  etymology: string;
  usageFrequency: number;
  contexts: string[];
  relatedWords: string[];
  semanticField: string;
  culturalNotes: string;
}

interface InteractiveVerseProps {
  /** Sanskrit text of the verse */
  sanskrit: string;
  /** Verse number */
  verseNumber: number;
  /** Transliteration (optional) */
  transliteration?: string;
  /** English translation (optional) */
  translation?: string;
  /** Show all word meanings by default */
  showAllMeanings?: boolean;
}

type LearningMode = 'normal' | 'test' | 'flashcard';

/**
 * Main InteractiveVerse component
 */
export function InteractiveVerse({
  sanskrit,
  verseNumber,
  transliteration,
  translation,
  showAllMeanings = false,
}: InteractiveVerseProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [learningMode, setLearningMode] = useState<LearningMode>('normal');
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

  // Load learned words from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sanskrit-learned-words');
    if (stored) {
      setLearnedWords(new Set(JSON.parse(stored)));
    }
  }, []);

  // Save learned words to localStorage
  const markWordAsLearned = (word: string) => {
    const updated = new Set(learnedWords);
    updated.add(word);
    setLearnedWords(updated);
    localStorage.setItem('sanskrit-learned-words', JSON.stringify([...updated]));
  };

  const unmarkWordAsLearned = (word: string) => {
    const updated = new Set(learnedWords);
    updated.delete(word);
    setLearnedWords(updated);
    localStorage.setItem('sanskrit-learned-words', JSON.stringify([...updated]));
  };

  // Parse Sanskrit text into individual words
  const words = sanskrit.split(/\s+/).filter((w) => w.length > 0);

  // Get word data from dictionary
  const getWordData = (word: string): SanskritWord | null => {
    const normalizedWord = word.replace(/[।॥]/g, '').trim();
    const found = sanskritDictionary.words.find((w) => w.sanskrit === normalizedWord);
    return found || null;
  };

  // Handle word click
  const handleWordClick = (word: string) => {
    const wordData = getWordData(word);
    if (wordData) {
      setSelectedWord(word === selectedWord ? null : word);
    }
  };

  // Get words for flashcard mode
  const flashcardWords = words
    .map((w) => getWordData(w))
    .filter((w): w is SanskritWord => w !== null);

  const currentFlashcard = flashcardWords[currentFlashcardIndex];

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setLearningMode('normal')}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              backgroundColor: learningMode === 'normal' ? COLORS.accent.gold : COLORS.background.panel,
              color: learningMode === 'normal' ? COLORS.background.primary : COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            📖 Normal
          </button>
          <button
            onClick={() => {
              setLearningMode('test');
              setShowTranslation(false);
            }}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              backgroundColor: learningMode === 'test' ? COLORS.accent.cyan : COLORS.background.panel,
              color: learningMode === 'test' ? COLORS.background.primary : COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            🎯 Test Yourself
          </button>
          <button
            onClick={() => {
              setLearningMode('flashcard');
              setCurrentFlashcardIndex(0);
              setShowFlashcardAnswer(false);
            }}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              backgroundColor: learningMode === 'flashcard' ? COLORS.accent.purple : COLORS.background.panel,
              color: learningMode === 'flashcard' ? COLORS.background.primary : COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            🃏 Flashcards
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
          Learned: {learnedWords.size} / {flashcardWords.length} words
        </div>
      </div>

      {/* Flashcard Mode */}
      {learningMode === 'flashcard' && currentFlashcard ? (
        <FlashcardView
          word={currentFlashcard}
          showAnswer={showFlashcardAnswer}
          onToggleAnswer={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
          onNext={() => {
            setCurrentFlashcardIndex((prev) => (prev + 1) % flashcardWords.length);
            setShowFlashcardAnswer(false);
          }}
          onPrevious={() => {
            setCurrentFlashcardIndex((prev) => (prev - 1 + flashcardWords.length) % flashcardWords.length);
            setShowFlashcardAnswer(false);
          }}
          currentIndex={currentFlashcardIndex}
          totalCards={flashcardWords.length}
          isLearned={learnedWords.has(currentFlashcard.sanskrit)}
          onToggleLearned={() => {
            if (learnedWords.has(currentFlashcard.sanskrit)) {
              unmarkWordAsLearned(currentFlashcard.sanskrit);
            } else {
              markWordAsLearned(currentFlashcard.sanskrit);
            }
          }}
        />
      ) : (
        <>
          {/* Sanskrit Text with Interactive Words */}
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: COLORS.background.elevated,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: `${COLORS.accent.gold}20`,
                  color: COLORS.accent.gold,
                }}
              >
                Verse {verseNumber}
              </span>
              {learningMode === 'test' && (
                <span className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  Click words to see meanings • Translation hidden
                </span>
              )}
            </div>

            {/* Interactive Sanskrit Words */}
            <div className="text-2xl leading-relaxed mb-4" style={{ fontFamily: '"Noto Sans Devanagari", serif' }}>
              {words.map((word, index) => {
                const wordData = getWordData(word);
                const isSelected = selectedWord === word;
                const isLearned = wordData && learnedWords.has(wordData.sanskrit);
                const hasData = !!wordData;

                return (
                  <span key={index}>
                    <motion.span
                      onClick={() => hasData && handleWordClick(word)}
                      className={hasData ? 'cursor-pointer' : ''}
                      style={{
                        color: isSelected
                          ? COLORS.accent.gold
                          : isLearned
                            ? COLORS.accent.cyan
                            : COLORS.text.primary,
                        textDecoration: hasData && !isSelected ? 'underline' : 'none',
                        textDecorationColor: hasData ? `${COLORS.accent.gold}40` : 'transparent',
                        textDecorationThickness: '2px',
                        textUnderlineOffset: '4px',
                        transition: 'all 0.2s',
                        padding: '0 2px',
                      }}
                      whileHover={
                        hasData
                          ? {
                              color: COLORS.accent.goldLight,
                              textDecorationColor: COLORS.accent.gold,
                              scale: 1.05,
                            }
                          : {}
                      }
                    >
                      {word}
                    </motion.span>
                    {index < words.length - 1 && ' '}
                  </span>
                );
              })}
            </div>

            {/* Transliteration */}
            {transliteration && (showAllMeanings || learningMode === 'normal') && (
              <p className="text-sm italic mb-3" style={{ color: COLORS.text.secondary }}>
                {transliteration}
              </p>
            )}

            {/* Translation - toggleable in test mode */}
            {translation && (
              <div className="pt-3 border-t" style={{ borderColor: COLORS.border.subtle }}>
                {learningMode === 'test' && !showTranslation ? (
                  <button
                    onClick={() => setShowTranslation(true)}
                    className="text-sm font-medium"
                    style={{ color: COLORS.accent.cyan }}
                  >
                    👁️ Reveal Translation
                  </button>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
                    {translation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Word Detail Popup */}
          <AnimatePresence>
            {selectedWord && getWordData(selectedWord) && (
              <WordDetailPopup
                word={getWordData(selectedWord)!}
                isLearned={learnedWords.has(getWordData(selectedWord)!.sanskrit)}
                onClose={() => setSelectedWord(null)}
                onToggleLearned={() => {
                  const wordData = getWordData(selectedWord)!;
                  if (learnedWords.has(wordData.sanskrit)) {
                    unmarkWordAsLearned(wordData.sanskrit);
                  } else {
                    markWordAsLearned(wordData.sanskrit);
                  }
                }}
              />
            )}
          </AnimatePresence>

          {/* Show All Meanings Toggle */}
          {!showAllMeanings && learningMode === 'normal' && (
            <div className="text-center">
              <button
                onClick={() => setSelectedWord(selectedWord ? null : words[0])}
                className="text-sm font-medium hover:underline"
                style={{ color: COLORS.accent.cyan }}
              >
                💡 Tip: Click any underlined word to see its detailed analysis
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Word Detail Popup - Shows comprehensive word information
 */
function WordDetailPopup({
  word,
  isLearned,
  onClose,
  onToggleLearned,
}: {
  word: SanskritWord;
  isLearned: boolean;
  onClose: () => void;
  onToggleLearned: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 rounded-lg border shadow-lg"
      style={{
        backgroundColor: COLORS.background.elevated,
        borderColor: COLORS.accent.gold,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-2xl font-serif" style={{ color: COLORS.accent.gold }}>
              {word.sanskrit}
            </h3>
            <span className="text-base italic" style={{ color: COLORS.text.secondary }}>
              {word.transliteration}
            </span>
          </div>
          <p className="text-base font-medium" style={{ color: COLORS.text.primary }}>
            {word.meaning}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xl font-bold hover:opacity-70 transition-opacity"
          style={{ color: COLORS.text.tertiary }}
        >
          ×
        </button>
      </div>

      {/* Grammar & Etymology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Root & Dhatu */}
        <div>
          <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.text.tertiary }}>
            Root (Dhātu)
          </h4>
          <div className="space-y-1">
            <p className="text-sm font-serif" style={{ color: COLORS.accent.cyan }}>
              {word.root}
            </p>
            <p className="text-xs" style={{ color: COLORS.text.secondary }}>
              {word.dhatu}
            </p>
          </div>
        </div>

        {/* Grammatical Form */}
        <div>
          <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.text.tertiary }}>
            Grammatical Form
          </h4>
          <p className="text-sm" style={{ color: COLORS.text.primary }}>
            {word.grammaticalForm}
          </p>
        </div>
      </div>

      {/* Etymology */}
      <div className="mb-4">
        <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.text.tertiary }}>
          Etymology
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
          {word.etymology}
        </p>
      </div>

      {/* Cultural Notes */}
      <div
        className="p-3 rounded-lg mb-4"
        style={{ backgroundColor: `${COLORS.accent.purple}10`, border: `1px solid ${COLORS.border.subtle}` }}
      >
        <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.accent.purple }}>
          📚 Cultural Context
        </h4>
        <p className="text-xs leading-relaxed" style={{ color: COLORS.text.secondary }}>
          {word.culturalNotes}
        </p>
      </div>

      {/* Usage Contexts */}
      {word.contexts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.text.tertiary }}>
            Usage in Rigveda
          </h4>
          <div className="space-y-1">
            {word.contexts.map((context, index) => (
              <p key={index} className="text-xs" style={{ color: COLORS.text.secondary }}>
                • {context}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Related Words */}
      {word.relatedWords.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.text.tertiary }}>
            Related Words
          </h4>
          <div className="flex flex-wrap gap-2">
            {word.relatedWords.map((related, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: `${COLORS.accent.cyan}20`,
                  color: COLORS.accent.cyan,
                }}
              >
                {related}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: COLORS.border.subtle }}>
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${COLORS.accent.gold}20`,
              color: COLORS.accent.gold,
            }}
          >
            {word.semanticField}
          </span>
          <span className="text-xs" style={{ color: COLORS.text.tertiary }}>
            Frequency: {word.usageFrequency}%
          </span>
        </div>
        <button
          onClick={onToggleLearned}
          className="px-3 py-1 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: isLearned ? COLORS.accent.cyan : COLORS.background.panel,
            color: isLearned ? COLORS.background.primary : COLORS.text.secondary,
            border: `1px solid ${isLearned ? COLORS.accent.cyan : COLORS.border.subtle}`,
          }}
        >
          {isLearned ? '✓ Learned' : '+ Mark as Learned'}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Flashcard View - Interactive flashcard mode for vocabulary learning
 */
function FlashcardView({
  word,
  showAnswer,
  onToggleAnswer,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  isLearned,
  onToggleLearned,
}: {
  word: SanskritWord;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  isLearned: boolean;
  onToggleLearned: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Flashcard Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
          Card {currentIndex + 1} of {totalCards}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: COLORS.background.panel,
              color: COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: COLORS.background.panel,
              color: COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        key={currentIndex}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        <div
          className="p-12 rounded-lg text-center cursor-pointer min-h-[300px] flex flex-col items-center justify-center"
          onClick={onToggleAnswer}
          style={{
            backgroundColor: COLORS.background.elevated,
            border: `2px solid ${COLORS.accent.gold}`,
            backfaceVisibility: 'hidden',
            transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {!showAnswer ? (
            // Front of card - Sanskrit word
            <>
              <div className="text-5xl font-serif mb-4" style={{ color: COLORS.accent.gold }}>
                {word.sanskrit}
              </div>
              <div className="text-base italic mb-6" style={{ color: COLORS.text.secondary }}>
                {word.transliteration}
              </div>
              <div className="text-sm" style={{ color: COLORS.text.tertiary }}>
                Click to reveal meaning →
              </div>
            </>
          ) : (
            // Back of card - Meaning and details
            <div style={{ transform: 'rotateY(180deg)' }}>
              <div className="text-2xl font-semibold mb-3" style={{ color: COLORS.accent.cyan }}>
                {word.meaning}
              </div>
              <div className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
                {word.grammaticalForm}
              </div>
              <div className="text-sm leading-relaxed mb-4" style={{ color: COLORS.text.primary }}>
                <strong>Root:</strong> {word.dhatu}
              </div>
              <div
                className="text-xs leading-relaxed px-4 py-2 rounded"
                style={{
                  backgroundColor: `${COLORS.accent.purple}10`,
                  color: COLORS.text.secondary,
                }}
              >
                {word.etymology}
              </div>
              <div className="mt-4 text-xs" style={{ color: COLORS.text.tertiary }}>
                Click to flip back
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Flashcard Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onToggleAnswer}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            backgroundColor: COLORS.background.panel,
            color: COLORS.text.primary,
            border: `1px solid ${COLORS.border.subtle}`,
          }}
        >
          {showAnswer ? '🔄 Flip Back' : '👁️ Show Answer'}
        </button>
        <button
          onClick={onToggleLearned}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            backgroundColor: isLearned ? COLORS.accent.cyan : COLORS.background.panel,
            color: isLearned ? COLORS.background.primary : COLORS.text.secondary,
            border: `1px solid ${isLearned ? COLORS.accent.cyan : COLORS.border.subtle}`,
          }}
        >
          {isLearned ? '✓ Learned' : 'Mark as Learned'}
        </button>
      </div>
    </div>
  );
}
