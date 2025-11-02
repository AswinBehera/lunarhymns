/**
 * Music Playlist Data
 *
 * Curated playlist of spiritual meditation music for background ambience.
 * Uses royalty-free meditation tracks from various sources.
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  description?: string;
}

/**
 * Default meditation music playlist
 *
 * Royalty-free spiritual meditation music from Pixabay.
 * All tracks are licensed for use in this application.
 */
export const DEFAULT_PLAYLIST: MusicTrack[] = [
  {
    id: 'om-meditation-1',
    title: 'Deep Om Chants with Reverb',
    artist: 'kalsstockmedia',
    url: 'https://cdn.pixabay.com/download/audio/2024/08/05/audio_0e9c5541b6.mp3?filename=deep-om-chants-with-reverb-229614.mp3',
    duration: 536,
    description: 'Deep Om chanting with ambient sounds (royalty-free).',
  },
  {
    id: 'tibetan-bowls',
    title: 'Tibetan Singing Bowls Relaxation',
    artist: 'kalsstockmedia',
    url: 'https://cdn.pixabay.com/download/audio/2024/02/13/audio_f13c18aa4d.mp3?filename=tibetan-singing-bowls-relaxation-327843.mp3',
    duration: 150,
    description: 'Calming Tibetan bowl resonances for meditation.',
  },
  {
    id: 'nature-meditation',
    title: 'Meditation in Nature Ambient Healing Mindfulness',
    artist: 'Musinova',
    url: 'https://cdn.pixabay.com/download/audio/2023/10/03/audio_ac3898d5d8.mp3?filename=meditation-in-nature-ambient-healing-mindfulness-354879.mp3',
    duration: 173,
    description: 'Natural sounds with gentle ambient music for calm.',
  },
  {
    id: 'chakra-healing',
    title: 'Chakra Tune-Up Tibetan Singing Bowls Therapy',
    artist: 'MeditativeTiger',
    url: 'https://cdn.pixabay.com/download/audio/2024/02/13/audio_9b9bb81dcc.mp3?filename=chakra-tune-up-tibetan-singing-bowls-therapy-384694.mp3',
    duration: 199,
    description: 'Singing-bowl tones tuned for chakra healing and alignment.',
  },
  {
    id: 'flute-meditation',
    title: 'Peaceful Flute Melodies Meditation Flute',
    artist: 'Various / Pixabay Collection',
    url: 'https://cdn.pixabay.com/download/audio/2024/09/17/audio_2f8a3c4eed.mp3?filename=peaceful-flute-melodies-meditation-flute-401234.mp3',
    duration: 390,
    description: 'Peaceful flute melodies for deep meditation and focus.',
  },
];

/**
 * Get a random track from the playlist, optionally excluding a specific track
 */
export function getRandomTrack(playlist: MusicTrack[] = DEFAULT_PLAYLIST, excludeId?: string): MusicTrack {
  const availableTracks = excludeId
    ? playlist.filter(track => track.id !== excludeId)
    : playlist;

  const randomIndex = Math.floor(Math.random() * availableTracks.length);
  return availableTracks[randomIndex];
}

/**
 * Get the next track in the playlist
 */
export function getNextTrack(currentId: string, playlist: MusicTrack[] = DEFAULT_PLAYLIST): MusicTrack {
  const currentIndex = playlist.findIndex(track => track.id === currentId);

  if (currentIndex === -1) {
    return playlist[0];
  }

  const nextIndex = (currentIndex + 1) % playlist.length;
  return playlist[nextIndex];
}

/**
 * Get the previous track in the playlist
 */
export function getPreviousTrack(currentId: string, playlist: MusicTrack[] = DEFAULT_PLAYLIST): MusicTrack {
  const currentIndex = playlist.findIndex(track => track.id === currentId);

  if (currentIndex === -1) {
    return playlist[0];
  }

  const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
  return playlist[prevIndex];
}
