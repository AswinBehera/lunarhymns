/**
 * Muhurta Details and Significance
 *
 * Comprehensive information about each of the 30 muhurtas in a day.
 * Each muhurta has specific qualities, ruling deities, and best activities.
 */

export interface MuhurtaDetail {
  /** Muhurta number (1-30) */
  number: number;
  /** Name in Sanskrit (Devanagari) */
  nameSanskrit: string;
  /** Name in English */
  nameEnglish: string;
  /** Category of muhurta */
  category: 'auspicious' | 'neutral' | 'inauspicious';
  /** Brief description of significance */
  significance: string;
  /** Best activities for this muhurta */
  bestFor: string[];
  /** Ruling deity */
  rulingDeity?: string;
  /** Additional notes */
  notes?: string;
}

export const MUHURTA_DETAILS: MuhurtaDetail[] = [
  {
    number: 1,
    nameSanskrit: 'रुद्र',
    nameEnglish: 'Rudra',
    category: 'inauspicious',
    significance: 'Ruled by Rudra, the fierce form of Shiva',
    bestFor: ['meditation', 'spiritual practices', 'inner work'],
    rulingDeity: 'Rudra (Shiva)',
    notes: 'Avoid starting new ventures. Good for destruction of negativity.'
  },
  {
    number: 2,
    nameSanskrit: 'आहि',
    nameEnglish: 'Ahi',
    category: 'neutral',
    significance: 'Serpent energy, transformation and renewal',
    bestFor: ['healing', 'transformation', 'letting go'],
    rulingDeity: 'Serpent deity',
    notes: 'Time for releasing old patterns and embracing change.'
  },
  {
    number: 3,
    nameSanskrit: 'मित्र',
    nameEnglish: 'Mitra',
    category: 'auspicious',
    significance: 'Friend, harmony, and cooperation',
    bestFor: ['social gatherings', 'partnerships', 'agreements'],
    rulingDeity: 'Mitra',
    notes: 'Excellent for building relationships and cooperation.'
  },
  {
    number: 4,
    nameSanskrit: 'पितृ',
    nameEnglish: 'Pitri',
    category: 'neutral',
    significance: 'Ancestors, tradition, and heritage',
    bestFor: ['ancestral worship', 'family matters', 'remembrance'],
    rulingDeity: 'Pitris (Ancestors)',
    notes: 'Good for honoring elders and ancestral traditions.'
  },
  {
    number: 5,
    nameSanskrit: 'वसु',
    nameEnglish: 'Vasu',
    category: 'auspicious',
    significance: 'Wealth, prosperity, and abundance',
    bestFor: ['business', 'finance', 'accumulation'],
    rulingDeity: 'Vasus (wealth gods)',
    notes: 'Favorable for financial matters and material prosperity.'
  },
  {
    number: 6,
    nameSanskrit: 'वर',
    nameEnglish: 'Vara',
    category: 'auspicious',
    significance: 'Excellence, boons, and blessings',
    bestFor: ['important ceremonies', 'prayers', 'seeking blessings'],
    rulingDeity: 'Various beneficent deities',
    notes: 'Ideal for auspicious ceremonies and receiving blessings.'
  },
  {
    number: 7,
    nameSanskrit: 'विश्वे',
    nameEnglish: 'Vishve',
    category: 'auspicious',
    significance: 'Universal deities, cosmic harmony',
    bestFor: ['group activities', 'community work', 'universal prayers'],
    rulingDeity: 'Vishvedevas',
    notes: 'Excellent for collective welfare and community endeavors.'
  },
  {
    number: 8,
    nameSanskrit: 'विधि',
    nameEnglish: 'Vidhi',
    category: 'auspicious',
    significance: 'Divine law, proper procedure',
    bestFor: ['legal matters', 'formal procedures', 'rituals'],
    rulingDeity: 'Brahma (Creator)',
    notes: 'Best for following proper protocols and legal processes.'
  },
  {
    number: 9,
    nameSanskrit: 'सतमुखी',
    nameEnglish: 'Satamukhi',
    category: 'neutral',
    significance: 'Many-faced, adaptability',
    bestFor: ['versatile activities', 'learning', 'adaptation'],
    notes: 'Time for flexibility and handling multiple tasks.'
  },
  {
    number: 10,
    nameSanskrit: 'पुरुहूत',
    nameEnglish: 'Puruhuta',
    category: 'auspicious',
    significance: 'Much invoked, sacred power',
    bestFor: ['prayers', 'invocations', 'spiritual work'],
    rulingDeity: 'Indra',
    notes: 'Powerful time for invoking divine assistance.'
  },
  {
    number: 11,
    nameSanskrit: 'वाहिनी',
    nameEnglish: 'Vahini',
    category: 'neutral',
    significance: 'Carrier, movement, flow',
    bestFor: ['travel', 'transportation', 'communication'],
    notes: 'Good for journeys and moving things forward.'
  },
  {
    number: 12,
    nameSanskrit: 'नक्तनार',
    nameEnglish: 'Naktanara',
    category: 'neutral',
    significance: 'Night wanderer, transition',
    bestFor: ['rest', 'contemplation', 'night activities'],
    notes: 'Time for winding down and introspection.'
  },
  {
    number: 13,
    nameSanskrit: 'वरुण',
    nameEnglish: 'Varuna',
    category: 'auspicious',
    significance: 'Water deity, cosmic law, truth',
    bestFor: ['purification', 'truth-seeking', 'justice'],
    rulingDeity: 'Varuna',
    notes: 'Excellent for matters of truth and righteousness.'
  },
  {
    number: 14,
    nameSanskrit: 'अर्यमा',
    nameEnglish: 'Aryama',
    category: 'auspicious',
    significance: 'Hospitality, nobility, customs',
    bestFor: ['social functions', 'hosting', 'cultural events'],
    rulingDeity: 'Aryaman',
    notes: 'Perfect for hosting guests and social gatherings.'
  },
  {
    number: 15,
    nameSanskrit: 'भग',
    nameEnglish: 'Bhaga',
    category: 'auspicious',
    significance: 'Fortune, prosperity, share',
    bestFor: ['wealth creation', 'distribution', 'generosity'],
    rulingDeity: 'Bhaga',
    notes: 'Favorable for receiving and sharing prosperity.'
  },
  {
    number: 16,
    nameSanskrit: 'गिरीश',
    nameEnglish: 'Girisha',
    category: 'neutral',
    significance: 'Lord of mountains, steadfastness',
    bestFor: ['stability', 'meditation', 'determination'],
    rulingDeity: 'Shiva',
    notes: 'Good for building strong foundations and resolve.'
  },
  {
    number: 17,
    nameSanskrit: 'अजपाद',
    nameEnglish: 'Ajapada',
    category: 'neutral',
    significance: 'Unborn foot, mysterious power',
    bestFor: ['mystical practices', 'hidden knowledge', 'occult'],
    notes: 'Time for exploring deeper mysteries.'
  },
  {
    number: 18,
    nameSanskrit: 'अहिर्बुध्न्य',
    nameEnglish: 'Ahirbudhnya',
    category: 'neutral',
    significance: 'Serpent of the deep, hidden wisdom',
    bestFor: ['deep study', 'research', 'uncovering secrets'],
    rulingDeity: 'Ahirbudhnya',
    notes: 'Excellent for profound learning and research.'
  },
  {
    number: 19,
    nameSanskrit: 'पूषन्',
    nameEnglish: 'Pushan',
    category: 'auspicious',
    significance: 'Nourisher, protector of travelers',
    bestFor: ['journeys', 'animal care', 'nutrition'],
    rulingDeity: 'Pushan',
    notes: 'Ideal for starting journeys and caring for animals.'
  },
  {
    number: 20,
    nameSanskrit: 'अश्विनी',
    nameEnglish: 'Ashvini',
    category: 'auspicious',
    significance: 'Divine healers, swift action',
    bestFor: ['healing', 'medicine', 'quick decisions'],
    rulingDeity: 'Ashvini Kumaras',
    notes: 'Best time for medical treatments and healing arts.'
  },
  {
    number: 21,
    nameSanskrit: 'यम',
    nameEnglish: 'Yama',
    category: 'inauspicious',
    significance: 'Death deity, endings, justice',
    bestFor: ['endings', 'letting go', 'karma work'],
    rulingDeity: 'Yama',
    notes: 'Avoid new beginnings. Good for completion and closure.'
  },
  {
    number: 22,
    nameSanskrit: 'अग्नि',
    nameEnglish: 'Agni',
    category: 'auspicious',
    significance: 'Fire deity, purification, transformation',
    bestFor: ['ceremonies', 'purification', 'spiritual practices'],
    rulingDeity: 'Agni',
    notes: 'Excellent for fire ceremonies and purification rites.'
  },
  {
    number: 23,
    nameSanskrit: 'विधातृ',
    nameEnglish: 'Vidhatri',
    category: 'auspicious',
    significance: 'Creator, ordainer of destiny',
    bestFor: ['planning', 'designing', 'creative work'],
    rulingDeity: 'Brahma',
    notes: 'Perfect for creative projects and future planning.'
  },
  {
    number: 24,
    nameSanskrit: 'कण्ड',
    nameEnglish: 'Kanda',
    category: 'neutral',
    significance: 'Sections, divisions, organization',
    bestFor: ['organization', 'categorization', 'structure'],
    notes: 'Good for organizing and bringing order to chaos.'
  },
  {
    number: 25,
    nameSanskrit: 'अदिति',
    nameEnglish: 'Aditi',
    category: 'auspicious',
    significance: 'Mother of gods, boundless, freedom',
    bestFor: ['liberation', 'new beginnings', 'motherhood'],
    rulingDeity: 'Aditi',
    notes: 'Highly auspicious for all new ventures and growth.'
  },
  {
    number: 26,
    nameSanskrit: 'जीव',
    nameEnglish: 'Jiva (Amrita)',
    category: 'auspicious',
    significance: 'Life force, immortality, vitality',
    bestFor: ['health', 'longevity', 'vitality practices'],
    notes: 'Most auspicious muhurta. Excellent for all activities.'
  },
  {
    number: 27,
    nameSanskrit: 'विष्णु',
    nameEnglish: 'Vishnu',
    category: 'auspicious',
    significance: 'Preserver, sustainer, protection',
    bestFor: ['preservation', 'maintenance', 'protection'],
    rulingDeity: 'Vishnu',
    notes: 'Ideal for matters requiring divine protection and sustenance.'
  },
  {
    number: 28,
    nameSanskrit: 'द्युमद्गद्युति',
    nameEnglish: 'Dyumadgadyuti',
    category: 'auspicious',
    significance: 'Brilliant splendor, radiance',
    bestFor: ['celebrations', 'performances', 'display'],
    notes: 'Perfect for events requiring brilliance and grandeur.'
  },
  {
    number: 29,
    nameSanskrit: 'ब्रह्मा',
    nameEnglish: 'Brahma',
    category: 'auspicious',
    significance: 'Creator, supreme knowledge',
    bestFor: ['learning', 'teaching', 'sacred knowledge'],
    rulingDeity: 'Brahma',
    notes: 'Supreme for education and spiritual enlightenment.'
  },
  {
    number: 30,
    nameSanskrit: 'समुद्रम्',
    nameEnglish: 'Samudram',
    category: 'neutral',
    significance: 'Ocean, vastness, collective unconscious',
    bestFor: ['contemplation', 'depth work', 'emotional healing'],
    notes: 'Time for diving deep into emotions and the subconscious.'
  },
];

/**
 * Get muhurta details by number
 */
export function getMuhurtaDetails(muhurtaNumber: number): MuhurtaDetail | undefined {
  return MUHURTA_DETAILS.find(m => m.number === muhurtaNumber);
}

/**
 * Get muhurtas by category
 */
export function getMuhurtasByCategory(category: MuhurtaDetail['category']): MuhurtaDetail[] {
  return MUHURTA_DETAILS.filter(m => m.category === category);
}
