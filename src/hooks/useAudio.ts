/**
 * Audio Management Hook
 *
 * Manages background music streaming with playlist support.
 * Streams spiritual meditation music from external sources.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_PLAYLIST, getNextTrack, getPreviousTrack, getRandomTrack, type MusicTrack } from '../data/musicPlaylist';

export interface AudioPreferences {
  /** Enable background ambient music */
  enableMusic: boolean;
  /** Music volume (0-1) */
  musicVolume: number;
  /** Shuffle mode */
  shuffle: boolean;
}

const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  enableMusic: false,
  musicVolume: 0.5,
  shuffle: false,
};

export interface UseAudioResult {
  preferences: AudioPreferences;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  updatePreferences: (updates: Partial<AudioPreferences>) => void;
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  toggleShuffle: () => void;
}

/**
 * Custom hook for managing audio streaming
 */
export function useAudio(): UseAudioResult {
  const [preferences, setPreferences] = useLocalStorage<AudioPreferences>(
    'vedic-clock-audio-preferences',
    DEFAULT_AUDIO_PREFERENCES
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Load and play a track
   */
  const loadTrack = useCallback((track: MusicTrack) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;

      // Auto-play next track when current ends
      audioRef.current.addEventListener('ended', () => {
        if (preferences.shuffle) {
          const nextTrack = getRandomTrack(DEFAULT_PLAYLIST, track.id);
          loadTrack(nextTrack);
        } else {
          const nextTrack = getNextTrack(track.id, DEFAULT_PLAYLIST);
          loadTrack(nextTrack);
        }
      });

      // Handle playback errors
      audioRef.current.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        // Try next track on error
        const nextTrack = getNextTrack(track.id, DEFAULT_PLAYLIST);
        loadTrack(nextTrack);
      });
    }

    audioRef.current.src = track.url;
    audioRef.current.volume = preferences.musicVolume;
    setCurrentTrack(track);

    if (preferences.enableMusic) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.warn('Audio play failed:', error);
          setIsPlaying(false);
        });
    }
  }, [preferences.enableMusic, preferences.musicVolume, preferences.shuffle]);

  /**
   * Initialize audio with first track
   */
  useEffect(() => {
    if (preferences.enableMusic && !currentTrack) {
      const firstTrack = preferences.shuffle
        ? getRandomTrack(DEFAULT_PLAYLIST)
        : DEFAULT_PLAYLIST[0];
      loadTrack(firstTrack);
    }
  }, [preferences.enableMusic, currentTrack, preferences.shuffle, loadTrack]);

  /**
   * Handle play/pause when enableMusic changes
   */
  useEffect(() => {
    if (audioRef.current) {
      if (preferences.enableMusic) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.warn('Audio play failed:', error);
            setIsPlaying(false);
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [preferences.enableMusic]);

  /**
   * Update volume when preference changes
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = preferences.musicVolume;
    }
  }, [preferences.musicVolume]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * Update preferences
   */
  const updatePreferences = useCallback(
    (updates: Partial<AudioPreferences>) => {
      setPreferences({ ...preferences, ...updates });
    },
    [preferences, setPreferences]
  );

  /**
   * Toggle background music
   */
  const toggleMusic = useCallback(() => {
    updatePreferences({ enableMusic: !preferences.enableMusic });
  }, [preferences.enableMusic, updatePreferences]);

  /**
   * Set music volume
   */
  const setMusicVolume = useCallback(
    (volume: number) => {
      updatePreferences({ musicVolume: Math.max(0, Math.min(1, volume)) });
    },
    [updatePreferences]
  );

  /**
   * Play next track
   */
  const playNextTrack = useCallback(() => {
    if (currentTrack) {
      const nextTrack = preferences.shuffle
        ? getRandomTrack(DEFAULT_PLAYLIST, currentTrack.id)
        : getNextTrack(currentTrack.id, DEFAULT_PLAYLIST);
      loadTrack(nextTrack);
    }
  }, [currentTrack, preferences.shuffle, loadTrack]);

  /**
   * Play previous track
   */
  const playPreviousTrack = useCallback(() => {
    if (currentTrack) {
      const prevTrack = getPreviousTrack(currentTrack.id, DEFAULT_PLAYLIST);
      loadTrack(prevTrack);
    }
  }, [currentTrack, loadTrack]);

  /**
   * Toggle shuffle mode
   */
  const toggleShuffle = useCallback(() => {
    updatePreferences({ shuffle: !preferences.shuffle });
  }, [preferences.shuffle, updatePreferences]);

  return {
    preferences,
    isPlaying,
    currentTrack,
    updatePreferences,
    toggleMusic,
    setMusicVolume,
    playNextTrack,
    playPreviousTrack,
    toggleShuffle,
  };
}
