/**
 * Central Type Definitions
 *
 * All TypeScript interfaces and types for the Vedic Lunar Clock application.
 */

// Import types for internal use
import type {
  VedicTime,
  PranaData,
  MuhurtaData,
  Paksha,
} from '../lib/vedic-calendar';

import type {
  DailyTask,
  ReadingEntry,
  ReadingStreak,
  TithiOccurrence,
} from './panelData';

import type { RigvedaStory } from '../lib/storySelector';

// Re-export types
export type {
  VedicTime,
  PranaData,
  MuhurtaData,
  Paksha,
  DailyTask,
  ReadingEntry,
  ReadingStreak,
  TithiOccurrence,
  RigvedaStory,
};

/**
 * User location information
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Location state including loading status
 */
export interface LocationState {
  location: LocationData;
  loading: boolean;
  error: string | null;
  isManual: boolean;
  requestLocation: () => void;
  setManualLocation: (lat: number, lon: number, name?: string) => void;
}

/**
 * Panel configuration
 */
export interface PanelConfig {
  isOpen: boolean;
  position: 'left' | 'right' | 'bottom' | 'top';
  storageKey: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Auto-open panels on load */
  autoOpenPanels: boolean;

  /** Enable breathing guide animations */
  enableBreathingGuide: boolean;

  /** Enable sound effects for breathing */
  enableBreathingSound: boolean;

  /** Theme preference (for future use) */
  theme: 'dark' | 'light' | 'auto';

  /** Update interval in milliseconds */
  updateInterval: number;

  /** Show tutorial on first visit */
  showTutorial: boolean;
}

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  autoOpenPanels: false,
  enableBreathingGuide: true,
  enableBreathingSound: false,
  theme: 'dark',
  updateInterval: 4000, // Every prana (4 seconds)
  showTutorial: true,
};

/**
 * Application state
 */
export interface AppState {
  /** Current Vedic time data */
  vedicTime: VedicTime | null;

  /** User location */
  location: LocationData;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** User preferences */
  preferences: UserPreferences;

  /** Daily tasks */
  tasks: DailyTask[];

  /** Reading history */
  readingHistory: ReadingEntry[];

  /** Reading streak data */
  streak: ReadingStreak;

  /** Current story/hymn being displayed */
  currentStory: RigvedaStory | null;
}

/**
 * Actions for updating app state
 */
export interface AppActions {
  /** Update Vedic time */
  setVedicTime: (time: VedicTime) => void;

  /** Update location */
  setLocation: (location: LocationData) => void;

  /** Update preferences */
  setPreferences: (preferences: Partial<UserPreferences>) => void;

  /** Add a new task */
  addTask: (task: DailyTask) => void;

  /** Update a task */
  updateTask: (taskId: string, updates: Partial<DailyTask>) => void;

  /** Delete a task */
  deleteTask: (taskId: string) => void;

  /** Mark hymn as read */
  markHymnRead: (storyId: number, tithi: number, nakshatra: number) => void;

  /** Update current story */
  setCurrentStory: (story: RigvedaStory) => void;
}

/**
 * Combined app context type
 */
export interface AppContextType extends AppState, AppActions {}

/**
 * Panel states
 */
export interface PanelStates {
  left: boolean;
  right: boolean;
  bottom: boolean;
}

/**
 * Panel actions
 */
export interface PanelActions {
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleBottom: () => void;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  setBottomOpen: (open: boolean) => void;
}

/**
 * Combined panel context type
 */
export interface PanelContextType extends PanelStates, PanelActions {}
