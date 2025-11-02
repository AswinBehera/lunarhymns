# Vedic Lunar Clock - Architecture Documentation

## Overview

The Vedic Lunar Clock is built with a modular, extensible architecture using React, TypeScript, and modern state management patterns. This document describes the application structure and how to work with its various components.

## Table of Contents

1. [Project Structure](#project-structure)
2. [State Management](#state-management)
3. [Data Flow](#data-flow)
4. [Custom Hooks](#custom-hooks)
5. [Services](#services)
6. [Adding New Features](#adding-new-features)

## Project Structure

```
src/
├── components/          # React components
│   ├── Clock/          # Main clock and related components
│   ├── Layout/         # Layout components (TimeDetails, etc.)
│   ├── Meditation/     # Breathing/meditation components
│   └── Panels/         # Collapsible panels
├── context/            # React Context providers
│   └── AppContext.tsx  # Global app state
├── hooks/              # Custom React hooks
│   ├── useVedicTime.ts # Vedic time calculations
│   ├── usePanels.ts    # Panel state management
│   ├── useLocation.ts  # Geolocation
│   └── useLocalStorage.ts  # localStorage utilities
├── lib/                # Core libraries
│   └── vedic-calendar/ # Vedic calendar calculations
├── services/           # Business logic services
│   └── storageService.ts  # localStorage operations
├── types/              # TypeScript type definitions
│   ├── index.ts        # Central type exports
│   └── panelData.ts    # Panel-specific types
└── data/               # Static data (stories, locations, etc.)
```

## State Management

### Global State (AppContext)

The application uses React Context for global state management. All major state is centralized in `AppContext.tsx`:

```typescript
import { useAppContext } from './context/AppContext';

function MyComponent() {
  const {
    vedicTime,        // Current Vedic time data
    location,         // User location
    preferences,      // User preferences
    tasks,            // Daily tasks
    readingHistory,   // Reading history
    streak,           // Reading streak
    currentStory,     // Current hymn/story
    // ... actions
  } = useAppContext();
}
```

### Specialized Context Hooks

For convenience, specialized hooks are provided:

```typescript
// Get only Vedic time data
const { vedicTime, isLoading, error } = useVedicTimeContext();

// Get only location data
const { location, setLocation } = useLocationContext();

// Get only preferences
const { preferences, setPreferences } = usePreferencesContext();

// Get only tasks
const { tasks, addTask, updateTask, deleteTask } = useTasksContext();

// Get only reading data
const { readingHistory, streak, markHymnRead } = useReadingContext();

// Get only current story
const { currentStory, setCurrentStory } = useCurrentStoryContext();
```

## Data Flow

### 1. Vedic Time Updates

```
User Location
    ↓
useLocation Hook
    ↓
useVedicTime Hook (updates every 4 seconds)
    ↓
calculateVedicTime()
    ↓
AppContext (vedicTime state)
    ↓
Components (via useAppContext or useVedicTimeContext)
```

### 2. Task Management

```
User Action
    ↓
addTask/updateTask/deleteTask (from AppContext)
    ↓
TasksService (saves to localStorage)
    ↓
AppContext (tasks state updated)
    ↓
Components re-render with new tasks
```

### 3. Reading History

```
User marks hymn as read
    ↓
markHymnRead() (from AppContext)
    ↓
ReadingService (saves to localStorage)
    ↓
calculateStreak() (updates streak data)
    ↓
AppContext (readingHistory and streak updated)
    ↓
Components re-render
```

## Custom Hooks

### useVedicTime

Manages Vedic time calculations with automatic updates:

```typescript
const {
  vedicTime,      // Current Vedic time data
  isLoading,      // Loading state
  error,          // Error state
  refresh,        // Manually trigger update
  startUpdates,   // Start automatic updates
  stopUpdates,    // Stop automatic updates
} = useVedicTime({
  latitude: 12.9716,
  longitude: 77.5946,
  updateInterval: 4000,  // Update every 4 seconds (1 prana)
  autoUpdate: true,
});
```

**Specialized Hooks:**
- `usePrana()` - Get only prana data
- `useMuhurta()` - Get only muhurta data
- `useTithi()` - Get only tithi data
- `useNakshatra()` - Get only nakshatra data

### usePanels

Manages panel open/closed states with localStorage persistence:

```typescript
const {
  left,           // Left panel state (boolean)
  right,          // Right panel state (boolean)
  bottom,         // Bottom panel state (boolean)
  toggleLeft,     // Toggle left panel
  toggleRight,    // Toggle right panel
  toggleBottom,   // Toggle bottom panel
  setLeftOpen,    // Set left panel state directly
  setRightOpen,   // Set right panel state directly
  setBottomOpen,  // Set bottom panel state directly
  resetPanels,    // Reset all panels to default
} = usePanels();
```

**Single Panel Hook:**
```typescript
const { isOpen, toggle, setOpen } = usePanel('left');
```

### useLocation

Manages user location with geolocation support:

```typescript
const {
  location,           // Current location data
  loading,            // Loading state
  error,              // Error state
  isManual,           // Whether location was set manually
  requestLocation,    // Request browser geolocation
  setManualLocation,  // Set location manually
} = useLocation();
```

### useLocalStorage

Generic hook for localStorage persistence:

```typescript
const [value, setValue] = useLocalStorage<Type>('storage-key', defaultValue);
```

## Services

### TasksService

Manages task data persistence:

```typescript
import { TasksService } from './services/storageService';

// Get all tasks
const tasks = TasksService.getTasks();

// Add a task
TasksService.addTask(newTask);

// Update a task
TasksService.updateTask(taskId, { completed: true });

// Delete a task
TasksService.deleteTask(taskId);

// Get tasks for a specific date
const todaysTasks = TasksService.getTasksForDate('2025-01-15');
```

### ReadingService

Manages reading history and streak tracking:

```typescript
import { ReadingService } from './services/storageService';

// Get reading history
const history = ReadingService.getHistory();

// Add a reading entry
ReadingService.addReading({
  storyId: 1,
  date: '2025-01-15',
  timestamp: new Date().toISOString(),
  tithi: 15,
  nakshatra: 5,
});

// Get streak data
const streak = ReadingService.getStreak();

// Calculate and update streak
const updatedStreak = ReadingService.calculateStreak('2025-01-15');
```

### PreferencesService

Manages user preferences:

```typescript
import { PreferencesService } from './services/storageService';

// Get preferences
const prefs = PreferencesService.getPreferences();

// Update preferences
PreferencesService.updatePreferences({
  enableBreathingSound: true,
  updateInterval: 5000,
});

// Reset to defaults
PreferencesService.resetPreferences();
```

### LocationService

Manages location data:

```typescript
import { LocationService } from './services/storageService';

// Get saved location
const location = LocationService.getLocation();

// Save location
LocationService.saveLocation({
  latitude: 12.9716,
  longitude: 77.5946,
  name: 'Bengaluru, India',
});
```

### PanelService

Manages panel states:

```typescript
import { PanelService } from './services/storageService';

// Get all panel states
const states = PanelService.getPanelStates();

// Save individual panel states
PanelService.saveLeftPanel(true);
PanelService.saveRightPanel(false);
PanelService.saveBottomPanel(false);
```

## Adding New Features

### Adding a New Panel

1. **Create the panel component:**

```typescript
// src/components/Panels/MyNewPanel.tsx
import { CollapsiblePanel } from './CollapsiblePanel';

export function MyNewPanel() {
  return (
    <CollapsiblePanel
      position="right"
      defaultOpen={false}
      collapsedSize={40}
      expandedSize={400}
      storageKey="my-new-panel"
    >
      {/* Your content here */}
    </CollapsiblePanel>
  );
}
```

2. **Add it to the app:**

```typescript
// src/App.tsx
<MyNewPanel />
```

### Adding a New Data Type

1. **Define the type:**

```typescript
// src/types/index.ts
export interface MyNewDataType {
  id: string;
  data: string;
  timestamp: string;
}
```

2. **Add storage service:**

```typescript
// src/services/storageService.ts
export const MyDataService = {
  getData(): MyNewDataType[] {
    return getFromStorage<MyNewDataType[]>('my-data-key', []);
  },

  saveData(data: MyNewDataType[]): boolean {
    return saveToStorage('my-data-key', data);
  },
};
```

3. **Add to AppContext:**

```typescript
// src/context/AppContext.tsx
const [myData, setMyData] = useState<MyNewDataType[]>(() => {
  return MyDataService.getData();
});
```

### Adding a New Custom Hook

```typescript
// src/hooks/useMyFeature.ts
import { useState, useCallback } from 'react';

export function useMyFeature() {
  const [state, setState] = useState<MyType>(initialValue);

  const doSomething = useCallback(() => {
    // Implementation
  }, []);

  return { state, doSomething };
}
```

## Best Practices

1. **Use Context for Global State**: For data that needs to be accessed by many components
2. **Use Local State for UI**: For data that's only relevant to a single component
3. **Persist Important Data**: Use the storage services for data that should survive page reloads
4. **Type Everything**: Use TypeScript interfaces for all data structures
5. **Memoize Expensive Calculations**: Use `useMemo` and `useCallback` appropriately
6. **Error Handling**: Always handle errors in async operations
7. **Loading States**: Show loading indicators for async operations

## Performance Considerations

- **Vedic Time Updates**: Updates every 4 seconds (1 prana cycle)
- **Component Memoization**: Clock components use `React.memo()` to prevent unnecessary re-renders
- **LocalStorage**: All storage operations are synchronous but fast
- **Context Updates**: Only subscribe to the parts of context you need using specialized hooks

## Testing

To test the application:

```bash
# Run development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build
```

## Future Extensibility

The architecture is designed to be easily extensible:

- Add new Vedic time components (e.g., yoga, karana)
- Add more panel types (top panel, modal overlays)
- Add user authentication and cloud sync
- Add more visualization modes
- Add data export/import features
- Add plugins or themes system

---

For questions or contributions, please refer to the main README.md file.
