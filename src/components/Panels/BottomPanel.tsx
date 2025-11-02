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

import { CollapsiblePanel } from './CollapsiblePanel';
import type { RigvedaStory } from '../../lib/storySelector';
import { HymnExplorer } from '../Hymn/HymnExplorer';
import type { SimpleHymn } from '../../types/rigveda';

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
  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';

  // Convert RigvedaStory to SimpleHymn format
  const simpleHymn: SimpleHymn = {
    id: story.id,
    mandala: story.mandala,
    sukta: story.sukta,
    title: story.title,
    content: story.sanskrit,
    translation: story.translation,
    theme: story.themes.join(', '),
  };

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

  return (
    <CollapsiblePanel
      position="bottom"
      defaultOpen={defaultOpen}
      collapsedSize={40}
      expandedSize="60vh"
      handleContent={handleContent}
      storageKey="vedic-clock-bottom-panel"
      zIndex={25}
    >
      {/* HymnExplorer with full tabbed interface */}
      <HymnExplorer simpleHymn={simpleHymn} nakshatraName={nakshatraName} onHymnRead={onHymnRead} />
    </CollapsiblePanel>
  );
}
