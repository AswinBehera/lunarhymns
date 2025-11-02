/**
 * QuickJournalEntry Component
 *
 * Quick journal entry field in the right panel.
 * Features auto-save, word count, and expand to full editor.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../styles/colors';
import { createEntry, updateEntry, getEntryByDate, saveDraft, getDraft, clearDraft } from '../../lib/journalService';
import type { JournalEntry } from '../../types/journal';

interface QuickJournalEntryProps {
  /** Current tithi */
  tithi: string;
  /** Current nakshatra */
  nakshatra: string;
  /** Current hymn being studied (optional) */
  currentHymn?: string;
  /** Callback when expanding to full editor */
  onExpand?: (entry: JournalEntry | null) => void;
  /** Callback when entry saved */
  onSaved?: (entry: JournalEntry) => void;
}

export function QuickJournalEntry({
  tithi,
  nakshatra,
  currentHymn,
  onExpand,
  onSaved,
}: QuickJournalEntryProps) {
  const [content, setContent] = useState('');
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Load today's entry or draft on mount
  useEffect(() => {
    const today = new Date();
    const existing = getEntryByDate(today);

    if (existing) {
      setTodayEntry(existing);
      setContent(existing.content);
    } else {
      // Load draft
      const draft = getDraft();
      if (draft && !draft.entryId) {
        setContent(draft.content);
      }
    }
  }, []);

  // Update word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Auto-save draft
  useEffect(() => {
    if (!content.trim()) return;

    const timer = setTimeout(() => {
      if (!todayEntry) {
        // Save as draft
        saveDraft({
          content,
          insights: [],
          questions: [],
          applications: [],
          savedAt: new Date(),
        });
        setLastSaved(new Date());
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, todayEntry]);

  // Save entry
  const handleSave = useCallback(async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      let entry: JournalEntry;

      if (todayEntry) {
        // Update existing entry
        entry = updateEntry(todayEntry.id, { content })!;
      } else {
        // Create new entry
        entry = createEntry({
          date: new Date(),
          tithi,
          nakshatra,
          content,
          hymnStudied: currentHymn,
          insights: [],
          questions: [],
          applications: [],
          tags: [],
          favorite: false,
          isDraft: false,
        });
        clearDraft(); // Clear draft after creating entry
      }

      setTodayEntry(entry);
      setLastSaved(new Date());
      onSaved?.(entry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, tithi, nakshatra, currentHymn, todayEntry, onSaved]);

  // Handle expand to full editor
  const handleExpand = () => {
    // Save current content first
    if (content.trim() && !todayEntry) {
      handleSave();
    }
    onExpand?.(todayEntry);
  };

  const charCount = content.length;
  const hasContent = content.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: COLORS.accent.goldLight }}>
          Today's Journal
        </h3>
        {lastSaved && (
          <span className="text-xs" style={{ color: COLORS.text.tertiary }}>
            {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
          </span>
        )}
      </div>

      {/* Context Info */}
      <div
        className="p-2 rounded text-xs"
        style={{
          backgroundColor: `${COLORS.accent.purple}10`,
          border: `1px solid ${COLORS.border.subtle}`,
        }}
      >
        <div className="flex items-center gap-2" style={{ color: COLORS.text.secondary }}>
          <span>📅 {tithi}</span>
          <span>•</span>
          <span>⭐ {nakshatra}</span>
        </div>
        {currentHymn && (
          <div className="mt-1" style={{ color: COLORS.accent.cyan }}>
            📖 Studying: {currentHymn.toUpperCase()}
          </div>
        )}
      </div>

      {/* Quick Entry Text Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What insights or reflections arise today? Write your thoughts here..."
        className="w-full p-3 rounded border resize-none outline-none transition-colors"
        style={{
          backgroundColor: COLORS.background.panel,
          borderColor: hasContent ? COLORS.accent.gold : COLORS.border.subtle,
          color: COLORS.text.primary,
          minHeight: '100px',
          maxHeight: '200px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = COLORS.accent.gold;
        }}
        onBlur={(e) => {
          if (!hasContent) {
            e.target.style.borderColor = COLORS.border.subtle;
          }
        }}
      />

      {/* Stats & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs" style={{ color: COLORS.text.tertiary }}>
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>•</span>
          <span>{charCount} {charCount === 1 ? 'char' : 'chars'}</span>
        </div>

        <div className="flex gap-2">
          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!hasContent || isSaving}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              backgroundColor: hasContent && !isSaving ? COLORS.accent.gold : COLORS.background.panel,
              color: hasContent && !isSaving ? COLORS.background.primary : COLORS.text.disabled,
              border: `1px solid ${COLORS.border.subtle}`,
              opacity: hasContent && !isSaving ? 1 : 0.5,
              cursor: hasContent && !isSaving ? 'pointer' : 'not-allowed',
            }}
          >
            💾 Save
          </motion.button>

          {/* Expand Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExpand}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              backgroundColor: COLORS.background.panel,
              color: COLORS.text.secondary,
              border: `1px solid ${COLORS.border.subtle}`,
            }}
          >
            ↗️ Full Editor
          </motion.button>
        </div>
      </div>

      {/* Quick Tips */}
      {!hasContent && (
        <div
          className="p-2 rounded text-xs space-y-1"
          style={{
            backgroundColor: `${COLORS.accent.cyan}10`,
            border: `1px solid ${COLORS.border.subtle}`,
            color: COLORS.text.tertiary,
          }}
        >
          <p className="font-medium" style={{ color: COLORS.accent.cyan }}>
            💡 Quick Tips:
          </p>
          <p>• Your entry auto-saves as you type</p>
          <p>• Click "Full Editor" for insights, questions, and more</p>
          <p>• Entries are linked to today's tithi and hymn</p>
        </div>
      )}
    </div>
  );
}
