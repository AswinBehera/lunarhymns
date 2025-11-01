/**
 * Story Selector Module
 *
 * Selects the daily Rigvedic story based on cosmic context:
 * - Special occasions (Purnima, Amavasya, Ekadashi)
 * - Paksha (waxing/waning moon phase)
 * - Tithi (lunar day) for thematic relevance
 * - Nakshatra as fallback for daily variation
 */

import storiesData from '../data/rigvedaStories.json';
import type { Paksha } from './vedic-calendar';

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
 * Contextual story selection options
 */
export interface StorySelectionContext {
  /** Current nakshatra (1-27) */
  nakshatraNumber: number;
  /** Current tithi (1-30) */
  tithi: number;
  /** Current paksha (waxing/waning moon) */
  paksha: Paksha;
}

/**
 * Get story ID based on special occasions and cosmic context
 *
 * Priority order:
 * 1. Special occasions (Purnima, Amavasya, Ekadashi)
 * 2. Paksha-based themes (waxing/waning)
 * 3. Tithi-based themes
 * 4. Nakshatra as fallback
 *
 * @param context - Cosmic context for selection
 * @returns Story ID (1-27)
 */
function getContextualStoryId(context: StorySelectionContext): number {
  const { tithi, paksha } = context;

  // Special Occasions
  // Purnima (Full Moon - 15th tithi of Shukla Paksha)
  if (tithi === 15 && paksha === 'Shukla') {
    // Stories about illumination, unity, completion
    const purnimStories = [14, 20, 22]; // Gayatri, Golden Embryo, Unity
    return purnimStories[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % purnimStories.length];
  }

  // Amavasya (New Moon - 15th/30th tithi of Krishna Paksha)
  if ((tithi === 15 || tithi === 30) && paksha === 'Krishna') {
    // Stories about creation, mystery, new beginnings
    const amavasyaStories = [1, 5, 20]; // Nasadiya, Riddle Hymn, Golden Embryo
    return amavasyaStories[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % amavasyaStories.length];
  }

  // Ekadashi (11th tithi - spiritually auspicious)
  if (tithi === 11) {
    // Stories about devotion, purification, spiritual practice
    const ekadasiStories = [6, 7, 14]; // Prayer to Varuna, Soma Pavamana, Gayatri
    return ekadasiStories[paksha === 'Shukla' ? 2 : 0]; // Gayatri for Shukla, Varuna for Krishna
  }

  // Paksha-based selection
  if (paksha === 'Shukla') {
    // Waxing moon: growth, light, victory, beginnings
    const shuklaThemes = [3, 4, 8, 13, 19, 21]; // Agni, Indra's Greatness, Dawn, Vishnu, Indra Slays Vritra, Savitṛ
    // Use tithi to vary within waxing period
    return shuklaThemes[tithi % shuklaThemes.length];
  } else {
    // Waning moon: introspection, mercy, reflection, letting go
    const krishnaThemes = [6, 16, 23, 25]; // Varuna, Urvashi, Rudra's Grace, Gambler's Lament
    // Use tithi to vary within waning period
    return krishnaThemes[tithi % krishnaThemes.length];
  }
}

/**
 * Get today's story based on cosmic context
 *
 * Enhanced selection that considers:
 * - Special occasions (Purnima, Amavasya, Ekadashi)
 * - Paksha for thematic alignment
 * - Tithi for daily variation
 * - Nakshatra as ultimate fallback
 *
 * @param nakshatraNumber - Current nakshatra (1-27)
 * @param tithi - Current tithi (1-30, optional)
 * @param paksha - Current paksha ('shukla' or 'krishna', optional)
 * @returns The selected Rigveda story
 */
export function getTodaysStory(
  nakshatraNumber: number,
  tithi?: number,
  paksha?: Paksha
): RigvedaStory {
  // Validate nakshatra number
  if (nakshatraNumber < 1 || nakshatraNumber > 27) {
    console.warn(`Invalid nakshatra number: ${nakshatraNumber}. Using 1.`);
    nakshatraNumber = 1;
  }

  let storyId: number;

  // If tithi and paksha are provided, use contextual selection
  if (tithi !== undefined && paksha !== undefined) {
    storyId = getContextualStoryId({ nakshatraNumber, tithi, paksha });
  } else {
    // Fallback to simple nakshatra-based selection
    storyId = nakshatraNumber;
  }

  // Get the story by ID (stories are 1-indexed in JSON)
  const story = storiesData.stories.find(s => s.id === storyId);

  if (!story) {
    console.error(`Story not found for ID ${storyId}`);
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
