/**
 * BottomPanel Component
 *
 * Displays daily Rigveda hymn in a collapsible bottom panel.
 * Features:
 * - Integrates existing StoryCard component
 * - Contextual hymn selection based on nakshatra, tithi, and special occasions
 * - Collapsed state shows hymn title
 * - Expanded state shows full hymn with context
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollapsiblePanel } from './CollapsiblePanel';
import type { RigvedaStory } from '../../lib/storySelector';

interface BottomPanelProps {
  /** Daily story/hymn */
  story: RigvedaStory;
  /** Nakshatra name for display */
  nakshatraName?: string;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when hymn is marked as read */
  onHymnRead?: (storyId: number) => void;
}

/**
 * Bottom panel for displaying daily Rigveda hymns
 */
export function BottomPanel({ story, nakshatraName, defaultOpen = false, onHymnRead }: BottomPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRead, setIsRead] = useState(false);

  /**
   * Handle marking hymn as read
   */
  const handleMarkAsRead = () => {
    setIsRead(!isRead);
    if (!isRead && onHymnRead) {
      onHymnRead(story.id);
    }
  };

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';
  const cyanColor = '#87CEEB';

  /**
   * Handle for the collapsed state
   */
  const handleContent = (
    <div className="w-full flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Chevron icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: goldColor }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>

        {/* Title */}
        <div>
          <span className="text-sm" style={{ color: dimGoldColor, opacity: 0.7 }}>
            Daily Hymn{nakshatraName && ` • ${nakshatraName}`}:{' '}
          </span>
          <span className="text-sm font-medium" style={{ color: lightGoldColor }}>
            {story.title}
          </span>
          <span className="ml-3 text-xs" style={{ color: dimGoldColor, opacity: 0.5 }}>
            Mandala {story.mandala}, Sukta {story.sukta}
          </span>
        </div>
      </div>

      {/* Pull up hint */}
      <div className="text-xs" style={{ color: dimGoldColor, opacity: 0.5 }}>
        Pull up or click to read
      </div>
    </div>
  );

  /**
   * Handle share functionality
   */
  const handleShare = async () => {
    const text = `${story.title}\n\n${story.sanskrit}\n\n${story.transliteration}\n\n${story.translation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: text,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert('Hymn copied to clipboard!');
    }
  };

  return (
    <CollapsiblePanel
      position="bottom"
      defaultOpen={defaultOpen}
      collapsedSize={40}
      expandedSize="50vh"
      handleContent={handleContent}
      storageKey="vedic-clock-bottom-panel"
      zIndex={25}
    >
      {/* Header */}
      <div className="mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
          style={{ color: lightGoldColor }}
        >
          {story.title}
        </motion.h2>

        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: dimGoldColor }}>
          <span>Rigveda Mandala {story.mandala}</span>
          <span>•</span>
          <span>Sukta {story.sukta}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Sanskrit Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: dimGoldColor }}
          >
            Sanskrit
          </h3>
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
          transition={{ delay: 0.2 }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: dimGoldColor }}
          >
            Transliteration
          </h3>
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
          transition={{ delay: 0.3 }}
          className="pt-4 border-t"
          style={{ borderColor: `${goldColor}20` }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: dimGoldColor }}
          >
            Translation
          </h3>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: lightGoldColor }}
          >
            {story.translation}
          </p>
        </motion.div>

        {/* Expandable Context & Themes */}
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
                  <h3
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: dimGoldColor }}
                  >
                    Context & Meaning
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed opacity-90"
                    style={{ color: lightGoldColor }}
                  >
                    {story.context}
                  </p>
                </div>

                {/* Themes */}
                <div>
                  <h3
                    className="text-xs uppercase tracking-wider mb-3"
                    style={{ color: dimGoldColor }}
                  >
                    Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {story.themes.map((theme, index) => (
                      <span
                        key={theme}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${goldColor}15`,
                          border: `1px solid ${goldColor}40`,
                          color: lightGoldColor,
                        }}
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand/Collapse hint */}
        {!isExpanded && (
          <div className="text-center pt-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm transition-colors"
              style={{ color: dimGoldColor }}
            >
              Click to read context and themes →
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t flex items-center justify-between"
        style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
      >
        <div className="flex gap-3">
          {/* Mark as Read */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAsRead}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: isRead ? 'rgba(74, 144, 226, 0.2)' : 'rgba(212, 175, 55, 0.2)',
              border: `1px solid ${isRead ? '#4A90E2' : goldColor}`,
              color: isRead ? '#4A90E2' : lightGoldColor,
            }}
          >
            {isRead ? '✓ Read' : 'Mark as Read'}
          </motion.button>

          {/* Share */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.2)',
              border: `1px solid ${cyanColor}`,
              color: cyanColor,
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </motion.button>
        </div>

        {/* Learn More Link */}
        <a
          href={`https://en.wikipedia.org/wiki/Rigveda`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
          style={{ color: goldColor, opacity: 0.7 }}
        >
          Learn more about the Rigveda →
        </a>
      </motion.div>
    </CollapsiblePanel>
  );
}
