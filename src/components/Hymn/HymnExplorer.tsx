/**
 * HymnExplorer Component
 *
 * Multi-layered exploration interface for deep study of Rigvedic hymns.
 * Provides 8 different perspectives on each hymn through tabbed interface.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SimpleHymn } from '../../types/rigveda';
import { getExpandedHymn } from '../../data/expandedHymns';
import { COLORS } from '../../styles/colors';

import { OverviewTab } from './tabs/OverviewTab';
import { VersesTab } from './tabs/VersesTab';
import { CommentaryTab } from './tabs/CommentaryTab';
import { ContextTab } from './tabs/ContextTab';
import { SymbolismTab } from './tabs/SymbolismTab';
import { StudyTab } from './tabs/StudyTab';
import { RelatedTab } from './tabs/RelatedTab';
import { JournalTab } from './tabs/JournalTab';

export type TabType =
  | 'overview'
  | 'verses'
  | 'commentary'
  | 'context'
  | 'symbolism'
  | 'study'
  | 'related'
  | 'journal';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '📖' },
  { id: 'verses', label: 'Verses', icon: '📜' },
  { id: 'commentary', label: 'Commentary', icon: '💬' },
  { id: 'context', label: 'Context', icon: '🏛️' },
  { id: 'symbolism', label: 'Symbolism', icon: '🔮' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'related', label: 'Related', icon: '🔗' },
  { id: 'journal', label: 'Journal', icon: '✍️' },
];

interface HymnExplorerProps {
  /** Simple hymn data (always available) */
  simpleHymn: SimpleHymn;
  /** Nakshatra name for context */
  nakshatraName?: string;
  /** Callback when hymn is marked as read */
  onHymnRead?: (storyId: number) => void;
}

/**
 * Deep exploration interface for Rigvedic hymns
 */
export function HymnExplorer({ simpleHymn, nakshatraName, onHymnRead }: HymnExplorerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Try to get expanded hymn data
  const expandedHymnId = `rv-${simpleHymn.mandala}-${simpleHymn.sukta}`;
  const expandedHymn = getExpandedHymn(expandedHymnId);

  // Determine if we have expanded data
  const hasExpandedData = !!expandedHymn;

  const renderTabContent = () => {
    if (!hasExpandedData) {
      // Fallback to simple view for hymns without expanded data
      return (
        <div className="p-6">
          <OverviewTab simpleHymn={simpleHymn} nakshatraName={nakshatraName} onHymnRead={onHymnRead} />
        </div>
      );
    }

    // Render appropriate tab content
    switch (activeTab) {
      case 'overview':
        return <OverviewTab expandedHymn={expandedHymn} simpleHymn={simpleHymn} nakshatraName={nakshatraName} onHymnRead={onHymnRead} />;
      case 'verses':
        return <VersesTab hymn={expandedHymn} />;
      case 'commentary':
        return <CommentaryTab hymn={expandedHymn} />;
      case 'context':
        return <ContextTab hymn={expandedHymn} />;
      case 'symbolism':
        return <SymbolismTab hymn={expandedHymn} />;
      case 'study':
        return <StudyTab hymn={expandedHymn} />;
      case 'related':
        return <RelatedTab hymn={expandedHymn} />;
      case 'journal':
        return <JournalTab hymn={expandedHymn} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Navigation */}
      {hasExpandedData && (
        <div className="flex-shrink-0 border-b" style={{ borderColor: COLORS.border.subtle }}>
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all hover:bg-white/5"
                style={{
                  color: activeTab === tab.id ? COLORS.accent.gold : COLORS.text.secondary,
                  borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accent.gold}` : '2px solid transparent',
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Data availability indicator */}
      {!hasExpandedData && (
        <div
          className="flex-shrink-0 p-2 text-xs text-center border-t"
          style={{
            backgroundColor: `${COLORS.accent.gold}10`,
            borderColor: COLORS.border.subtle,
            color: COLORS.text.tertiary,
          }}
        >
          📚 Expanded scholarly content coming soon for this hymn
        </div>
      )}
    </div>
  );
}
