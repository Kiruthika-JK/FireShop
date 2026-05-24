// Tamil cracker names mapping for SEO optimization in Tamil Nadu market
export const TAMIL_CRACKER_NAMES = {
  // Categories
  categories: {
    'sparklers': ['kambi mathappu', 'kambi', 'mathappu', 'kambi potti', 'veesal kambi', 'chinnak kambi'],
    'flowerpots': ['bushvanam', 'poo chakram', 'malai pookal', 'seval poo', 'mayil poo', 'poo pothi'],
    'groundchakkar': ['ground chakram', 'surang chakram', 'nagar chakram', 'brahma chakram', 'vishnu chakram', 'wheel', 'whizzling wheel', 'hot wheel', 'win wheel'],
    'peacocks': ['mayil', 'peacock', 'mayil poo', 'seval', 'kili poo', 'mayil kol'],
    'bijili': ['bijili', 'mini bijili', 'flash bijili', 'lightning', 'electric bijili', 'bijili crackers'],
    'twinklingstar': ['twinkling star', 'star', 'natchathiram', 'kokku star', 'flash star', 'glow star'],
    'pencil': ['pencil', 'pencil shot', 'pencil vedikai', 'pencil cracker', 'pencil bomb', 'pencil fire'],
    'bombs': ['saram', 'atom bomb', 'lakshmi bomb', 'hydro bomb', 'thala bomb', 'kili bomb'],
    'saravadi': ['sound crackers', 'one sound', 'two sound', 'saravadi', 'saram', 'atom saram', 'hydro saram', 'lakshmi saram', 'king saram'],
    'rockets': ['rocket', 'suthi rocket', 'thooku rocket', 'parai rocket', 'nagar rocket', 'musical rocket'],
    'aerialshot': ['aerial shot', 'sky shot', 'open sky', 'heaven burst', 'sky burst', 'cloud burst', 'night aerial', 'night sky', 'sky wala', 'star world'],
    'whistlingfountain': ['whistling fountain', 'whistle', 'suthi fountain', 'musical fountain', 'sound fountain'],
    'cracklingfountain': ['crackling fountain', 'crackle', 'pattasu fountain', 'sound fountain', 'pop fountain', 'double wonder', '2 in 1', 'mega crackling', 'big crackling', 'super crackling', 'crackling star', 'crackling show'],
    'digitalwala': ['digital wala', 'digital crackers', 'digital saram', 'digital vedikai', 'electronic crackers'],
    'childrennovelty': ['children special', 'kids special', 'kulanthai special', 'baby special', 'pilla special'],
    'giftbox': ['gift box', 'combo', 'pack', 'diwali pack', 'festival pack', 'family combo']
  },

  // Product-specific Tamil names
  products: {
    // Sparklers
    '30 cm electric sparklers': ['30 kambi mathappu', 'electric kambi', 'veesal kambi 30', 'big kambi'],
    '15 cm red sparklers': ['15 kambi mathappu', 'red kambi', 'senk kambi', 'chinnak kambi'],
    'multi color sparklers': ['color kambi', 'rang kambi', 'multicolor mathappu', 'siruk kambi'],
    
    // Flower Pots
    'big flower pot': ['peria bushvanam', 'big poo chakram', 'malai bushvanam', 'seval bushvanam'],
    'small flower pot': ['chinna bushvanam', 'small poo chakram', 'kutty bushvanam'],
    'multi color flower pot': ['color bushvanam', 'rang poo chakram', 'multicolor malai'],
    
    // Bombs
    'atom bomb': ['atom saram', 'big bomb', 'peria saram', 'hydro bomb'],
    'lakshmi bomb': ['lakshmi saram', 'lakshmi vedikai', 'dhana bomb'],
    'hydro bomb': ['hydro saram', 'water bomb', 'neer saram'],
    
    // Chakras
    '7 shot chakram': ['7 surang chakram', '7 shot', 'ethu surang'],
    '5 shot chakram': ['5 surang chakram', '5 shot', 'anju surang'],
    '3 shot chakram': ['3 surang chakram', '3 shot', 'moonu surang'],
    
    // Rockets
    'big rocket': ['peria rocket', 'big suthi', 'malai rocket'],
    'small rocket': ['chinna rocket', 'small suthi', 'kutty rocket'],
    'whistling rocket': ['siru rocket', 'whistle rocket', 'parai rocket'],
    
    // Aerial
    'sky shot': ['sky shot', 'open sky', 'megam vedikai'],
    'cloud burst': ['cloud burst', 'megam burst', 'sky burst'],
    'heaven burst': ['heaven burst', 'swargam vedikai', 'open sky'],
    
    // Novelty
    'fancy items': ['fancy', 'novelty', 'kids special', 'children fancy'],
    'children special': ['kids special', 'kulanthai special', 'pilla special'],
    'family pack': ['family pack', 'kudumbam pack', 'family combo'],
    
    // Gift Boxes
    'diwali combo': ['diwali combo', 'diwali pack', 'deepavali combo'],
    'festival pack': ['festival pack', 'pongal pack', 'festival combo'],
    'economy pack': ['economy pack', 'cheap pack', 'budget combo']
  },

  // Common Tamil search terms
  searchTerms: [
    'kambi', 'mathappu', 'bushvanam', 'saram', 'saravadi', 'chakram', 'rocket', 'aerial',
    'diwali', 'deepavali', 'vedikai', 'pattasu', 'bijili', 'mayil', 'seval', 'kili',
    'crackers', 'pataasu', 'pattasu', 'fireworks', 'malai', 'senk', 'peria', 'chinna',
    'wheel', 'pencil', 'star', 'natchathiram', 'digital', 'combo', 'pack', 'gift',
    'fancy', 'kids', 'family', 'economy', 'budget', 'cheap', 'best', 'special'
  ]
};

// Function to get Tamil names for a category
export function getTamilNames(category: string): string[] {
  return TAMIL_CRACKER_NAMES.categories[category as keyof typeof TAMIL_CRACKER_NAMES.categories] || [];
}

// Function to get Tamil names for a product
export function getTamilProductNames(productName: string): string[] {
  // Try exact match first
  if (TAMIL_CRACKER_NAMES.products[productName as keyof typeof TAMIL_CRACKER_NAMES.products]) {
    return TAMIL_CRACKER_NAMES.products[productName as keyof typeof TAMIL_CRACKER_NAMES.products];
  }
  
  // Try partial matches
  const tamilNames: string[] = [];
  const lowerProductName = productName.toLowerCase();
  
  Object.entries(TAMIL_CRACKER_NAMES.products).forEach(([key, names]) => {
    if (key.toLowerCase().includes(lowerProductName) || lowerProductName.includes(key.toLowerCase())) {
      tamilNames.push(...names);
    }
  });
  
  return tamilNames;
}

// Function to check if a search term matches Tamil names
export function matchesTamilNames(searchTerm: string, category?: string, productName?: string): boolean {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Check against common search terms
  if (TAMIL_CRACKER_NAMES.searchTerms.some(term => term.includes(lowerSearchTerm) || lowerSearchTerm.includes(term))) {
    return true;
  }
  
  // Check against category Tamil names
  if (category) {
    const categoryTamilNames = getTamilNames(category);
    if (categoryTamilNames.some(name => name.toLowerCase().includes(lowerSearchTerm) || lowerSearchTerm.includes(name.toLowerCase()))) {
      return true;
    }
  }
  
  // Check against product Tamil names
  if (productName) {
    const productTamilNames = getTamilProductNames(productName);
    if (productTamilNames.some(name => name.toLowerCase().includes(lowerSearchTerm) || lowerSearchTerm.includes(name.toLowerCase()))) {
      return true;
    }
  }
  
  return false;
}
