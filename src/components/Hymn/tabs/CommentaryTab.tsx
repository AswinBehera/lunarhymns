/**
 * Commentary Tab
 *
 * Displays traditional and modern commentaries from various scholars and traditions.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RigvedaHymn, Commentary } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';

interface CommentaryTabProps {
  hymn: RigvedaHymn;
}

export function CommentaryTab({ hymn }: CommentaryTabProps) {
  const [expandedCommentary, setExpandedCommentary] = useState<number | null>(0);

  const toggleCommentary = (index: number) => {
    setExpandedCommentary(expandedCommentary === index ? null : index);
  };

  // Group commentaries by tradition
  const commentariesByTradition: { [key: string]: Commentary[] } = {};
  hymn.commentaries.forEach((comm) => {
    if (!commentariesByTradition[comm.tradition]) {
      commentariesByTradition[comm.tradition] = [];
    }
    commentariesByTradition[comm.tradition].push(comm);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Commentaries
        </h2>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          {hymn.commentaries.length} commentary sources • Traditional and modern interpretations
        </p>
      </div>

      {hymn.commentaries.length === 0 ? (
        <div className="text-center py-12" style={{ color: COLORS.text.tertiary }}>
          <div className="text-4xl mb-4">📚</div>
          <p>No commentaries available yet for this hymn.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hymn.commentaries.map((commentary, index) => (
            <CommentaryCard
              key={index}
              commentary={commentary}
              isExpanded={expandedCommentary === index}
              onToggle={() => toggleCommentary(index)}
            />
          ))}
        </div>
      )}

      {/* Scholarly Notes */}
      {hymn.scholarlyNotes.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.accent.goldLight }}>
            Scholarly Notes
          </h3>
          {hymn.scholarlyNotes.map((note, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${COLORS.accent.purple}10`,
                borderColor: COLORS.border.subtle,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold" style={{ color: COLORS.accent.purple }}>
                  {note.topic}
                </h4>
                <span className="text-xs px-2 py-1 rounded" style={{
                  backgroundColor: `${COLORS.accent.cyan}20`,
                  color: COLORS.accent.cyan,
                }}>
                  Note
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.text.primary }}>
                {note.content}
              </p>
              {note.sources.length > 0 && (
                <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  <strong>Sources:</strong> {note.sources.join('; ')}
                </div>
              )}
              {note.relevance && (
                <div className="text-xs mt-2" style={{ color: COLORS.text.secondary }}>
                  <strong>Relevance:</strong> {note.relevance}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentaryCard({
  commentary,
  isExpanded,
  onToggle,
}: {
  commentary: Commentary;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getTraditionColor = (tradition: string) => {
    if (tradition.toLowerCase().includes('traditional')) return COLORS.accent.gold;
    if (tradition.toLowerCase().includes('modern')) return COLORS.accent.cyan;
    return COLORS.accent.purple;
  };

  return (
    <motion.div
      layout
      className="border rounded-lg overflow-hidden"
      style={{
        backgroundColor: COLORS.background.elevated,
        borderColor: isExpanded ? getTraditionColor(commentary.tradition) : COLORS.border.subtle,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold" style={{ color: COLORS.text.primary }}>
                {commentary.author}
              </h3>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getTraditionColor(commentary.tradition)}20`,
                  color: getTraditionColor(commentary.tradition),
                }}
              >
                {commentary.tradition}
              </span>
            </div>
            <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
              Focus: {commentary.focus}
            </div>
            {!isExpanded && (
              <p className="text-sm mt-2 line-clamp-2" style={{ color: COLORS.text.secondary }}>
                {commentary.text}
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: getTraditionColor(commentary.tradition) }}
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
            <div className="p-4">
              <p className="text-sm leading-relaxed" style={{ color: COLORS.text.primary }}>
                {commentary.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
