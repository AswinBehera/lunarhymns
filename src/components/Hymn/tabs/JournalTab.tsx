/**
 * Journal Tab - Personal reflections and notes
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { RigvedaHymn } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';

interface JournalTabProps {
  hymn: RigvedaHymn;
}

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  tags: string[];
}

export function JournalTab({ hymn: _hymn }: JournalTabProps) {
  const [newEntry, setNewEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: newEntry,
        tags: [],
      };
      setEntries([entry, ...entries]);
      setNewEntry('');
      setIsAddingEntry(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Personal Journal
        </h2>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Your insights, questions, and reflections on this hymn
        </p>
      </div>

      {/* Add Entry Button/Form */}
      {!isAddingEntry ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingEntry(true)}
          className="w-full p-4 rounded-lg border-2 border-dashed transition-colors hover:border-gold-500"
          style={{
            borderColor: COLORS.border.subtle,
            color: COLORS.text.secondary,
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✍️</span>
            <span className="font-medium">Add New Reflection</span>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: COLORS.background.elevated,
            borderColor: COLORS.accent.gold,
          }}
        >
          <div className="space-y-3">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What insights or questions arise from studying this hymn? How might you apply this wisdom?"
              className="w-full p-3 rounded border resize-none outline-none min-h-[120px]"
              style={{
                backgroundColor: COLORS.background.panel,
                borderColor: COLORS.border.subtle,
                color: COLORS.text.primary,
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 rounded font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: COLORS.accent.gold,
                  color: COLORS.background.primary,
                }}
              >
                Save Entry
              </button>
              <button
                onClick={() => {
                  setIsAddingEntry(false);
                  setNewEntry('');
                }}
                className="px-4 py-2 rounded font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: COLORS.background.panel,
                  color: COLORS.text.secondary,
                  border: `1px solid ${COLORS.border.subtle}`,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Journal Entries */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.accent.goldLight }}>
            Your Reflections ({entries.length})
          </h3>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: COLORS.background.elevated,
                borderColor: COLORS.border.subtle,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  {formatDate(entry.date)}
                </div>
                <button
                  className="text-xs hover:underline"
                  style={{ color: COLORS.text.tertiary }}
                >
                  Delete
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: COLORS.text.primary }}>
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div
          className="p-8 rounded-lg border text-center"
          style={{
            backgroundColor: `${COLORS.accent.purple}10`,
            borderColor: COLORS.border.subtle,
          }}
        >
          <div className="text-4xl mb-3">📔</div>
          <h3 className="text-base font-semibold mb-2" style={{ color: COLORS.text.primary }}>
            Start Your Reflection Journal
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
            Document your insights, questions, and personal connections to this hymn.
          </p>
          <div className="text-xs space-y-2" style={{ color: COLORS.text.tertiary }}>
            <p>💡 What does this hymn mean to you personally?</p>
            <p>🤔 What questions does it raise?</p>
            <p>🎯 How can you apply its wisdom in daily life?</p>
          </div>
        </div>
      )}

      {/* Reflection Prompts */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: `${COLORS.accent.cyan}10`,
          borderColor: COLORS.border.subtle,
        }}
      >
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.accent.cyan }}>
          <span>💭</span> Reflection Prompts
        </h3>
        <div className="space-y-2 text-sm" style={{ color: COLORS.text.secondary }}>
          <p>• What emotions or images arise when you read this hymn?</p>
          <p>• How do the different levels of interpretation (literal, metaphorical, spiritual, psychological) speak to you?</p>
          <p>• What connections do you see to your own spiritual journey or life experiences?</p>
          <p>• Which translation resonates most with you, and why?</p>
          <p>• What practical applications feel most relevant right now?</p>
        </div>
      </div>
    </div>
  );
}
