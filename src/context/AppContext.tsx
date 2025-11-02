/**
 * App Context
 *
 * Global application state management using React Context.
 * Provides centralized access to Vedic time, user data, and app settings.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useVedicTime } from '../hooks/useVedicTime';
import { useLocation } from '../hooks/useLocation';
import { getTodaysStory } from '../lib/storySelector';
import {
  TasksService,
  ReadingService,
  PreferencesService,
} from '../services/storageService';
import type {
  AppContextType,
  VedicTime,
  LocationData,
  UserPreferences,
  DailyTask,
  ReadingEntry,
  ReadingStreak,
  RigvedaStory,
} from '../types';

/**
 * App Context
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Context Provider Props
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * App Context Provider
 */
export function AppProvider({ children }: AppProviderProps) {
  // Location state
  const locationState = useLocation();

  // Vedic time state (updates every 4 seconds)
  const {
    vedicTime: calculatedVedicTime,
    isLoading: timeLoading,
    error: timeError,
  } = useVedicTime({
    latitude: locationState.location.latitude,
    longitude: locationState.location.longitude,
    updateInterval: 4000, // Every prana
    autoUpdate: true,
  });

  // User preferences
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    return PreferencesService.getPreferences();
  });

  // Tasks
  const [tasks, setTasksState] = useState<DailyTask[]>(() => {
    return TasksService.getTasks();
  });

  // Reading history
  const [readingHistory, setReadingHistoryState] = useState<ReadingEntry[]>(() => {
    return ReadingService.getHistory();
  });

  // Reading streak
  const [streak, setStreakState] = useState<ReadingStreak>(() => {
    return ReadingService.getStreak();
  });

  // Current story/hymn
  const [currentStory, setCurrentStoryState] = useState<RigvedaStory | null>(null);

  /**
   * Update current story when Vedic time changes
   */
  useEffect(() => {
    if (calculatedVedicTime) {
      const story = getTodaysStory(
        calculatedVedicTime.nakshatra,
        calculatedVedicTime.tithi,
        calculatedVedicTime.paksha
      );
      setCurrentStoryState(story);
    }
  }, [calculatedVedicTime?.nakshatra, calculatedVedicTime?.tithi, calculatedVedicTime?.paksha]);

  /**
   * Set Vedic time (normally updated by useVedicTime hook)
   */
  const setVedicTime = useCallback((_time: VedicTime) => {
    // This is handled by useVedicTime hook, but kept for API consistency
    console.warn('setVedicTime called - Vedic time is managed by useVedicTime hook');
  }, []);

  /**
   * Set location
   */
  const setLocation = useCallback(
    (location: LocationData) => {
      locationState.setManualLocation(
        location.latitude,
        location.longitude,
        location.name
      );
    },
    [locationState]
  );

  /**
   * Update preferences
   */
  const setPreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...updates };
      PreferencesService.savePreferences(updated);
      return updated;
    });
  }, []);

  /**
   * Add a new task
   */
  const addTask = useCallback((task: DailyTask) => {
    setTasksState(prev => {
      const updated = [...prev, task];
      TasksService.saveTasks(updated);
      return updated;
    });
  }, []);

  /**
   * Update a task
   */
  const updateTask = useCallback((taskId: string, updates: Partial<DailyTask>) => {
    setTasksState(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, ...updates } : t));
      TasksService.saveTasks(updated);
      return updated;
    });
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback((taskId: string) => {
    setTasksState(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      TasksService.saveTasks(updated);
      return updated;
    });
  }, []);

  /**
   * Mark hymn as read
   */
  const markHymnRead = useCallback(
    (storyId: number, tithi: number, nakshatra: number) => {
      const today = new Date().toISOString().split('T')[0];

      // Add to reading history
      const newEntry: ReadingEntry = {
        storyId,
        date: today,
        timestamp: new Date().toISOString(),
        tithi,
        nakshatra,
      };

      setReadingHistoryState(prev => {
        const updated = [...prev, newEntry];
        ReadingService.saveHistory(updated);
        return updated;
      });

      // Update streak
      const updatedStreak = ReadingService.calculateStreak(today);
      setStreakState(updatedStreak);
    },
    []
  );

  /**
   * Set current story
   */
  const setCurrentStory = useCallback((story: RigvedaStory) => {
    setCurrentStoryState(story);
  }, []);

  // Combine state and actions
  const value: AppContextType = {
    // State
    vedicTime: calculatedVedicTime,
    location: locationState.location,
    isLoading: timeLoading,
    error: timeError,
    preferences,
    tasks,
    readingHistory,
    streak,
    currentStory,

    // Actions
    setVedicTime,
    setLocation,
    setPreferences,
    addTask,
    updateTask,
    deleteTask,
    markHymnRead,
    setCurrentStory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to use app context
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

/**
 * Hook to access Vedic time from context
 */
export function useVedicTimeContext() {
  const { vedicTime, isLoading, error } = useAppContext();
  return { vedicTime, isLoading, error };
}

/**
 * Hook to access location from context
 */
export function useLocationContext() {
  const { location, setLocation } = useAppContext();
  return { location, setLocation };
}

/**
 * Hook to access preferences from context
 */
export function usePreferencesContext() {
  const { preferences, setPreferences } = useAppContext();
  return { preferences, setPreferences };
}

/**
 * Hook to access tasks from context
 */
export function useTasksContext() {
  const { tasks, addTask, updateTask, deleteTask } = useAppContext();
  return { tasks, addTask, updateTask, deleteTask };
}

/**
 * Hook to access reading data from context
 */
export function useReadingContext() {
  const { readingHistory, streak, markHymnRead } = useAppContext();
  return { readingHistory, streak, markHymnRead };
}

/**
 * Hook to access current story from context
 */
export function useCurrentStoryContext() {
  const { currentStory, setCurrentStory } = useAppContext();
  return { currentStory, setCurrentStory };
}
