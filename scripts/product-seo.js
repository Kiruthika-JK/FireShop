const siteUrl = 'https://www.ganishkhasricrackers.in';
const brand = 'Ganishkha Sri Crackers';
const brandAlternates = [
  'Ganishka Sri Crackers',
  'Ganishka Crackers',
  'Kanishka Crackers',
  'Kanishka Sri Crackers',
  'Kanishkaa Crackers',
  'Ganiska Crackers',
  'Ganiskha Crackers',
  'Ganishka Traders',
  'Kanishka Traders',
];

const categoryTamil = {
  'sparklers': ['kambi mathappu', 'kambi', 'mathappu', 'kambi potti', 'veesal kambi'],
  'flowerpots': ['bushvanam', 'poo chakram', 'malai pookal', 'seval poo', 'mayil poo'],
  'groundchakkar': ['ground chakram', 'surang chakram', 'nagar chakram', 'brahma chakram', 'wheel'],
  'peacocks': ['mayil', 'peacock', 'mayil poo', 'seval', 'kili poo'],
  'bijili': ['bijili', 'mini bijili', 'flash bijili', 'electric bijili', 'bijili crackers'],
  'twinklingstar': ['twinkling star', 'star', 'natchathiram', 'kokku star', 'flash star'],
  'pencil': ['pencil', 'pencil shot', 'pencil vedikai', 'pencil cracker', 'pencil fire'],
  'bombs': ['saram', 'atom bomb', 'lakshmi bomb', 'hydro bomb', 'thala bomb'],
  'saravadi': ['sound crackers', 'one sound', 'two sound', 'saravadi', 'saram', 'hydro saram'],
  'rockets': ['rocket', 'suthi rocket', 'thooku rocket', 'parai rocket', 'musical rocket'],
  'aerialshot': ['aerial shot', 'sky shot', 'open sky', 'heaven burst', 'sky burst', 'night aerial'],
  'whistlingfountain': ['whistling fountain', 'whistle', 'suthi fountain', 'musical fountain'],
  'cracklingfountain': ['crackling fountain', 'crackle', 'pattasu fountain', 'double wonder', 'mega crackling'],
  'digitalwala': ['digital wala', 'digital crackers', 'digital saram', 'digital vedikai', 'electronic crackers'],
  'childrennovelty': ['children special', 'kids special', 'kulanthai special', 'baby special', 'pilla special'],
  'giftbox': ['gift box', 'combo', 'pack', 'diwali pack', 'festival pack', 'family combo'],
};

const commonTamil = ['kambi', 'mathappu', 'bushvanam', 'saram', 'saravadi', 'chakram', 'rocket', 'aerial',
  'diwali', 'deepavali', 'vedikai', 'pattasu', 'bijili', 'mayil', 'seval', 'kili', 'crackers', 'pataasu',
  'fireworks', 'malai', 'peria', 'chinna', 'wheel', 'pencil', 'star', 'natchathiram', 'digital', 'combo',
  'pack', 'gift', 'fancy', 'kids', 'family'];

function normalizeCat(cat) {
  return (cat || '').toString().toLowerCase().replace(/[^a-z]/g, '');
}

function dedupe(arr) {
  return Array.from(new Set(arr.map(s => s.toLowerCase().trim())));
}

function getTamilNames(category) {
  const key = normalizeCat(category);
  return categoryTamil[key] || [];
}

function tokenize(str) {
  return (str || '').split(/[\s\(\)\/&,-]+/).filter(Boolean);
}

function generateProductSEO(product, id) {
  const name = (product.name || '').replace(/\s+/g, ' ').trim();
  const category = (product.category || '').replace(/\s+/g, ' ').trim();
  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;
  const content = product.content || '1 Box';
  const thumbnail = product.thumbnail || '/logo.png';
  const canonicalUrl = `${siteUrl}/product/${id}`;

  const tamilNames = dedupe([...getTamilNames(category), ...commonTamil]);
  const title = `${name} - Buy ${category} Online | ${brand}`;
  const description = `Buy ${name} at ${price > 0 ? `₹${price}` : 'wholesale price'}. ${content} of premium quality ${category} from Sivakasi. Fast delivery across Tamil Nadu & India. Contact 82488 17401, 81481 65318.`;

  const keywords = dedupe([
    name,
    category,
    brand,
    'Ganishkha Sri Traders',
    ...brandAlternates,
    'Sivakasi crackers',
    'buy crackers online',
    'Diwali crackers',
    'Deepavali pattasu',
    'wholesale crackers',
    'factory price crackers',
    'Tamil Nadu fireworks',
    ...tokenize(name),
    ...tokenize(category),
    ...tamilNames,
  ]).filter(k => k.length > 1).join(', ');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    alternateName: brandAlternates,
    image: thumbnail.startsWith('http') ? thumbnail : `${siteUrl}${thumbnail}`,
    description,
    brand: { '@type': 'Brand', name: brand, alternateName: brandAlternates },
    category,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: canonicalUrl,
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'LocalBusiness',
        name: `${brand} - Ganishkha Sri Traders`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Chinnakamanpatti, Sattur Road',
          addressLocality: 'Sivakasi',
          addressRegion: 'Tamil Nadu',
          postalCode: '626189',
          addressCountry: 'IN',
        },
        telephone: '+918248817401',
      },
    },
  };

  if (price > 0 && originalPrice > 0) {
    structuredData.aggregateOffer = {
      '@type': 'AggregateOffer',
      lowPrice: price.toString(),
      highPrice: originalPrice.toString(),
      priceCurrency: 'INR',
      availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    };
  }

  return {
    seoTitle: title,
    seoDescription: description,
    seoKeywords: keywords,
    metaTitle: title,
    metaDescription: description,
    canonicalUrl,
    structuredData,
  };
}

module.exports = { generateProductSEO, normalizeCat };
