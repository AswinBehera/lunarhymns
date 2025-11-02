# Rigveda Data Model Documentation

## Overview

This document describes the comprehensive data model for Rigvedic hymns in the Vedic Lunar Clock application. The model supports multiple layers of meaning, scholarly resources, and practical applications.

## Architecture

### Multi-Layered Approach

The data model is designed to support different depths of engagement:

1. **Simple Layer** (`SimpleHymn`): Basic hymn information for daily reading
2. **Expanded Layer** (`RigvedaHymn`): Complete scholarly and spiritual content
3. **Adapter Layer** (`hymnAdapter.ts`): Utilities to convert between formats

## Core Data Types

### RigvedaHymn (Primary Interface)

The complete hymn structure with all metadata and content:

```typescript
interface RigvedaHymn {
  // Identification
  id: string;              // e.g., "rv-1-1"
  mandala: number;         // Book number (1-10)
  sukta: number;           // Hymn number within book
  rishi: string;           // Seer who received the hymn
  devata: string;          // Deity addressed
  chhandas: string;        // Poetic meter

  // Content
  verses: Verse[];         // Complete verses with translations

  // Interpretation
  historicalContext: string;
  philosophicalThemes: string[];
  symbolism: Symbolism[];

  // Cross-references
  relatedHymns: string[];
  relatedConcepts: string[];
  relatedDeities: string[];

  // Resources
  commentaries: Commentary[];
  scholarlyNotes: ScholarlyNote[];
  audioRecitation?: AudioResource;

  // Learning aids
  keyTerms: KeyTerm[];
  discussionQuestions: string[];
  practicalApplications: string[];

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: number;  // minutes
  tags: string[];
}
```

### Verse Structure

Each verse contains multiple translation layers:

```typescript
interface Verse {
  number: number;
  sanskrit: string;              // Devanagari text
  transliteration: string;       // IAST/Harvard-Kyoto
  wordByWord: WordMeaning[];     // Grammatical analysis
  translation: Translation[];    // Multiple translations
  commentary: string;            // Verse-specific notes
}
```

### Multi-Level Symbolism

Symbols are interpreted at four levels:

```typescript
interface Symbolism {
  symbol: string;
  levels: {
    literal: string;        // Physical/ritual meaning
    metaphorical: string;   // Figurative meaning
    spiritual: string;      // Esoteric/mystical meaning
    psychological: string;  // Inner/meditative meaning
  }
}
```

## Example: Rigveda 1.1

See `/src/data/expandedHymns.ts` for a complete example of the first hymn to Agni.

Key features demonstrated:
- Full word-by-word analysis
- Three different translations (Griffith, Doniger, Aurobindo)
- Multi-level symbolism (Agni as fire, mediator, consciousness)
- Commentaries from traditional (Sayana) and modern sources
- Practical applications for meditation
- Discussion questions for study groups

## Using the Data Model

### Accessing Expanded Hymns

```typescript
import { getExpandedHymn, getExpandedHymnByReference } from '@/data/expandedHymns';

// By ID
const hymn = getExpandedHymn('rv-1-1');

// By reference
const hymn = getExpandedHymnByReference(1, 1); // Mandala 1, Sukta 1
```

### Converting to Simple Format

```typescript
import { toSimpleHymn } from '@/lib/hymnAdapter';

const simpleHymn = toSimpleHymn(expandedHymn);
// Use with existing UI components
```

### Searching and Filtering

```typescript
import { searchHymns, getHymnsByDeity, getHymnsByTheme } from '@/lib/hymnAdapter';

// Full-text search
const results = searchHymns(allHymns, 'cosmic order');

// By deity
const agniHymns = getHymnsByDeity(allHymns, 'Agni');

// By theme
const sacrificeHymns = getHymnsByTheme(allHymns, 'Sacrifice as Transformation');
```

### Generating Study Plans

```typescript
import { generateStudyPlan } from '@/lib/hymnAdapter';

const plan = generateStudyPlan(hymn);
// Returns step-by-step guide based on difficulty level
```

## Data Entry Guidelines

### Creating New Hymns

When adding new hymns to the dataset:

1. **Start with basics**: ID, mandala, sukta, rishi, devata, chhandas
2. **Add core content**: Sanskrit text, transliteration, at least one translation
3. **Provide context**: Historical background, main themes
4. **Add learning aids**: Key terms, discussion questions
5. **Enhance gradually**: Add commentaries, symbolism, scholarly notes over time

### Quality Standards

- **Sanskrit**: Use proper Devanagari (not romanized)
- **Transliteration**: Follow IAST standard consistently
- **Translations**: Cite sources with translator name and year
- **Context**: Minimum 2-3 sentences of historical/philosophical context
- **Symbolism**: At least literal and spiritual levels
- **Key terms**: Define 3-5 most important terms per hymn

### Metadata Guidelines

**Difficulty Levels:**
- `beginner`: Short hymns (1-5 verses), clear themes, basic vocabulary
- `intermediate`: Medium hymns (6-15 verses), multiple themes, some complex concepts
- `advanced`: Long hymns (15+ verses), deep philosophy, requires background knowledge

**Tags:**
- Use existing tags when possible for consistency
- Include: deity name, meter type, rishi, main themes
- Limit to 5-10 tags per hymn

**Estimated Study Time:**
- Beginner: 15-30 minutes
- Intermediate: 30-60 minutes
- Advanced: 60-120 minutes

## Integration with Existing Code

### Backward Compatibility

All existing components using `SimpleHymn` continue to work:

```typescript
// Old code still works
import { getTodaysStory } from '@/lib/storySelector';
const story = getTodaysStory(nakshatra, tithi, paksha);
```

### Gradual Migration

New features can use expanded data while old features use simple:

```typescript
// In a new detailed view component
import { getExpandedHymn } from '@/data/expandedHymns';
const expanded = getExpandedHymn(story.id);

if (expanded) {
  // Show rich content
  showExpandedView(expanded);
} else {
  // Fall back to simple view
  showSimpleView(story);
}
```

## Future Enhancements

### Planned Features

1. **User annotations**: Personal notes and insights
2. **Study tracking**: Progress monitoring, time tracking
3. **Collections**: Curated playlists of hymns by theme
4. **Deity database**: Comprehensive deity information
5. **Rishi database**: Information about seers
6. **Cross-reference engine**: Automated linking of related content

### Data Expansion

- Currently: 1 fully expanded hymn (RV 1.1)
- Short term goal: 10 expanded hymns (key hymns from each mandala)
- Medium term: 50 expanded hymns (major deities and themes)
- Long term: All 1,028 hymns with varying levels of detail

## Contributing

### Adding Translations

When adding new translations:
1. Include translator name
2. Add publication year
3. Specify interpretation type (literal/poetic/esoteric)
4. Maintain consistent formatting

### Adding Commentaries

When adding commentaries:
1. Cite author and tradition
2. Specify focus area (ritual/philosophical/linguistic)
3. Keep text concise but substantive
4. Balance traditional and modern sources

### Scholarly Notes

When adding scholarly notes:
1. Focus on one topic per note
2. Include at least one source
3. Explain relevance to understanding
4. Use accessible language

## Technical Details

### File Structure

```
/src
  /types
    rigveda.ts          # All TypeScript interfaces
  /data
    expandedHymns.ts    # Expanded hymn data
    rigvedaHymns.ts     # Simple hymn data (legacy)
  /lib
    hymnAdapter.ts      # Conversion and utility functions
    storySelector.ts    # Daily hymn selection logic
```

### Type Safety

All hymn data is fully typed with TypeScript, ensuring:
- Compile-time validation
- Autocomplete in editors
- Prevention of data errors
- Self-documenting code

### Performance Considerations

- **Lazy loading**: Load expanded data only when needed
- **Indexing**: Fast lookup by ID, mandala/sukta, deity, theme
- **Caching**: Results of search and filter operations
- **Bundling**: Expanded data can be code-split for smaller initial load

## References

### Traditional Sources
- Sayana's Commentary (14th century)
- Yaska's Nirukta (5th-6th century BCE)
- Various Vedic indices and concordances

### Modern Translations
- Ralph T.H. Griffith (1896)
- Wendy Doniger O'Flaherty (1981)
- Stephanie W. Jamison & Joel P. Brereton (2014)
- Sri Aurobindo (1998)

### Academic Resources
- Vedic Index by Macdonell & Keith
- The Rigveda: A Historical Analysis by S.S. Misra
- Vedic Meter and Verse by W.D. Whitney

## License and Attribution

All traditional texts are in public domain. Modern translations and commentaries should be properly attributed. Consult copyright status before adding recent scholarly work.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Maintainer**: Vedic Lunar Clock Development Team
