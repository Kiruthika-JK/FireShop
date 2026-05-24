// Script to update product categories and SEO based on the new category structure
const fs = require('fs');
const path = require('path');

// Load the current products data
const productsPath = path.join(__dirname, 'products-updated-categories.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// New category mapping based on the price list structure
const categoryMapping = {
  // SPARKLERS (1-15)
  '12 Cm Electric Sparklers': 'sparklers',
  '12 Cm Colour Sparklers': 'sparklers',
  '12 Cm Green Sparklers': 'sparklers',
  '12 Cm Red Sparklers': 'sparklers',
  '15 Cm Electric Sparklers': 'sparklers',
  '15 Cm Colour Sparklers': 'sparklers',
  '15 Cm Green Sparklers': 'sparklers',
  '15 Cm Red Sparklers': 'sparklers',
  '30 Cm Electric Sparklers': 'sparklers',
  '30 Cm Colour Sparklers': 'sparklers',
  '30 Cm Green Sparklers': 'sparklers',
  '30 Cm Red Sparklers': 'sparklers',
  '50 Cm Electric Sparklers': 'sparklers',
  '50 Cm Colour Sparklers': 'sparklers',
  'Rotating Sparklers': 'sparklers',

  // FLOWER POTS (16-30)
  'Flower Pots Small': 'flowerpots',
  'Flower Pots Big': 'flowerpots',
  'Flower Pots Special': 'flowerpots',
  'Flower Pots Asoka': 'flowerpots',
  'Flower Pots Giant': 'flowerpots',
  'Flower Pots Deluxe': 'flowerpots',
  'Flower Pots Super Deluxe': 'flowerpots',
  'Colour Koti': 'flowerpots',
  'Colour Koti Deluxe': 'flowerpots',
  'Rangeela': 'flowerpots',
  'Lucky/Jersey Red & Green': 'flowerpots',
  'Tri Colour': 'flowerpots',
  'Motu Patlu/Pop Eye Tricolour': 'flowerpots',
  'Monster Koti DLX': 'flowerpots',
  'Ganga Jamuna': 'flowerpotbombs',

  // CHAKRA (31-41)
  'Ground Chakkar Big': 'chakra',
  'Ground Chakkar Asoka': 'chakra',
  'Ground Chakkar Special': 'chakra',
  'Ground Chakkar Deluxe': 'chakra',
  'Whizzling Wheel': 'chakra',
  '4*4 Wheel': 'chakra',
  'Hot Wheels': 'chakra',
  'Disco Wheel': 'chakra',
  'Win Wheel Mini': 'chakra',
  'Win Wheel Max': 'chakra',
  'Win Wheel Super': 'chakra',

  // PEACOCKS (42-43)
  'Peacock Red and Green': 'peacocks',
  'Bada Peacock 5In 1': 'peacocks',

  // PENCIL (44-50)
  'Hi Tech (Red&Green) Crackling': 'pencil',
  'Wonderla (White) Crackling': 'pencil',
  'Baby Mix Crackling': 'pencil',
  'Pop Corn': 'pencil',
  'Water Falls': 'pencil',
  '15" Navrang Pencil': 'pencil',
  'Selfie Stick': 'pencil',

  // BIJILI (51-52)
  'Red Bijili Crackers': 'bijili',
  'Stripped Bijili Crackers': 'bijili',

  // TWINKLING STAR (53-54)
  '1 1/2" Twinkling Star': 'twinklingstar',
  '4" Twinkling Star': 'twinklingstar',

  // SPECIAL CELEBRATION FUNCTION (55)
  '10*10 Shot': 'specialcelebrationfunction',

  // BOMBS (56-63)
  'King Bomb': 'bombs',
  'King Of Kango': 'bombs',
  'DTX': 'bombs',
  'Dinosour Bomb': 'bombs',
  'Classic/Jug-Mug 5000 5G': 'bombs',
  'Paper Bomb (Adiyal) 1/4 Kg': 'bombs',
  'Paper Bomb (Adiyal) 1/2 Kg': 'bombs',
  'Paper Bomb (Adiyal) 1 Kg': 'bombs',

  // SOUND CRACKERS (64-70)
  '2 3/4" Kuruvi': 'soundcrackers',
  '3 1/2" Lakshmi': 'soundcrackers',
  '4" Lakshmi': 'soundcrackers',
  '4" Deluxe Lakshmi': 'soundcrackers',
  '4" Gold Lakshmi': 'soundcrackers',
  '5" Jallikattu/Vikram/Ganesh': 'soundcrackers',
  '2 Sound Crackers': 'soundcrackers',
  'Rocket Bomb': 'rockets',
  'Lunik Express': 'rockets',
  'Musical Rocket': 'rockets',
  'Penta Dhamaka': 'aerialshot',
  'Sky Wala': 'aerialshot',
  'Sky King': 'aerialshot',
  'Star World': 'aerialshot',
  'White House': 'aerialshot',
  'Golden Coin': 'aerialshot',
  'Sun Rise': 'aerialshot',
  '7 Shot': 'aerialshot',
  'Fanch Damaka': 'aerialshot',
  '12 Shot - Crackling Rider': 'aerialshot',
  '12 - Multicolour Shot': 'aerialshot',
  '25 - Crackling Rider': 'aerialshot',
  '50 - Crackling Rider': 'aerialshot',
  '30 - Multicolour Shot': 'aerialshot',
  '60 - Multicolour Shot': 'aerialshot',
  '120 - Multicolour Shot': 'aerialshot',
  '240 - Multicolour Shot': 'aerialshot',

  // AERIAL SHOT (87-105)
  'Chotta Fancy': 'aerialshot',
  '2" Single': 'aerialshot',
  '2" 3Pcs': 'aerialshot',
  '3 1/2" Fancy Single': 'aerialshot',
  '3 1/2" Fancy': 'aerialshot',
  '3 1/2" Seven Steps': 'aerialshot',
  '3 1/2" Double Ball': 'aerialshot',
  '3 1/2" Nayagara': 'aerialshot',
  '4" Fancy Single': 'aerialshot',
  '4" Fancy': 'aerialshot',
  '5" Fancy Single': 'aerialshot',
  '5" Fancy': 'aerialshot',
  '6" Water Queen': 'tinseries',
  'Festival Party': 'tinseries',
  'Tin': 'tinseries',
  'Siren': 'whistlingfountain',
  'Mega Siren': 'whistlingfountain',
  'Pogo/Jolly Rancher/Tom&Cherry': 'cracklingfountain',
  'Angry Bird/Scooby-doo/KurKur': 'cracklingfountain',
  'Starpots': 'cracklingfountain',

  // CRACKLING FOUNTAINS (106-120)
  'Diamond Buster': 'cracklingfountain',
  'Glorious Green': 'cracklingfountain',
  'Gold Monets': 'cracklingfountain',
  'volvo Red': 'cracklingfountain',
  'Amaze': 'cracklingfountain',
  'Sun Feast-Red,Green,Gold,White,Red&Green': 'cracklingfountain',
  'Red Bloom/kit kat Red': 'cracklingfountain',
  'Reen Garden/Green Flash/Tic Tac Mint': 'cracklingfountain',
  'Red Sun/Little Fish/Dairy Milk': 'cracklingfountain',
  'Gold Feast/Gold Coin/5 Star': 'cracklingfountain',
  'Blue Ice/Silver Moon/Milky Bar': 'cracklingfountain',
  'Miss Butterfly': 'cracklingfountain',
  'Kinster/Jigarthanda': 'cracklingfountain',
  'Peacock Tail': 'cracklingfountain',
  'Electric Stone': 'cracklingfountain',
  'Snake Egg': 'cracklingfountain',

  // WHISTLING FOUNTAIN (106-107)
  'Siren': 'whistlingfountain',
  'Mega Siren': 'whistlingfountain',

  // DOUBLE WONDER FUNCTIONS (127-130)
  'Gold Fish 2in1': 'cracklingfountain',
  'Croods Fish 2in1': 'cracklingfountain',
  'Angel Time 2in1': 'cracklingfountain',
  '8" Triple Monkey 3in 1': 'cracklingfountain',

  // MEGA CRACKLING FOUNTAIN (131-138)
  '6000': 'cracklingfountain',
  'Tweet': 'cracklingfountain',
  'Poppings': 'cracklingfountain',
  'Golden Peacock': 'cracklingfountain',
  'Star Show Crackling': 'cracklingfountain',
  'White Crackling': 'cracklingfountain',
  'Autumn Rain': 'cracklingfountain',
  'Winter Rain': 'cracklingfountain',
  'Rain & Shin': 'cracklingfountain',
  'Jelly Belly': 'cracklingfountain',
  'Crack Jack': 'cracklingfountain',
  'Tik Tok': 'cracklingfountain',
  // CHILDREN NOVELTIES (143-158)
  'Photo Flash': 'childrennovelty',
  'Helicopter': 'childrennovelty',
  'Bambaram': 'childrennovelty',
  'Butterfly': 'childrennovelty',
  'Drone': 'childrennovelty',
  'Bim Bam Crackling/Mad Max': 'childrennovelty',
  'Rainbow Colour Smoke': 'childrennovelty',
  'Dora Singer': 'childrennovelty',
  'Kit Kat': 'childrennovelty',
  'Assorted Cartoon': 'childrennovelty',
  'Bat and Ball': 'childrennovelty',
  'Fire Egg': 'childrennovelty',
  'Hammer of Thor': 'childrennovelty',
  'Sowrd': 'childrennovelty',
  'Money Bank': 'childrennovelty',
  'Mony Plast/Mangatha': 'childrennovelty',

  // DIGITAL WALA (159-160)
  'Magic Whip': 'digitalwala',
  'Kungfu Deluxe': 'digitalwala',

  // FANCY FOUNTAIN (161-165)
  'Moon Droops': 'cracklingfountain',
  'Feather Droops': 'cracklingfountain',
  'Golden Drops': 'cracklingfountain',
  'Peacock Feather': 'cracklingfountain',
  'Touch and Touch': 'cracklingfountain',

  // COLOUR MATCH BOX (166-168)
  'Sachin Small': 'childrennovelty',
  'Lion Delux': 'childrennovelty',
  'Royal Giant': 'childrennovelty',

  // GIFT BOXES (169-172)
  '25 - Items': 'giftbox',
  '32 - Items': 'giftbox',
  '42 - Items': 'giftbox',
  '50 - Items': 'giftbox'
};

// Function to get category position
function getCategoryPosition(category) {
  const positions = {
    'sparklers': 1,
    'flowerpots': 2,
    'flowerpotbombs': 3,
    'chakra': 4,
    'peacocks': 5,
    'pencil': 6,
    'bijili': 7,
    'twinklingstar': 8,
    'specialcelebrationfunction': 9,
    'bombs': 10,
    'soundcrackers': 11,
    'rockets': 12,
    'aerialshot': 13,
    'tinseries': 14,
    'whistlingfountain': 15,
    'cracklingfountain': 16,
    'digitalwala': 17,
    'childrennovelty': 18,
    'giftbox': 19
  };
  return positions[category] || 999;
}

// Function to generate SEO data for a product
function generateSEOData(product, category) {
  const tamilNames = getTamilNamesForCategory(category);
  const baseName = product.name.toLowerCase().replace(/[^\w\s]/gi, '');
  const keywords = [
    product.name,
    category,
    ...tamilNames,
    'diwali crackers',
    'deepavali pattasu',
    'tamil nadu crackers',
    'sivakasi crackers',
    'online crackers',
    'buy crackers online',
    'diwali fireworks',
    'best crackers',
    'quality crackers'
  ];

  return {
    seoTitle: `${product.name} - Premium ${category.charAt(0).toUpperCase() + category.slice(1)} Sivakasi | Best Quality Crackers`,
    seoDescription: `Buy ${product.name} at lowest price in Sivakasi. Premium quality ${category} crackers with ${product.discountPercent || 80}% discount. Fast delivery across Tamil Nadu and India. Best for Diwali celebrations.`,
    seoKeywords: keywords.join(', '),
    metaTitle: `${product.name} Sivakasi - ${product.discountPercent || 80}% OFF | Premium Diwali Crackers`,
    metaDescription: `Purchase ${product.name} at ${product.discountPercent || 80}% discount. Premium quality ${category} from Sivakasi with amazing effects. Fast delivery across India. Trusted by thousands.`,
    canonicalUrl: `/product/${baseName.toLowerCase().replace(/\s+/g, '-')}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": `Premium quality ${category} from Sivakasi, perfect for Diwali celebrations`,
      "brand": "Ganishkha Crackers",
      "manufacturer": "Ganishkhasri Traders Sivakasi",
      "category": "Fireworks",
      "offers": {
        "@type": "Offer",
        "price": product.price.toString(),
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    }
  };
}

// Function to get Tamil names for category
function getTamilNamesForCategory(category) {
  const tamilNames = {
    'sparklers': ['kambi mathappu', 'kambi', 'mathappu'],
    'flowerpots': ['bushvanam', 'poo chakram', 'malai pookal'],
    'groundchakkar': ['chakram', 'surang chakram', 'nagar chakram', 'wheel', 'whizzling wheel', 'hot wheel', 'win wheel'],
    'peacocks': ['mayil', 'peacock', 'mayil poo'],
    'bijili': ['bijili', 'flash bijili', 'electric bijili'],
    'twinklingstar': ['twinkling star', 'star', 'natchathiram'],
    'pencil': ['pencil', 'pencil shot', 'pencil vedikai'],
    'bombs': ['saram', 'atom bomb', 'lakshmi bomb'],
    'saravadi': ['saravadi', 'saram', 'atom saram'],
    'rockets': ['rocket', 'suthi rocket', 'musical rocket'],
    'aerialshot': ['aerial shot', 'sky shot', 'multicolour shot', 'night aerial', 'sky wala', 'star world'],
    'whistlingfountain': ['whistling fountain', 'whistle', 'suthi fountain'],
    'cracklingfountain': ['crackling fountain', 'crackle', 'pattasu fountain', 'double wonder', '2 in 1', 'mega crackling', 'big crackling'],
    'digitalwala': ['digital wala', 'digital crackers', 'electronic crackers'],
    'childrenNovelty': ['children special', 'kids special', 'kulanthai special', 'baby special', 'pilla special'],
    'giftbox': ['gift box', 'combo', 'diwali pack']
  };
  return tamilNames[category] || [];
}

// Update products with new categories and SEO
const updatedProducts = products.map((product, index) => {
  const productName = product.name;
  let newCategory = 'novelty'; // default fallback
  
  // Find matching category
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      newCategory = value;
      break;
    }
  }
  
  // Generate product position within category
  const categoryProducts = products.filter(p => {
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (p.name.toLowerCase().includes(key.toLowerCase())) {
        return value === newCategory;
      }
    }
    return false;
  });
  
  const productPosition = categoryProducts.findIndex(p => p.name === productName) + 1;
  
  // Generate SEO data
  const seoData = generateSEOData(product, newCategory);
  
  return {
    ...product,
    category: newCategory,
    categoryPosition: getCategoryPosition(newCategory),
    productPosition: productPosition,
    youtubeVideoId: "", // Empty string to prevent undefined error
    videoThumbnail: "", // Empty string to prevent undefined error
    videoTitle: "", // Empty string to prevent undefined error
    videoDescription: "", // Empty string to prevent undefined error
    videoTags: [], // Empty array to prevent undefined error
    videoDuration: "", // Empty string to prevent undefined error
    videoViews: 0, // Default value to prevent undefined error
    videoLikes: 0, // Default value to prevent undefined error
    videoComments: 0, // Default value to prevent undefined error
    videoPublishedAt: "", // Empty string to prevent undefined error
    videoChannelId: "", // Empty string to prevent undefined error
    videoChannelTitle: "", // Empty string to prevent undefined error
    ...seoData
  };
});

// Save updated products
const outputPath = path.join(__dirname, 'products-updated-categories.json');
fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));

console.log(`Updated ${updatedProducts.length} products with new categories and SEO`);
console.log(`Output saved to: ${outputPath}`);

// Category summary
const categorySummary = {};
updatedProducts.forEach(product => {
  if (!categorySummary[product.category]) {
    categorySummary[product.category] = 0;
  }
  categorySummary[product.category]++;
});

console.log('\nCategory Summary:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`${category}: ${count} products`);
});
