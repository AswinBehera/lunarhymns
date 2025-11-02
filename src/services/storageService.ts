/**
 * Storage Service
 *
 * Centralized service for managing localStorage operations.
 * Handles serialization, deserialization, and error handling.
 */

import type {
  DailyTask,
  ReadingEntry,
  ReadingStreak,
  UserPreferences,
  LocationData,
  PanelStates,
} from '../types';
import { DEFAULT_PREFERENCES } from '../types';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  TASKS: 'vedic-clock-tasks',
  READING_HISTORY: 'vedic-clock-reading-history',
  READING_STREAK: 'vedic-clock-reading-streak',
  PREFERENCES: 'vedic-clock-preferences',
  LOCATION: 'vedic-clock-location',
  PANEL_LEFT: 'vedic-clock-panel-left',
  PANEL_RIGHT: 'vedic-clock-panel-right',
  PANEL_BOTTOM: 'vedic-clock-panel-bottom',
} as const;

/**
 * Generic function to get data from localStorage
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Generic function to save data to localStorage
 */
function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Tasks Service
 */
export const TasksService = {
  /**
   * Get all tasks
   */
  getTasks(): DailyTask[] {
    return getFromStorage<DailyTask[]>(STORAGE_KEYS.TASKS, []);
  },

  /**
   * Save tasks
   */
  saveTasks(tasks: DailyTask[]): boolean {
    return saveToStorage(STORAGE_KEYS.TASKS, tasks);
  },

  /**
   * Add a new task
   */
  addTask(task: DailyTask): boolean {
    const tasks = this.getTasks();
    tasks.push(task);
    return this.saveTasks(tasks);
  },

  /**
   * Update a task
   */
  updateTask(taskId: string, updates: Partial<DailyTask>): boolean {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return false;

    tasks[index] = { ...tasks[index], ...updates };
    return this.saveTasks(tasks);
  },

  /**
   * Delete a task
   */
  deleteTask(taskId: string): boolean {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    return this.saveTasks(filtered);
  },

  /**
   * Get tasks for a specific date
   */
  getTasksForDate(date: string): DailyTask[] {
    const tasks = this.getTasks();
    return tasks.filter(t => t.date === date);
  },

  /**
   * Clear all tasks
   */
  clearTasks(): boolean {
    return removeFromStorage(STORAGE_KEYS.TASKS);
  },
};

/**
 * Reading History Service
 */
export const ReadingService = {
  /**
   * Get reading history
   */
  getHistory(): ReadingEntry[] {
    return getFromStorage<ReadingEntry[]>(STORAGE_KEYS.READING_HISTORY, []);
  },

  /**
   * Save reading history
   */
  saveHistory(history: ReadingEntry[]): boolean {
    return saveToStorage(STORAGE_KEYS.READING_HISTORY, history);
  },

  /**
   * Add a reading entry
   */
  addReading(entry: ReadingEntry): boolean {
    const history = this.getHistory();
    history.push(entry);
    return this.saveHistory(history);
  },

  /**
   * Get streak data
   */
  getStreak(): ReadingStreak {
    return getFromStorage<ReadingStreak>(STORAGE_KEYS.READING_STREAK, {
      currentStreak: 0,
      longestStreak: 0,
      lastReadDate: '',
      totalDaysRead: 0,
    });
  },

  /**
   * Update streak data
   */
  updateStreak(streak: ReadingStreak): boolean {
    return saveToStorage(STORAGE_KEYS.READING_STREAK, streak);
  },

  /**
   * Calculate and update streak based on new reading
   */
  calculateStreak(currentDate: string): ReadingStreak {
    const streak = this.getStreak();
    const today = currentDate;

    // Get yesterday's date
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newCurrentStreak = 1;

    if (streak.lastReadDate === yesterdayString) {
      // Continuing streak from yesterday
      newCurrentStreak = streak.currentStreak + 1;
    } else if (streak.lastReadDate === today) {
      // Already read today
      newCurrentStreak = streak.currentStreak;
    }

    const updatedStreak: ReadingStreak = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, streak.longestStreak),
      lastReadDate: today,
      totalDaysRead: streak.lastReadDate === today ? streak.totalDaysRead : streak.totalDaysRead + 1,
    };

    this.updateStreak(updatedStreak);
    return updatedStreak;
  },

  /**
   * Clear all reading data
   */
  clearReadingData(): boolean {
    removeFromStorage(STORAGE_KEYS.READING_HISTORY);
    return removeFromStorage(STORAGE_KEYS.READING_STREAK);
  },
};

/**
 * Preferences Service
 */
export const PreferencesService = {
  /**
   * Get user preferences
   */
  getPreferences(): UserPreferences {
    return getFromStorage<UserPreferences>(
      STORAGE_KEYS.PREFERENCES,
      DEFAULT_PREFERENCES
    );
  },

  /**
   * Save user preferences
   */
  savePreferences(preferences: UserPreferences): boolean {
    return saveToStorage(STORAGE_KEYS.PREFERENCES, preferences);
  },

  /**
   * Update specific preferences
   */
  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    return this.savePreferences(updated);
  },

  /**
   * Reset preferences to defaults
   */
  resetPreferences(): boolean {
    return this.savePreferences(DEFAULT_PREFERENCES);
  },
};

/**
 * Location Service
 */
export const LocationService = {
  /**
   * Get saved location
   */
  getLocation(): LocationData | null {
    const defaultLocation: LocationData = {
      latitude: 12.9716,
      longitude: 77.5946,
      name: 'Bengaluru, India',
    };

    return getFromStorage<LocationData | null>(
      STORAGE_KEYS.LOCATION,
      defaultLocation
    );
  },

  /**
   * Save location
   */
  saveLocation(location: LocationData): boolean {
    return saveToStorage(STORAGE_KEYS.LOCATION, location);
  },

  /**
   * Clear saved location
   */
  clearLocation(): boolean {
    return removeFromStorage(STORAGE_KEYS.LOCATION);
  },
};

/**
 * Panel State Service
 */
export const PanelService = {
  /**
   * Get panel states
   */
  getPanelStates(): PanelStates {
    return {
      left: getFromStorage<boolean>(STORAGE_KEYS.PANEL_LEFT, true),
      right: getFromStorage<boolean>(STORAGE_KEYS.PANEL_RIGHT, false),
      bottom: getFromStorage<boolean>(STORAGE_KEYS.PANEL_BOTTOM, false),
    };
  },

  /**
   * Save left panel state
   */
  saveLeftPanel(isOpen: boolean): boolean {
    return saveToStorage(STORAGE_KEYS.PANEL_LEFT, isOpen);
  },

  /**
   * Save right panel state
   */
  saveRightPanel(isOpen: boolean): boolean {
    return saveToStorage(STORAGE_KEYS.PANEL_RIGHT, isOpen);
  },

  /**
   * Save bottom panel state
   */
  saveBottomPanel(isOpen: boolean): boolean {
    return saveToStorage(STORAGE_KEYS.PANEL_BOTTOM, isOpen);
  },

  /**
   * Reset all panel states
   */
  resetPanelStates(): boolean {
    this.saveLeftPanel(true);
    this.saveRightPanel(false);
    this.saveBottomPanel(false);
    return true;
  },
};

/**
 * Clear all app data
 */
export function clearAllData(): boolean {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeFromStorage(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Export all data (for backup)
 */
export function exportAllData(): Record<string, unknown> {
  return {
    tasks: TasksService.getTasks(),
    readingHistory: ReadingService.getHistory(),
    streak: ReadingService.getStreak(),
    preferences: PreferencesService.getPreferences(),
    location: LocationService.getLocation(),
    panelStates: PanelService.getPanelStates(),
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Import all data (from backup)
 */
export function importAllData(data: Record<string, unknown>): boolean {
  try {
    if (data.tasks) TasksService.saveTasks(data.tasks as DailyTask[]);
    if (data.readingHistory) ReadingService.saveHistory(data.readingHistory as ReadingEntry[]);
    if (data.streak) ReadingService.updateStreak(data.streak as ReadingStreak);
    if (data.preferences) PreferencesService.savePreferences(data.preferences as UserPreferences);
    if (data.location) LocationService.saveLocation(data.location as LocationData);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
