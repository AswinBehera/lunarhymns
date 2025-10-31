/**
 * StoryCard Component
 *
 * Displays a beautiful card with a Rigvedic hymn - the daily story.
 * Shows Sanskrit text, transliteration, translation, and context.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RigvedaStory } from '../../lib/storySelector';

interface StoryCardProps {
  story: RigvedaStory;
  nakshatraName?: string;
}

/**
 * Story card displaying a Rigvedic hymn
 */
export function StoryCard({ story, nakshatraName }: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div
        className="bg-slate-900/80 backdrop-blur-md rounded-xl border shadow-2xl overflow-hidden"
        style={{
          borderColor: `${goldColor}40`,
          boxShadow: `0 0 30px ${goldColor}20`,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: `${goldColor}30`,
            background: `linear-gradient(to bottom, ${goldColor}10, transparent)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: dimGoldColor }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Daily Hymn
                  {nakshatraName && ` • ${nakshatraName}`}
                </motion.div>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{
                  color: lightGoldColor,
                  textShadow: `0 0 20px ${goldColor}30`,
                }}
              >
                {story.title}
              </h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: dimGoldColor }}>
                <span>Mandala {story.mandala}</span>
                <span>•</span>
                <span>Sukta {story.sukta}</span>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: `${goldColor}20`,
                border: `1px solid ${goldColor}40`,
              }}
            >
              <motion.svg
                className="w-5 h-5"
                style={{ color: goldColor }}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Sanskrit Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: dimGoldColor }}
            >
              Sanskrit
            </div>
            <p
              className="text-xl md:text-2xl leading-relaxed"
              style={{
                color: lightGoldColor,
                fontFamily: '"Noto Sans Devanagari", serif',
                textShadow: `0 0 10px ${goldColor}20`,
              }}
            >
              {story.sanskrit}
            </p>
          </motion.div>

          {/* Transliteration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: dimGoldColor }}
            >
              Transliteration
            </div>
            <p
              className="text-base md:text-lg italic leading-relaxed opacity-80"
              style={{ color: lightGoldColor }}
            >
              {story.transliteration}
            </p>
          </motion.div>

          {/* Translation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-4 border-t"
            style={{ borderColor: `${goldColor}20` }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: dimGoldColor }}
            >
              Translation
            </div>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: lightGoldColor }}
            >
              {story.translation}
            </p>
          </motion.div>

          {/* Expandable Context */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="pt-4 border-t space-y-4"
                  style={{ borderColor: `${goldColor}20` }}
                >
                  {/* Context */}
                  <div>
                    <div
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{ color: dimGoldColor }}
                    >
                      Context & Meaning
                    </div>
                    <p
                      className="text-sm md:text-base leading-relaxed opacity-90"
                      style={{ color: lightGoldColor }}
                    >
                      {story.context}
                    </p>
                  </div>

                  {/* Themes */}
                  <div>
                    <div
                      className="text-xs uppercase tracking-wider mb-3"
                      style={{ color: dimGoldColor }}
                    >
                      Themes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.themes.map((theme, index) => (
                        <motion.span
                          key={theme}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${goldColor}15`,
                            border: `1px solid ${goldColor}40`,
                            color: lightGoldColor,
                          }}
                        >
                          {theme}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Read More Hint */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center pt-2"
            >
              <button
                onClick={() => setIsExpanded(true)}
                className="text-sm transition-colors"
                style={{ color: dimGoldColor }}
              >
                Click to read context and themes →
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          className="px-6 py-3 border-t text-center text-xs"
          style={{
            borderColor: `${goldColor}30`,
            color: dimGoldColor,
            background: `linear-gradient(to top, ${goldColor}10, transparent)`,
          }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          From the Rigveda, humanity's oldest sacred text
        </motion.div>
      </div>
    </motion.div>
  );
}
