/**
 * Sample Expanded Rigveda Hymns
 *
 * Demonstrates the full richness of the comprehensive data model
 * with complete scholarly, philosophical, and practical content.
 */

import type { RigvedaHymn } from '../types/rigveda';

/**
 * Rigveda 1.1 - The First Hymn to Agni
 * The opening hymn of the Rigveda, foundational to Vedic literature
 */
export const RV_1_1_AGNI: RigvedaHymn = {
  // Basic identification
  id: 'rv-1-1',
  mandala: 1,
  sukta: 1,
  rishi: 'Madhucchandas Vaishvamitra',
  devata: 'Agni',
  chhandas: 'Gayatri',

  // Content layers
  verses: [
    {
      number: 1,
      sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥',
      transliteration: 'agnim īḷe purohitaṃ yajñasya devam ṛtvijam | hotāraṃ ratnadhātamam ||',
      wordByWord: [
        {
          sanskrit: 'अग्निम्',
          transliteration: 'agnim',
          meaning: 'Agni (fire)',
          grammaticalInfo: 'accusative singular',
          etymology: 'from root ag- "to drive, lead"',
        },
        {
          sanskrit: 'ईळे',
          transliteration: 'īḷe',
          meaning: 'I praise, I worship',
          grammaticalInfo: '1st person singular present',
          etymology: 'from root īḍ- "to praise, invoke"',
        },
        {
          sanskrit: 'पुरोहितम्',
          transliteration: 'purohitam',
          meaning: 'placed in front, priest',
          grammaticalInfo: 'accusative singular',
          etymology: 'puras "in front" + hita "placed"',
        },
        {
          sanskrit: 'यज्ञस्य',
          transliteration: 'yajñasya',
          meaning: 'of the sacrifice',
          grammaticalInfo: 'genitive singular',
          etymology: 'from root yaj- "to worship, sacrifice"',
        },
        {
          sanskrit: 'देवम्',
          transliteration: 'devam',
          meaning: 'divine, god',
          grammaticalInfo: 'accusative singular',
          etymology: 'from root div- "to shine"',
        },
        {
          sanskrit: 'ऋत्विजम्',
          transliteration: 'ṛtvijam',
          meaning: 'priest who sacrifices at proper seasons',
          grammaticalInfo: 'accusative singular',
          etymology: 'ṛtu "season" + yaj- "to sacrifice"',
        },
        {
          sanskrit: 'होतारम्',
          transliteration: 'hotāram',
          meaning: 'invoker, priest who calls',
          grammaticalInfo: 'accusative singular',
          etymology: 'from root hu- "to offer, invoke"',
        },
        {
          sanskrit: 'रत्नधातमम्',
          transliteration: 'ratnadhātamam',
          meaning: 'best bestower of treasure',
          grammaticalInfo: 'accusative singular superlative',
          etymology: 'ratna "jewel, treasure" + dhātama "bestowing"',
        },
      ],
      translation: [
        {
          translator: 'Ralph T.H. Griffith',
          text: 'I Laud Agni, the chosen Priest, God, minister of sacrifice, The hotar, lavishest of wealth.',
          year: 1896,
          interpretation: 'literal',
        },
        {
          translator: 'Wendy Doniger',
          text: 'I pray to Agni, the household priest who is the god of the sacrifice, the one who chants and invokes and brings most treasure.',
          year: 1981,
          interpretation: 'poetic',
        },
        {
          translator: 'Sri Aurobindo',
          text: 'I aspire to the Fire, the divine power placed in front, the god of the sacrifice, the priest, the invoker, most full of the treasure.',
          year: 1998,
          interpretation: 'esoteric',
        },
      ],
      commentary: 'The opening verse establishes Agni as the central mediator between humans and divine realms. The word "purohita" (placed in front) indicates Agni\'s role as the first deity invoked, the gateway through which all offerings reach the gods.',
    },
    {
      number: 2,
      sanskrit: 'अग्निः पूर्वेभिरृषिभिरीड्यो नूतनैरुत । स देवाँ एह वक्षति ॥',
      transliteration: 'agniḥ pūrvebhir ṛṣibhir īḍyo nūtanair uta | sa devām̐ eha vakṣati ||',
      wordByWord: [
        {
          sanskrit: 'अग्निः',
          transliteration: 'agniḥ',
          meaning: 'Agni',
          grammaticalInfo: 'nominative singular',
        },
        {
          sanskrit: 'पूर्वेभिः',
          transliteration: 'pūrvebhiḥ',
          meaning: 'by the ancients',
          grammaticalInfo: 'instrumental plural',
        },
        {
          sanskrit: 'ऋषिभिः',
          transliteration: 'ṛṣibhiḥ',
          meaning: 'by seers',
          grammaticalInfo: 'instrumental plural',
        },
        {
          sanskrit: 'ईड्यः',
          transliteration: 'īḍyaḥ',
          meaning: 'worthy of praise',
          grammaticalInfo: 'nominative singular, gerundive',
        },
        {
          sanskrit: 'नूतनैः',
          transliteration: 'nūtanaiḥ',
          meaning: 'by the new, recent',
          grammaticalInfo: 'instrumental plural',
        },
        {
          sanskrit: 'उत',
          transliteration: 'uta',
          meaning: 'and also',
          grammaticalInfo: 'particle',
        },
        {
          sanskrit: 'सः',
          transliteration: 'saḥ',
          meaning: 'he',
          grammaticalInfo: 'nominative singular pronoun',
        },
        {
          sanskrit: 'देवान्',
          transliteration: 'devān',
          meaning: 'gods',
          grammaticalInfo: 'accusative plural',
        },
        {
          sanskrit: 'एह',
          transliteration: 'eha',
          meaning: 'here, to this place',
          grammaticalInfo: 'adverb',
        },
        {
          sanskrit: 'वक्षति',
          transliteration: 'vakṣati',
          meaning: 'will bring',
          grammaticalInfo: '3rd person singular future',
        },
      ],
      translation: [
        {
          translator: 'Ralph T.H. Griffith',
          text: 'Worthy is Agni to be praised by living as by ancient seers. He shall bring hitherward the Gods.',
          year: 1896,
          interpretation: 'literal',
        },
        {
          translator: 'Wendy Doniger',
          text: 'Agni is worthy of praise by the ancient seers and by the present ones. He will bring the gods here.',
          year: 1981,
          interpretation: 'literal',
        },
      ],
      commentary: 'This verse establishes the timeless nature of Agni worship, connecting past and present generations of seers. It emphasizes continuity of spiritual tradition.',
    },
    // Additional verses would follow...
  ],

  // Context and interpretation
  historicalContext: `This hymn, being the first in the Rigveda, holds immense significance as the gateway to Vedic literature.
  Composed during the early Rigvedic period (c. 1500-1200 BCE), it reflects the central role of fire sacrifice in Vedic society.
  Agni, as the mediator between earth and heaven, embodies the transformative power that carries human offerings to the divine realm.
  The hymn's placement as the opening suggests its foundational importance in establishing the relationship between human devotion and cosmic order (Ṛta).`,

  philosophicalThemes: [
    'Divine Mediation',
    'Cosmic Order (Ṛta)',
    'Sacrifice as Transformation',
    'Continuity of Tradition',
    'Light and Consciousness',
    'Inner and Outer Fire',
  ],

  symbolism: [
    {
      symbol: 'Agni (Fire)',
      levels: {
        literal: 'Physical fire used in sacrificial rituals, the flame on the altar',
        metaphorical: 'The transformative power that elevates material offerings to spiritual essence',
        spiritual: 'The divine will or power (Kratu) that bridges human and cosmic realms',
        psychological: 'Inner flame of aspiration, willpower, and spiritual hunger; digestive fire (jatharagni)',
      },
    },
    {
      symbol: 'Purohita (Priest placed in front)',
      levels: {
        literal: 'The ritual priest who conducts the fire ceremony',
        metaphorical: 'The foremost principle, that which comes first in spiritual practice',
        spiritual: 'Divine consciousness leading the soul\'s ascent',
        psychological: 'The focused will or intention that precedes all spiritual action',
      },
    },
    {
      symbol: 'Ratna (Treasure)',
      levels: {
        literal: 'Material wealth, gold, jewels offered and received',
        metaphorical: 'Valuable knowledge, wisdom, spiritual insight',
        spiritual: 'Divine grace, illumination, spiritual riches',
        psychological: 'Inner qualities, virtues, and realizations gained through practice',
      },
    },
  ],

  // Cross-references
  relatedHymns: [
    'rv-1-2', // Second Agni hymn
    'rv-1-26', // Agni as divine priest
    'rv-10-51', // Dialogue about Agni
    'rv-3-1', // Agni as cosmic power
  ],
  relatedConcepts: [
    'Yajna (Sacrifice)',
    'Ṛta (Cosmic Order)',
    'Devas (Divine Powers)',
    'Soma (Sacred Offering)',
    'Mantra (Sacred Utterance)',
  ],
  relatedDeities: ['Indra', 'Soma', 'Surya', 'Varuna'],

  // Scholarly resources
  commentaries: [
    {
      author: 'Sayana (14th century)',
      text: 'Agni is praised as purohita because he is placed foremost among the gods for worship. As ṛtvij, he performs the sacrifice according to the seasons. As hotṛ, he invokes the gods. The epithet ratnadhātama indicates that among all gods who bestow wealth, Agni bestows the most.',
      tradition: 'Traditional Vedantic',
      focus: 'ritual',
    },
    {
      author: 'Sri Aurobindo',
      text: 'Agni represents the divine Will-Force that aspires upward and brings down the higher consciousness. The purohita is not merely a priest but the leading power of the sacrifice of life. Ratna symbolizes not material wealth but the treasures of higher consciousness.',
      tradition: 'Integral Yoga',
      focus: 'esoteric',
    },
    {
      author: 'Jan Gonda',
      text: 'The opening hymn establishes the liturgical framework for all Vedic worship. The threefold characterization of Agni (purohita, ṛtvij, hotṛ) reflects the threefold structure of the sacrifice itself.',
      tradition: 'Modern Academic',
      focus: 'linguistic',
    },
  ],

  scholarlyNotes: [
    {
      topic: 'Gayatri Meter',
      content: 'This hymn is composed in the Gayatri meter (3 lines of 8 syllables each), the most sacred meter in Vedic literature. The Gayatri meter itself is considered auspicious and consciousness-enhancing.',
      sources: ['Vedic Meter and Verse by W.D. Whitney', 'The Rigveda: A Historical Analysis by S.S. Misra'],
      relevance: 'Understanding the meter helps in proper recitation and appreciation of the hymn\'s rhythmic power',
    },
    {
      topic: 'First Word Significance',
      content: 'The fact that "Agni" is the very first word of the Rigveda is significant. In Vedic thought, beginnings are crucial (ādi). Starting with Agni establishes fire as the primary principle.',
      sources: ['The Rigveda: The Earliest Religious Poetry of India by S.W. Jamison & J.P. Brereton'],
      relevance: 'Reveals the hierarchical structure of Vedic cosmology and ritual practice',
    },
  ],

  audioRecitation: {
    url: 'https://example.com/rigveda/1-1-agni.mp3',
    reciter: 'Pandit Ramesh Chandra Shukla',
    duration: 180,
    tradition: 'Shukla Yajurveda',
  },

  // Learning aids
  keyTerms: [
    {
      term: 'Agni',
      sanskrit: 'अग्नि',
      definition: 'The Vedic deity of fire, representing divine will, transformation, and the link between earth and heaven',
      firstAppearance: 'rv-1-1',
      relatedTerms: ['Jatavedas', 'Vaisvanara', 'Pavaka'],
    },
    {
      term: 'Purohita',
      sanskrit: 'पुरोहित',
      definition: 'Priest placed in front; the foremost principle; that which is invoked first',
      relatedTerms: ['Hotr', 'Rtvij', 'Adhvaryu'],
    },
    {
      term: 'Yajna',
      sanskrit: 'यज्ञ',
      definition: 'Sacrifice, offering, worship; the central Vedic ritual connecting human and divine',
      relatedTerms: ['Homa', 'Havan', 'Ishthi'],
    },
    {
      term: 'Ratna',
      sanskrit: 'रत्न',
      definition: 'Treasure, jewel, precious thing; can refer to material or spiritual wealth',
      relatedTerms: ['Dhana', 'Vasu', 'Bhaga'],
    },
  ],

  discussionQuestions: [
    'Why do you think Agni is invoked as the first deity in the Rigveda, rather than Indra or another god?',
    'How does the concept of Agni as a mediator relate to your own spiritual practice or understanding?',
    'What might the "treasure" (ratna) that Agni bestows represent in different contexts - material, intellectual, spiritual?',
    'The hymn emphasizes continuity between "ancient seers" and "new ones." Why is this continuity important?',
    'How can we understand the three aspects of Agni (purohita, ṛtvij, hotṛ) as describing different functions of one principle?',
  ],

  practicalApplications: [
    'Morning meditation: Visualize an inner flame of aspiration rising from the heart, connecting earth and sky',
    'Before important work: Invoke the principle of focused will-power (Agni) to accomplish transformation',
    'During study: Recognize knowledge as "treasure" (ratna) and approach learning as a sacred offering',
    'In community: Understand your role as a link (like Agni) between different groups or ideas',
    'Daily practice: Light a candle or lamp while contemplating Agni\'s role as illuminator and transformer',
  ],

  // Metadata
  difficulty: 'beginner',
  estimatedStudyTime: 45,
  tags: [
    'Agni',
    'Opening Hymn',
    'Sacrifice',
    'Fundamental',
    'Gayatri Meter',
    'Madhucchandas',
    'Fire Worship',
    'Divine Mediation',
  ],
};

/**
 * Collection of expanded hymns for the application
 */
export const EXPANDED_HYMNS: RigvedaHymn[] = [
  RV_1_1_AGNI,
  // Additional expanded hymns would be added here
];

/**
 * Get expanded hymn by ID
 */
export function getExpandedHymn(id: string): RigvedaHymn | undefined {
  return EXPANDED_HYMNS.find((hymn) => hymn.id === id);
}

/**
 * Get expanded hymn by mandala and sukta
 */
export function getExpandedHymnByReference(mandala: number, sukta: number): RigvedaHymn | undefined {
  return EXPANDED_HYMNS.find((hymn) => hymn.mandala === mandala && hymn.sukta === sukta);
}

/**
 * Search hymns by various criteria
 */
export function searchExpandedHymns(criteria: {
  deity?: string;
  theme?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}): RigvedaHymn[] {
  return EXPANDED_HYMNS.filter((hymn) => {
    if (criteria.deity && hymn.devata !== criteria.deity) return false;
    if (criteria.difficulty && hymn.difficulty !== criteria.difficulty) return false;
    if (criteria.theme && !hymn.philosophicalThemes.includes(criteria.theme)) return false;
    if (criteria.tags && !criteria.tags.some((tag) => hymn.tags.includes(tag))) return false;
    return true;
  });
}
