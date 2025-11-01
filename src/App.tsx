import './App.css'
import { useState, useEffect } from 'react'
import { VedicClock } from './components/Clock/VedicClock'
import { TimeDetails } from './components/Layout'
import { BottomPanel, RightPanel } from './components/Panels'
import { useLocation } from './hooks/useLocation'
import { useLocalStorage } from './hooks/useLocalStorage'
import { calculateVedicTime, type VedicTime } from './lib/vedic-calendar'
import { getTodaysStory } from './lib/storySelector'
import type { ReadingEntry, ReadingStreak } from './types/panelData'

function App() {
  // Use location hook to manage geographic location
  // Automatically requests browser geolocation or uses default (Bengaluru, India)
  const locationState = useLocation();
  const [todaysStory, setTodaysStory] = useState(getTodaysStory(1));
  const [nakshatraName, setNakshatraName] = useState('');
  const [vedicTime, setVedicTime] = useState<VedicTime | null>(null);

  // Reading history state
  const [readingHistory, setReadingHistory] = useLocalStorage<ReadingEntry[]>('vedic-clock-reading-history', []);
  const [streak, setStreak] = useLocalStorage<ReadingStreak>('vedic-clock-reading-streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    totalDaysRead: 0,
  });

  // Calculate Vedic time and update story
  const updateVedicTime = () => {
    try {
      const time = calculateVedicTime(
        locationState.location.latitude,
        locationState.location.longitude
      );
      setVedicTime(time);

      // Update story based on cosmic context (nakshatra, tithi, paksha)
      const story = getTodaysStory(time.nakshatra, time.tithi, time.paksha);
      setTodaysStory(story);
      setNakshatraName(time.nakshatraName.split('(')[0].trim());
    } catch (error) {
      console.error('Error calculating Vedic time:', error);
    }
  };

  /**
   * Handle when a hymn is marked as read
   */
  const handleHymnRead = (storyId: number) => {
    if (!vedicTime) return;

    const today = new Date().toISOString().split('T')[0];

    // Add to reading history
    const newEntry: ReadingEntry = {
      storyId,
      date: today,
      timestamp: new Date().toISOString(),
      tithi: vedicTime.tithi,
      nakshatra: vedicTime.nakshatra,
    };
    setReadingHistory([...readingHistory, newEntry]);

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newCurrentStreak = 1;
    if (streak.lastReadDate === yesterdayString) {
      newCurrentStreak = streak.currentStreak + 1;
    } else if (streak.lastReadDate === today) {
      newCurrentStreak = streak.currentStreak;
    }

    const newStreak: ReadingStreak = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, streak.longestStreak),
      lastReadDate: today,
      totalDaysRead: streak.lastReadDate === today ? streak.totalDaysRead : streak.totalDaysRead + 1,
    };
    setStreak(newStreak);
  };

  // Update when location changes or every minute
  useEffect(() => {
    updateVedicTime();

    // Update every minute
    const intervalId = setInterval(updateVedicTime, 60000);

    return () => clearInterval(intervalId);
  }, [locationState.location.latitude, locationState.location.longitude]);

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Animated starfield background - covers entire page */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(0,0,0,1)_100%)]">
        {/* Create scattered stars with different sizes and opacities */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`star-lg-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Medium stars */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`star-md-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Small stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={`star-sm-${i}`}
              className="absolute w-px h-px bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Subtle cosmic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-purple-950/20" />
      </div>

      {/* Time Details sidebar (fixed left) */}
      {vedicTime && (
        <div className="relative z-30">
          <TimeDetails vedicTime={vedicTime} />
        </div>
      )}

      {/* Right Panel - Calendar & Tasks */}
      {vedicTime && (
        <div className="relative z-30">
          <RightPanel
            vedicTime={vedicTime}
            locationState={locationState}
            currentStoryId={todaysStory.id}
            onHymnRead={handleHymnRead}
          />
        </div>
      )}

      {/* Main content with scroll */}
      <div className="relative z-10">
        {/* Vedic Clock Section */}
        <VedicClock
          latitude={locationState.location.latitude}
          longitude={locationState.location.longitude}
          locationName={locationState.location.name}
        />
      </div>

      {/* Bottom Panel - Daily Hymn */}
      <BottomPanel
        story={todaysStory}
        nakshatraName={nakshatraName}
        onHymnRead={handleHymnRead}
      />
    </div>
  )
}

export default App
