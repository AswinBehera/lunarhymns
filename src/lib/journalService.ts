/**
 * Journal Service
 *
 * Manages journal entries with localStorage persistence.
 */

import type { JournalEntry, JournalStats, JournalFilter, JournalDraft, JournalDayEntry } from '../types/journal';

const STORAGE_KEY = 'vedic-journal-entries';
const DRAFT_KEY = 'vedic-journal-draft';

/**
 * Get all journal entries from localStorage
 */
export function getAllEntries(): JournalEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const entries = JSON.parse(stored);
    // Parse dates
    return entries.map((e: any) => ({
      ...e,
      date: new Date(e.date),
      editedAt: e.editedAt ? new Date(e.editedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
}

/**
 * Save all entries to localStorage
 */
function saveEntries(entries: JournalEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
}

/**
 * Get entry by ID
 */
export function getEntry(id: string): JournalEntry | null {
  const entries = getAllEntries();
  return entries.find((e) => e.id === id) || null;
}

/**
 * Get entry for a specific date
 */
export function getEntryByDate(date: Date): JournalEntry | null {
  const entries = getAllEntries();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return (
    entries.find((e) => {
      const entryDate = new Date(e.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    }) || null
  );
}

/**
 * Create a new journal entry
 */
export function createEntry(entry: Omit<JournalEntry, 'id' | 'wordCount'>): JournalEntry {
  const newEntry: JournalEntry = {
    ...entry,
    id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    wordCount: entry.content.trim().split(/\s+/).length,
    date: new Date(entry.date),
  };

  const entries = getAllEntries();
  entries.push(newEntry);
  saveEntries(entries);

  return newEntry;
}

/**
 * Update an existing entry
 */
export function updateEntry(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
  const entries = getAllEntries();
  const index = entries.findIndex((e) => e.id === id);

  if (index === -1) return null;

  const updated: JournalEntry = {
    ...entries[index],
    ...updates,
    editedAt: new Date(),
    wordCount: updates.content
      ? updates.content.trim().split(/\s+/).length
      : entries[index].wordCount,
  };

  entries[index] = updated;
  saveEntries(entries);

  return updated;
}

/**
 * Delete an entry
 */
export function deleteEntry(id: string): boolean {
  const entries = getAllEntries();
  const filtered = entries.filter((e) => e.id !== id);

  if (filtered.length === entries.length) return false;

  saveEntries(filtered);
  return true;
}

/**
 * Filter entries based on criteria
 */
export function filterEntries(filter: JournalFilter): JournalEntry[] {
  let entries = getAllEntries();

  // Date range
  if (filter.dateRange) {
    const start = new Date(filter.dateRange.start);
    const end = new Date(filter.dateRange.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    entries = entries.filter((e) => {
      const date = new Date(e.date);
      return date >= start && date <= end;
    });
  }

  // Hymn filter
  if (filter.hymn) {
    entries = entries.filter((e) => e.hymnStudied === filter.hymn);
  }

  // Mandala filter
  if (filter.mandala !== undefined) {
    entries = entries.filter((e) => {
      if (!e.hymnStudied) return false;
      const match = e.hymnStudied.match(/rv-(\d+)-/);
      return match && parseInt(match[1]) === filter.mandala;
    });
  }

  // Tags filter
  if (filter.tags && filter.tags.length > 0) {
    entries = entries.filter((e) => filter.tags!.some((tag) => e.tags.includes(tag)));
  }

  // Mood filter
  if (filter.mood) {
    entries = entries.filter((e) => e.mood === filter.mood);
  }

  // Clarity rating
  if (filter.minClarity !== undefined) {
    entries = entries.filter((e) => e.clarityRating && e.clarityRating >= filter.minClarity!);
  }

  // Connection rating
  if (filter.minConnection !== undefined) {
    entries = entries.filter((e) => e.connectionRating && e.connectionRating >= filter.minConnection!);
  }

  // Text search
  if (filter.searchText) {
    const search = filter.searchText.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.content.toLowerCase().includes(search) ||
        e.insights.some((i) => i.toLowerCase().includes(search)) ||
        e.questions.some((q) => q.toLowerCase().includes(search)) ||
        e.applications.some((a) => a.toLowerCase().includes(search))
    );
  }

  // Favorites only
  if (filter.favoritesOnly) {
    entries = entries.filter((e) => e.favorite);
  }

  // Drafts
  if (filter.showDrafts !== undefined) {
    entries = entries.filter((e) => e.isDraft === filter.showDrafts);
  }

  // Sort by date (most recent first)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get journal statistics
 */
export function getJournalStats(): JournalStats {
  const entries = getAllEntries().filter((e) => !e.isDraft);

  // Calculate streak
  const sortedDates = entries
    .map((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .sort((a, b) => b - a); // Most recent first

  const uniqueDates = [...new Set(sortedDates)];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Calculate current streak
  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = todayTime - i * oneDayMs;
    if (uniqueDates[i] === expectedDate) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0 || uniqueDates[i] === uniqueDates[i - 1] - oneDayMs) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Count hymns studied
  const hymnsStudied = new Set(entries.filter((e) => e.hymnStudied).map((e) => e.hymnStudied)).size;

  // Total words
  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);

  // Average ratings
  const clarityEntries = entries.filter((e) => e.clarityRating !== undefined);
  const connectionEntries = entries.filter((e) => e.connectionRating !== undefined);

  const averageClarity =
    clarityEntries.length > 0
      ? clarityEntries.reduce((sum, e) => sum + (e.clarityRating || 0), 0) / clarityEntries.length
      : 0;

  const averageConnection =
    connectionEntries.length > 0
      ? connectionEntries.reduce((sum, e) => sum + (e.connectionRating || 0), 0) / connectionEntries.length
      : 0;

  // Top tags
  const tagCounts: { [tag: string]: number } = {};
  entries.forEach((e) => {
    e.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Entries by month
  const entriesByMonth: { [month: string]: number } = {};
  entries.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    entriesByMonth[key] = (entriesByMonth[key] || 0) + 1;
  });

  return {
    totalEntries: entries.length,
    hymnsStudied,
    currentStreak,
    longestStreak,
    totalWords,
    averageClarity,
    averageConnection,
    topTags,
    entriesByMonth,
  };
}

/**
 * Get calendar data for a month
 */
export function getCalendarMonth(year: number, month: number): JournalDayEntry[] {
  //const entries = getAllEntries();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: JournalDayEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const entry = getEntryByDate(date);

    days.push({
      date,
      tithi: '', // Will be filled by the component using panchang data
      hasEntry: !!entry,
      hasHymnStudy: !!(entry && entry.hymnStudied),
      entryId: entry?.id,
      entryType: entry
        ? entry.hymnStudied
          ? 'both'
          : 'journal-only'
        : 'none',
    });
  }

  return days;
}

/**
 * Save draft to localStorage
 */
export function saveDraft(draft: JournalDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: new Date() }));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

/**
 * Get saved draft
 */
export function getDraft(): JournalDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    const draft = JSON.parse(stored);
    return {
      ...draft,
      savedAt: new Date(draft.savedAt),
    };
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

/**
 * Clear draft
 */
export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

/**
 * Export entries to markdown
 */
export function exportToMarkdown(entries: JournalEntry[]): string {
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let markdown = '# Vedic Study Journal\n\n';
  markdown += `Exported: ${new Date().toLocaleDateString()}\n\n`;
  markdown += `Total Entries: ${sorted.length}\n\n`;
  markdown += '---\n\n';

  sorted.forEach((entry) => {
    const date = new Date(entry.date);
    markdown += `## ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    markdown += `**Tithi:** ${entry.tithi} | **Nakshatra:** ${entry.nakshatra}\n\n`;

    if (entry.hymnStudied) {
      markdown += `**Hymn Studied:** ${entry.hymnStudied}\n`;
      if (entry.verses && entry.verses.length > 0) {
        markdown += `**Verses:** ${entry.verses.join(', ')}\n`;
      }
      markdown += '\n';
    }

    if (entry.mood) {
      markdown += `**Mood:** ${entry.mood}\n`;
    }

    if (entry.clarityRating) {
      markdown += `**Clarity:** ${'★'.repeat(entry.clarityRating)}${'☆'.repeat(5 - entry.clarityRating)}\n`;
    }

    if (entry.connectionRating) {
      markdown += `**Connection:** ${'★'.repeat(entry.connectionRating)}${'☆'.repeat(5 - entry.connectionRating)}\n`;
    }

    markdown += '\n';

    // Main content
    markdown += `${entry.content}\n\n`;

    // Insights
    if (entry.insights.length > 0) {
      markdown += '### Key Insights\n\n';
      entry.insights.forEach((insight) => {
        markdown += `- ${insight}\n`;
      });
      markdown += '\n';
    }

    // Questions
    if (entry.questions.length > 0) {
      markdown += '### Questions\n\n';
      entry.questions.forEach((question) => {
        markdown += `- ${question}\n`;
      });
      markdown += '\n';
    }

    // Applications
    if (entry.applications.length > 0) {
      markdown += '### Practical Applications\n\n';
      entry.applications.forEach((app) => {
        markdown += `- ${app}\n`;
      });
      markdown += '\n';
    }

    // Tags
    if (entry.tags.length > 0) {
      markdown += `**Tags:** ${entry.tags.join(', ')}\n\n`;
    }

    markdown += '---\n\n';
  });

  return markdown;
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const entries = getAllEntries();
  const tags = new Set<string>();
  entries.forEach((e) => e.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
