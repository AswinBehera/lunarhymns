/**
 * Data Types for Panel Components
 *
 * Defines types for tasks, reading history, and other panel data
 */

/**
 * Daily task structure
 */
export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string
  date: string; // YYYY-MM-DD format
  tithi?: number; // Associated tithi (1-30)
}

/**
 * Reading history entry
 */
export interface ReadingEntry {
  storyId: number; // ID of the story read
  date: string; // YYYY-MM-DD format
  timestamp: string; // ISO date string
  tithi: number; // Tithi when read
  nakshatra: number; // Nakshatra when read
}

/**
 * Tithi occurrence in a month
 */
export interface TithiOccurrence {
  tithiNumber: number; // 1-30
  tithiName: string;
  date: Date;
  wasRead: boolean; // Whether the hymn was read on this tithi
  storyId?: number; // Which story was shown
}

/**
 * Reading streak data
 */
export interface ReadingStreak {
  currentStreak: number; // Days in a row
  longestStreak: number; // Best streak ever
  lastReadDate: string; // YYYY-MM-DD format
  totalDaysRead: number; // Total unique days
}

/**
 * Task storage structure
 */
export interface TaskStorage {
  tasks: DailyTask[];
}

/**
 * Reading history storage structure
 */
export interface ReadingHistoryStorage {
  entries: ReadingEntry[];
  streak: ReadingStreak;
}
