/**
 * RightPanel Component
 *
 * Displays calendar, tasks, and reading tracker in a collapsible right panel.
 * Features:
 * - Location display with sunrise/sunset
 * - Tithi calendar with reading status
 * - Daily tasks with persistence
 * - Reading tracker with streak counter
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollapsiblePanel } from './CollapsiblePanel';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { VedicTime } from '../../lib/vedic-calendar';
import type { DailyTask, ReadingEntry, ReadingStreak, TithiOccurrence } from '../../types/panelData';
import type { LocationState } from '../../hooks/useLocation';
import { searchLocations, type LocationData } from '../../data/locations';
import { TITHI_NAMES } from '../../lib/vedic-calendar';

interface RightPanelProps {
  /** Current Vedic time data */
  vedicTime: VedicTime | null;
  /** Location state from useLocation hook */
  locationState: LocationState;
  /** Current story ID being shown */
  currentStoryId: number;
  /** Callback when hymn is marked as read */
  onHymnRead?: (storyId: number) => void;
}

/**
 * Right panel for calendar and tasks
 */
export function RightPanel({
  vedicTime,
  locationState,
  currentStoryId,
  onHymnRead,
}: RightPanelProps) {
  const { location, loading, error, isManual, requestLocation, setManualLocation } = locationState;

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';

  // Collapsible section states
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(true);
  const [isTrackerExpanded, setIsTrackerExpanded] = useState(true);

  // Location input states
  const [tempLat, setTempLat] = useState(location.latitude.toString());
  const [tempLon, setTempLon] = useState(location.longitude.toString());
  const [inputError, setInputError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(searchLocations(''));

  // Tasks storage
  const [tasks, setTasks] = useLocalStorage<DailyTask[]>('vedic-clock-tasks', []);
  const [newTaskText, setNewTaskText] = useState('');

  // Reading history storage
  const [readingHistory, setReadingHistory] = useLocalStorage<ReadingEntry[]>('vedic-clock-reading-history', []);
  const [streak, setStreak] = useLocalStorage<ReadingStreak>('vedic-clock-reading-streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    totalDaysRead: 0,
  });

  // Get today's date string
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * Handle manual location submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const lat = parseFloat(tempLat);
    const lon = parseFloat(tempLon);

    if (isNaN(lat) || isNaN(lon)) {
      setInputError('Please enter valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90');
      return;
    }

    if (lon < -180 || lon > 180) {
      setInputError('Longitude must be between -180 and 180');
      return;
    }

    setManualLocation(lat, lon);
    setInputError(null);
  };

  /**
   * Handle geolocation request
   */
  const handleRequestLocation = () => {
    requestLocation();
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const results = searchLocations(query);
    setFilteredLocations(results);
  };

  /**
   * Handle location selection from search results
   */
  const handleSelectLocation = (loc: LocationData) => {
    setManualLocation(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`);
    setSearchQuery('');
  };

  /**
   * Calculate sunrise and sunset times
   */
  const getSunTimes = () => {
    // This is a simplified calculation - in production you'd use a library like suncalc
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 0, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(18, 30, 0, 0);

    return {
      sunrise: sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sunset: sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const sunTimes = getSunTimes();

  /**
   * Generate tithi occurrences for current month
   */
  const getTithiOccurrences = (): TithiOccurrence[] => {
    if (!vedicTime) return [];

    const occurrences: TithiOccurrence[] = [];
    const today = new Date();
    const currentTithi = vedicTime.tithi;

    // For simplicity, we'll show the current tithi cycle (30 tithis)
    // In reality, you'd calculate actual dates for each tithi
    for (let i = 1; i <= 30; i++) {
      const tithiName = TITHI_NAMES[i - 1] || `Tithi ${i}`;
      const wasRead = readingHistory.some(entry => entry.tithi === i && entry.date === getTodayString());

      occurrences.push({
        tithiNumber: i,
        tithiName,
        date: today,
        wasRead,
      });
    }

    return occurrences;
  };

  /**
   * Add a new task
   */
  const addTask = () => {
    if (!newTaskText.trim() || !vedicTime) return;

    const newTask: DailyTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      date: getTodayString(),
      tithi: vedicTime.tithi,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  /**
   * Toggle task completion
   */
  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
          }
        : task
    ));
  };

  /**
   * Delete a task
   */
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  /**
   * Get today's tasks
   */
  const getTodaysTasks = () => {
    const today = getTodayString();
    return tasks.filter(task => task.date === today);
  };

  /**
   * Handle for the collapsed state
   */
  const handleContent = (
    <div className="h-full flex items-center justify-center">
      <div
        className="text-sm font-medium tracking-wider"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: lightGoldColor,
        }}
      >
        Calendar & Tasks
      </div>
      <svg
        className="w-5 h-5 ml-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        style={{ color: goldColor, transform: 'rotate(-90deg)' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );

  const tithiOccurrences = getTithiOccurrences();
  const todaysTasks = getTodaysTasks();

  return (
    <CollapsiblePanel
      position="right"
      defaultOpen={false}
      collapsedSize={40}
      expandedSize={400}
      handleContent={handleContent}
      storageKey="vedic-clock-right-panel"
      zIndex={25}
    >
      <div className="space-y-6">
        {/* A. Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setIsLocationExpanded(!isLocationExpanded)}
            className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: goldColor }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="text-xs uppercase tracking-wider font-medium" style={{ color: goldColor }}>
                Location
              </h3>
            </div>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: goldColor }}
              animate={{ rotate: isLocationExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          {/* Current Location Display */}
          <div className="space-y-1 mb-3">
            <div className="text-sm font-medium" style={{ color: lightGoldColor }}>
              {location.name || 'Unknown Location'}
              {isManual && <span className="ml-2 text-xs opacity-60">(Manual)</span>}
            </div>
            <div className="text-xs opacity-70" style={{ color: lightGoldColor }}>
              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </div>
            <div className="flex justify-between text-xs pt-2">
              <div>
                <div className="opacity-60">Sunrise</div>
                <div>{sunTimes.sunrise}</div>
              </div>
              <div className="text-right">
                <div className="opacity-60">Sunset</div>
                <div>{sunTimes.sunset}</div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-3 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 text-xs"
              style={{ color: goldColor }}
            >
              Requesting location...
            </motion.div>
          )}

          <AnimatePresence>
            {isLocationExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-4"
              >
                {/* Request Geolocation Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestLocation}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: `${goldColor}20`,
                    border: `1px solid ${goldColor}`,
                    color: lightGoldColor,
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Use My Location
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ backgroundColor: `${goldColor}30` }} />
                  <span className="text-xs opacity-50" style={{ color: goldColor }}>
                    or
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: `${goldColor}30` }} />
                </div>

                {/* Manual Input Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: goldColor }}>
                    Enter Coordinates
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: lightGoldColor }}>
                      Latitude (-90 to 90)
                    </label>
                    <input
                      type="text"
                      value={tempLat}
                      onChange={(e) => setTempLat(e.target.value)}
                      placeholder="12.9716"
                      className="w-full px-3 py-2 rounded-md text-sm outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        border: `1px solid ${goldColor}40`,
                        color: lightGoldColor,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: lightGoldColor }}>
                      Longitude (-180 to 180)
                    </label>
                    <input
                      type="text"
                      value={tempLon}
                      onChange={(e) => setTempLon(e.target.value)}
                      placeholder="77.5946"
                      className="w-full px-3 py-2 rounded-md text-sm outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        border: `1px solid ${goldColor}40`,
                        color: lightGoldColor,
                      }}
                    />
                  </div>

                  {inputError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400"
                    >
                      {inputError}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      backgroundColor: goldColor,
                      color: '#0F172A',
                    }}
                  >
                    Set Location
                  </motion.button>
                </form>

                {/* Location Search */}
                <div className="pt-2 border-t" style={{ borderColor: `${goldColor}20` }}>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: goldColor }}>
                    Search Location
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search city or country..."
                    className="w-full px-3 py-2 rounded-md text-sm outline-none focus:ring-1 transition-all mb-2"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: `1px solid ${goldColor}40`,
                      color: lightGoldColor,
                    }}
                  />

                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredLocations.slice(0, 10).map((loc) => (
                      <motion.button
                        key={`${loc.name}-${loc.country}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectLocation(loc)}
                        className="w-full text-left px-3 py-2 rounded text-xs transition-all"
                        style={{
                          backgroundColor: `${goldColor}10`,
                          border: `1px solid ${goldColor}30`,
                          color: lightGoldColor,
                        }}
                      >
                        <div className="font-medium">
                          {loc.name}, {loc.country}
                        </div>
                        <div className="text-[10px] opacity-60 mt-0.5">
                          {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                        </div>
                      </motion.button>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="text-xs text-center py-4" style={{ color: goldColor, opacity: 0.5 }}>
                        No locations found
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${goldColor}20` }} />

        {/* B. Tithi Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm uppercase tracking-wider font-medium mb-4" style={{ color: goldColor }}>
            Masa Calendar
          </h3>

          {/* Grid layout for tithis */}
          <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-2">
            {tithiOccurrences.map((occurrence) => (
              <motion.div
                key={occurrence.tithiNumber}
                whileHover={{ scale: 1.05 }}
                className="aspect-square flex flex-col items-center justify-center rounded-md p-2 cursor-pointer transition-all relative"
                style={{
                  backgroundColor:
                    vedicTime?.tithi === occurrence.tithiNumber
                      ? `${goldColor}25`
                      : 'rgba(212, 175, 55, 0.08)',
                  border:
                    vedicTime?.tithi === occurrence.tithiNumber
                      ? `2px solid ${goldColor}`
                      : `1px solid ${goldColor}20`,
                }}
              >
                {/* Tithi number */}
                <div
                  className="text-base font-bold mb-1"
                  style={{
                    color: vedicTime?.tithi === occurrence.tithiNumber ? goldColor : lightGoldColor,
                  }}
                >
                  {occurrence.tithiNumber}
                </div>

                {/* Read status checkmark */}
                {occurrence.wasRead && (
                  <div className="absolute top-1 right-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#4A90E2' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Today indicator */}
                {vedicTime?.tithi === occurrence.tithiNumber && (
                  <div
                    className="text-[8px] uppercase tracking-wider font-medium"
                    style={{ color: goldColor }}
                  >
                    Today
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: dimGoldColor }}>
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded border-2"
                style={{ borderColor: goldColor, backgroundColor: `${goldColor}25` }}
              />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: '#4A90E2' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span>Read</span>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${goldColor}20` }} />

        {/* C. Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setIsTasksExpanded(!isTasksExpanded)}
            className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
          >
            <h3 className="text-sm uppercase tracking-wider font-medium" style={{ color: goldColor }}>
              Daily Tasks
            </h3>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: dimGoldColor }}
              animate={{ rotate: isTasksExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {isTasksExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Add task input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="What did I learn today?"
                      className="flex-1 px-3 py-2 rounded-md text-sm"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        border: `1px solid ${goldColor}40`,
                        color: lightGoldColor,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={addTask}
                      className="px-3 py-2 rounded-md text-sm transition-colors"
                      style={{
                        backgroundColor: `${goldColor}20`,
                        border: `1px solid ${goldColor}60`,
                        color: goldColor,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Task list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todaysTasks.length === 0 ? (
                      <div className="text-xs text-center py-4 opacity-50" style={{ color: dimGoldColor }}>
                        No tasks for today
                      </div>
                    ) : (
                      todaysTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 p-2 rounded-md group"
                          style={{
                            backgroundColor: task.completed ? 'rgba(74, 144, 226, 0.1)' : 'rgba(212, 175, 55, 0.05)',
                            border: `1px solid ${task.completed ? '#4A90E2' : goldColor}20`,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1"
                            style={{ accentColor: goldColor }}
                          />
                          <div className="flex-1">
                            <div
                              className={`text-sm ${task.completed ? 'line-through opacity-60' : ''}`}
                              style={{ color: lightGoldColor }}
                            >
                              {task.text}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            style={{ color: '#ef4444' }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${goldColor}20` }} />

        {/* D. Reading Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setIsTrackerExpanded(!isTrackerExpanded)}
            className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
          >
            <h3 className="text-sm uppercase tracking-wider font-medium" style={{ color: goldColor }}>
              Reading Tracker
            </h3>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: dimGoldColor }}
              animate={{ rotate: isTrackerExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {isTrackerExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Streak stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-3 rounded-md text-center"
                      style={{
                        backgroundColor: `${goldColor}15`,
                        border: `1px solid ${goldColor}40`,
                      }}
                    >
                      <div className="text-2xl font-bold" style={{ color: goldColor }}>
                        {streak.currentStreak}
                      </div>
                      <div className="text-xs opacity-70" style={{ color: dimGoldColor }}>
                        Current Streak
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-md text-center"
                      style={{
                        backgroundColor: `${goldColor}15`,
                        border: `1px solid ${goldColor}40`,
                      }}
                    >
                      <div className="text-2xl font-bold" style={{ color: goldColor }}>
                        {streak.totalDaysRead}
                      </div>
                      <div className="text-xs opacity-70" style={{ color: dimGoldColor }}>
                        Days Read
                      </div>
                    </div>
                  </div>

                  {/* Recent readings */}
                  <div>
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-70" style={{ color: dimGoldColor }}>
                      This Month
                    </div>
                    <div className="text-sm" style={{ color: lightGoldColor }}>
                      {readingHistory.length === 0 ? (
                        <div className="text-xs text-center py-3 opacity-50">No readings yet</div>
                      ) : (
                        <div className="text-xs">
                          {readingHistory.slice(0, 5).map((entry) => (
                            <div key={entry.timestamp} className="py-1 opacity-70">
                              Story {entry.storyId} • {new Date(entry.date).toLocaleDateString()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View history link */}
                  <button
                    className="text-xs w-full text-center py-2 hover:underline"
                    style={{ color: goldColor, opacity: 0.7 }}
                  >
                    View Reading History →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </CollapsiblePanel>
  );
}
