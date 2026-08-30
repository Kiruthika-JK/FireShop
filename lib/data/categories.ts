export interface Category {
  slug: string;
  name: string;
}

export const categories: Category[] = [
  { slug: 'sparklers', name: 'Sparklers' },
  { slug: 'flower-pots', name: 'Flower Pots' },
  { slug: 'ground-chakkar', name: 'Chakra' },
  { slug: 'bombs', name: 'Bombs' },
  { slug: 'rockets', name: 'Rockets' },
  { slug: 'aerial-shots', name: 'Aerial Shots' },
  { slug: 'aerial-fancy-shots', name: 'Aerial Fancy Shots' },
  { slug: 'crackling-fountain', name: 'Crackling Fountain' },
  { slug: 'fancy-fountain', name: 'Fancy Fountain' },
  { slug: 'whistling-fountains', name: 'Whistling Fountains' },
  { slug: 'whistling-shots', name: 'Whistling Shots' },
  { slug: 'pencil', name: 'Pencil' },
  { slug: 'twinkling-stars', name: 'Twinkling Stars' },
  { slug: 'sound-crackers', name: 'Sound Crackers' },
  { slug: 'bijili', name: 'Bijili' },
  { slug: 'double-attraction', name: 'Double Attraction' },
  { slug: 'double-wonder', name: 'Double Wonder' },
  { slug: 'night-aerial-function', name: 'Night Aerial Function' },
  { slug: 'peacocks', name: 'Peacocks' },
  { slug: 'children-novelties', name: 'Children Novelties' },
  { slug: 'tin-series', name: 'Tin Series' },
  { slug: 'colour-match-box', name: 'Colour Match Box' },
  { slug: 'flower-pot-bombs', name: 'Flower Pot Bombs' },
  { slug: 'gift-boxes', name: 'Gift Boxes' },
  { slug: 'special-celebration-function', name: 'Special Celebration Function' },
];

function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[-\s]+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const exact = categories.find((c) => c.slug === slug.toLowerCase());
  if (exact) return exact;

  const key = normalizeSlug(slug);
  return categories.find(
    (c) => normalizeSlug(c.slug) === key || normalizeSlug(c.name) === key
  );
}

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
