import './App.css'
import { useState, useEffect } from 'react'
import { VedicClock } from './components/Clock/VedicClock'
import { LocationInput, TimeDetails } from './components/Layout'
import { StoryCard } from './components/Story/StoryCard'
import { useLocation } from './hooks/useLocation'
import { calculateVedicTime, type VedicTime } from './lib/vedic-calendar'
import { getTodaysStory } from './lib/storySelector'

function App() {
  // Use location hook to manage geographic location
  // Automatically requests browser geolocation or uses default (Bengaluru, India)
  const locationState = useLocation();
  const [todaysStory, setTodaysStory] = useState(getTodaysStory(1));
  const [nakshatraName, setNakshatraName] = useState('');
  const [vedicTime, setVedicTime] = useState<VedicTime | null>(null);

  // Calculate Vedic time and update story
  const updateVedicTime = () => {
    try {
      const time = calculateVedicTime(
        locationState.location.latitude,
        locationState.location.longitude
      );
      setVedicTime(time);

      // Update story based on nakshatra
      const story = getTodaysStory(time.nakshatra);
      setTodaysStory(story);
      setNakshatraName(time.nakshatraName.split('(')[0].trim());
    } catch (error) {
      console.error('Error calculating Vedic time:', error);
    }
  };

  // Update when location changes or every minute
  useEffect(() => {
    updateVedicTime();

    // Update every minute
    const intervalId = setInterval(updateVedicTime, 60000);

    return () => clearInterval(intervalId);
  }, [locationState.location.latitude, locationState.location.longitude]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Location input panel (fixed top-right) */}
      <LocationInput locationState={locationState} />

      {/* Time Details sidebar (fixed left) */}
      {vedicTime && <TimeDetails vedicTime={vedicTime} />}

      {/* Main content with scroll */}
      <div className="relative">
        {/* Vedic Clock Section */}
        <VedicClock
          latitude={locationState.location.latitude}
          longitude={locationState.location.longitude}
          locationName={locationState.location.name}
        />

        {/* Story Section - Below the clock */}
        <div className="relative z-10 px-4 pb-16 -mt-32">
          <StoryCard story={todaysStory} nakshatraName={nakshatraName} />
        </div>
      </div>
    </div>
  )
}

export default App
