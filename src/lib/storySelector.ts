/**
 * Story Selector Module
 *
 * Selects the daily Rigvedic story based on the current nakshatra.
 * Each of the 27 nakshatras corresponds to one of the 27 stories,
 * ensuring the same story appears all day for the same nakshatra.
 */

import storiesData from '../data/rigvedaStories.json';

/**
 * Rigvedic story structure
 */
export interface RigvedaStory {
  id: number;
  mandala: number;
  sukta: number;
  title: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  context: string;
  themes: string[];
}

/**
 * Get today's story based on the current nakshatra
 *
 * The story selection is deterministic based on nakshatra number:
 * - Nakshatra 1 (Ashwini) → Story 1 (Nasadiya Sukta)
 * - Nakshatra 2 (Bharani) → Story 2 (Purusha Sukta)
 * - ... and so on
 *
 * This ensures:
 * 1. The same story appears all day (nakshatra doesn't change frequently)
 * 2. Stories cycle through the 27 nakshatras
 * 3. Users experience different stories as nakshatras progress
 *
 * @param nakshatraNumber - Current nakshatra (1-27)
 * @returns The selected Rigveda story
 */
export function getTodaysStory(nakshatraNumber: number): RigvedaStory {
  // Validate nakshatra number
  if (nakshatraNumber < 1 || nakshatraNumber > 27) {
    console.warn(`Invalid nakshatra number: ${nakshatraNumber}. Using 1.`);
    nakshatraNumber = 1;
  }

  // Get the story corresponding to this nakshatra
  // Nakshatra numbers are 1-indexed, array is 0-indexed
  const storyIndex = nakshatraNumber - 1;
  const story = storiesData.stories[storyIndex];

  if (!story) {
    console.error(`Story not found for nakshatra ${nakshatraNumber}`);
    // Fallback to first story
    return storiesData.stories[0] as RigvedaStory;
  }

  return story as RigvedaStory;
}

/**
 * Get all available stories
 *
 * @returns Array of all Rigveda stories
 */
export function getAllStories(): RigvedaStory[] {
  return storiesData.stories as RigvedaStory[];
}

/**
 * Get a story by its ID
 *
 * @param id - Story ID
 * @returns The requested story or undefined if not found
 */
export function getStoryById(id: number): RigvedaStory | undefined {
  return storiesData.stories.find(story => story.id === id) as RigvedaStory | undefined;
}

/**
 * Get stories by theme
 *
 * @param theme - Theme to search for
 * @returns Array of stories matching the theme
 */
export function getStoriesByTheme(theme: string): RigvedaStory[] {
  return storiesData.stories.filter(story =>
    story.themes.some(t => t.toLowerCase().includes(theme.toLowerCase()))
  ) as RigvedaStory[];
}

/**
 * Get a random story
 *
 * @returns A randomly selected story
 */
export function getRandomStory(): RigvedaStory {
  const randomIndex = Math.floor(Math.random() * storiesData.stories.length);
  return storiesData.stories[randomIndex] as RigvedaStory;
}
