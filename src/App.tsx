import './App.css'
import { useState, useEffect } from 'react'
import { VedicClock } from './components/Clock/VedicClock'
import { TimeDetails } from './components/Layout'
import { BottomPanel, RightPanel } from './components/Panels'
import { KeyboardShortcutsModal } from './components/Help/KeyboardShortcutsModal'
import { AudioSettings } from './components/Settings/AudioSettings'
import { useLocation } from './hooks/useLocation'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePanels } from './hooks/usePanels'
import { useAudio } from './hooks/useAudio'
import { usePanelShortcuts, useGlobalShortcuts, useScreenReaderAnnouncement } from './hooks/useKeyboardShortcuts'
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

  // Panel state management with keyboard shortcuts
  const panels = usePanels();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Audio management
  const audio = useAudio();

  // Screen reader announcements
  const announce = useScreenReaderAnnouncement();

  // Reading history state
  const [readingHistory, setReadingHistory] = useLocalStorage<ReadingEntry[]>('vedic-clock-reading-history', []);
  const [streak, setStreak] = useLocalStorage<ReadingStreak>('vedic-clock-reading-streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    totalDaysRead: 0,
  });

  // Set up keyboard shortcuts
  const panelShortcuts = usePanelShortcuts({
    toggleLeft: panels.toggleLeft,
    toggleRight: panels.toggleRight,
    toggleBottom: panels.toggleBottom,
  });

  const globalShortcuts = useGlobalShortcuts({
    showHelp: () => setShowShortcutsHelp(true),
    openBreathingModal: () => setShowAudioSettings(true),
  });

  const allShortcuts = [...panelShortcuts, ...globalShortcuts];

  // Calculate Vedic time and update story
  const updateVedicTime = () => {
    try {
      const prevMuhurta = vedicTime?.muhurta.number;
      const time = calculateVedicTime(
        locationState.location.latitude,
        locationState.location.longitude
      );
      setVedicTime(time);

      // Update story based on cosmic context (nakshatra, tithi, paksha)
      const story = getTodaysStory(time.nakshatra, time.tithi, time.paksha);
      setTodaysStory(story);
      setNakshatraName(time.nakshatraName.split('(')[0].trim());

      // Announce muhurta changes to screen readers
      if (prevMuhurta && prevMuhurta !== time.muhurta.number) {
        announce(`Muhurta changed to ${time.muhurta.name}`, 'polite');
      }
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

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        shortcuts={allShortcuts}
      />

      {/* Audio Settings Modal */}
      <AudioSettings
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
        preferences={audio.preferences}
        isPlaying={audio.isPlaying}
        currentTrack={audio.currentTrack}
        onToggleMusic={audio.toggleMusic}
        onMusicVolumeChange={audio.setMusicVolume}
        onNextTrack={audio.playNextTrack}
        onPreviousTrack={audio.playPreviousTrack}
        onToggleShuffle={audio.toggleShuffle}
      />

      {/* Floating Audio Settings Button */}
      <button
        onClick={() => setShowAudioSettings(true)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        style={{
          backgroundColor: audio.isPlaying ? '#4DD0E1' : '#D4AF37',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-label="Open audio settings"
        title="Audio Settings (Ctrl+B)"
      >
        {audio.isPlaying ? (
          <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default App
