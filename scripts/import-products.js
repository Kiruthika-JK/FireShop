const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, writeBatch, doc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDwLF6i3Br1IN5maBcfpqKUz3ZDxyX6uw",
  authDomain: "ganishkha-crackers-store.firebaseapp.com",
  projectId: "ganishkha-crackers-store",
  storageBucket: "ganishkha-crackers-store.firebasestorage.app",
  messagingSenderId: "109389928446",
  appId: "1:109389928446:web:dd2d7ea7f660a1decfd2af",
  measurementId: "G-RMHTSTXCJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Parse your product data
const productData = `S.No Procdut Name Content Price SPARKLERS Discount@ 80% Final Price Quantity Amount 
1 12 Cm Electric Sparklers (10Pcs) 1 Box 110 88.2 22
2 12 Cm Colour Sparklers (10Pcs) 1 Box 126 100.8 25
3 12 Cm Green Sparklers (10Pcs) 1 Box 142 113.4 28
4 12 Cm Red Sparklers (10Pcs) 1 Box 158 126 32
5 15 Cm Electric Sparklers (10Pcs) 1 Box 173 138.6 35
6 15 Cm Colour Sparklers (10Pcs) 1 Box 189 151.2 38
7 15 Cm Green Sparklers (10Pcs) 1 Box 236 189 47
8 15 Cm Red Sparklers (10Pcs) 1 Box 247 197.4 49
9 30 Cm Electric Sparklers (5Pcs) 1 Box 173 138.6 35
10 30 Cm Colour Sparklers (5Pcs) 1 Box 189 151.2 38
11 30 Cm Green Sparklers (5Pcs) 1 Box 236 189 47
12 30 Cm Red Sparklers (5Pcs) 1 Box 247 197.4 49
13 50 Cm Electric Sparklers (5Pcs) 1 Box 735 588 147
14 50 Cm Colour Sparklers (5Pcs) 1 Box 814 651 163
15 Rotating Sparklers (1Pcs) 1 Box 866 693 173
16 Flower Pots Small (10Pcs) 1 Box 210 168 42
17 Flower Pots Big (10Pcs) 1 Box 310 247.8 62
18 Flower Pots Special (10Pcs) 1 Box 473 378 95
19 Flower Pots Asoka (10Pcs) 1 Box 525 420 105
20 Flower Pots Giant (10Pcs) 1 Box 662 529.2 132
21 Flower Pots Deluxe (5Pcs) 1 Box 730 583.8 146
22 Flower Pots Super Deluxe (2Pcs) 1 Box 509 407.4 102
23 Colour Koti (10Pcs) 1 Box 887 709.8 177
24 Colour Koti Deluxe (10Pcs) 1 Box 1449 1159.2 290
25 Rangeela (Colour Pinjore) (10Pcs) 1 Box 1559 1247.4 312
26 Lucky/Jersey Red & Green (5Pcs) 1 Box 761 609 152
27 Tri Colour (5Pcs) 1 Box 1103 882 221
28 Motu Patlu/Pop Eye Tricolour(5Pcs) 1 Box 945 756 189
29 Monster Koti DLX (10Pcs) 1 Box 2231 1785 446
30 Ganga Jamuna (10Pcs) 1 Box 420 336 84
31 Ground Chakkar Big (10Pcs) 1 Box 168 134.4 34
32 Ground Chakkar Asoka (10Pcs) 1 Box 221 176.4 44
33 Ground Chakkar Special (10Pcs) 1 Box 362 289.8 72
34 Ground Chakkar Deluxe (10Pcs) 1 Box 551 441 110
35 Whizzling Wheel (5Pcs) 1 Box 588 470.4 118
36 4*4 Wheel (5Pcs) 1 Box 772 617.4 154
37 Hot Wheels (5Pcs) 1 Box 1129 903 226
38 Disco Wheel (5 Pcs) 1 Box 499 399 100
39 Win Wheel Mini (10Pcs) 1 Box 656 525 131
40 Win Wheel Max (10Pcs) 1 Box 814 651 163
41 Win Wheel Super (10Pcs) 1 Box 1024 819 205
42 Peacock Red and Green (1Pcs) 1 Box 788 630 158
43 Bada Peacock 5In 1 (1Pcs) 1 Box 1875 1500 375
44 Hi Tech (Red&Green) Crackling (3Pcs) 1 Box 705 564 141
45 Wonderla (White) Crackling (3Pcs) 1 Box 705 564 141
46 Baby Mix Crackling (3Pcs) 1 Box 705 564 141
47 Pop Corn (5Pcs) 1 Box 875 700 175
48 Water Falls (5Pcs) 1 Box 875 700 175
49 15" Navrang Pencil (5Pcs) 1 Box 775 620 155
50 Selfie Stick (5Pcs) 1 Box 665 532 133
51 Red Bijili Crackers (100Pcs) 1 Pkt 160 128 32
52 Stripped Bijili Crackers (100Pcs) 1 Pkt 165 132 33
53 1 1/2" Twinkling Star (10Pcs) 1 Box 95 76 19
54 4" Twinkling Star (10Pcs) 1 Box 252 202 50
55 10*10 Shot (1Pcs) 1 Box 18155 14524 3631
56 King Bomb 1 Box 375 300 75
57 King Of Kango (10Pcs) 1 Box 450 360 90
58 DTX (10Pcs) 1 Box 944 755 189
59 Dinosour Bomb (10Pcs) 1 Box 752 602 150
60 Classic/Jug-Mug 5000 5G (10Pcs) 1 Box 525 420 105
61 Paper Bomb (Adiyal) 1/4 Kg (1Pcs) 1 Box 275 220 55
62 Paper Bomb (Adiyal) 1/2 Kg (1Pcs) 1 Box 525 420 105
63 Paper Bomb (Adiyal) 1 Kg (1Pcs) 1 Box 1025 820 205
64 2 3/4" Kuruvi (1Pkt) 1 Pkt 36 29 7
65 3 1/2" Lakshmi (1Pkt) 1 Pkt 90 72 18
66 4" Lakshmi (1Pkt) 1 Pkt 115 92 23
67 4" Deluxe Lakshmi (1Pkt) 1 Pkt 140 112 28
68 4" Gold Lakshmi (1Pkt) 1 Pkt 140 112 28
69 5" Jallikattu/Vikram/Ganesh (1Pkt) 1 Pkt 200 160 40
70 2 Sound Crackers 1 Pkt 131 105 26
71 Rocket Bomb (10Pcs) 1 Box 772 617.4 154
72 Lunik Express (10Pcs) 1 Box 515 412 103
73 Musical Rocket (10Pcs) 1 Box 700 560 140
74 Penta Dhamaka (5Pcs) 1 Box 664 532 133
75 Sky Wala (5Pcs) 1 Box 538 430 108
76 Sky King (5Pcs) 1 Box 538 430 108
77 Star World (5Pcs) 1 Box 717 574 143
78 White House (5Pcs) 1 Box 717 574 143
79 Golden Coin (5Pcs) 1 Box 717 574 143
80 Sun Rise (5Pcs) 1 Box 717 574 143
81 7 Shot (5Pcs) 1 Box 510 408 102
82 Fanch Damaka (5Pcs) 1 Box 677 542 135
83 12 Shot - Crackling Rider (1Pcs) 1 Box 601 480 120
84 12 - Multicolour Shot (1Pcs) 1 Box 901 721 180
85 25 - Crackling Rider (1Pcs) 1 Box 1166 932 233
86 50 - Crackling Rider (1Pcs) 1 Box 2331 1865 466
87 30 - Multicolour Shot (1Pcs) 1 Box 1950 1560 390
88 60 - Multicolour Shot (1Pcs) 1 Box 3900 3120 780
89 120 - Multicolour Shot (1Pcs) 1 Box 7800 6240 1560
90 240 - Multicolour Shot (1Pcs) 1 Box 15600 12480 3120
91 Chotta Fancy (1Pcs) 1 Box 151 120 30
92 2" Single (1Pcs) 1 Box 460 368 92
93 2" 3Pcs (1Box) 1 Box 1275 1020 255
94 3 1/2" Fancy Single (1Pcs) 1 Box 1349 1079 270
95 3 1/2" Fancy (2Pcs) (1Box) 1 Box 2580 2064 516
96 3 1/2" Seven Steps (1Pcs) 1 Box 1457 1165 291
97 3 1/2" Double Ball (1Pcs) 1 Box 1655 1324 331
98 3 1/2" Nayagara (1Pcs) 1 Box 1261 1009 252
99 4" Fancy Single (1Pcs) 1 Box 1405 1124 281
100 4" Fancy (2Pcs) (1Pcs) 1 Box 1405 1124 281
101 5" Fancy Single (1Pcs) 1 Box 2358 1886 472
102 5" Fancy (2 Pcs) (1Box) 1 Box 4655 3724 931
103 6" Water Queen (1Pcs) 1 Box 879 703 176
104 Festival Party (3Pcs) 1 Box 1403 1123 281
105 Tin (1Pcs) 1 Box 500 400 100
106 Siren (5Pcs) 1 Box 590 472 118
107 Mega Siren (3Pcs) 1 Box 750 600 150
108 Pogo/Jolly Rancher/Tom&Cherry (5Pcs) 1 Box 650 520 130
109 Angry Bird/Scooby-doo/KurKur (5Pcs) 1 Box 1310 1048 262
110 Starpots (5Pcs) 1 Box 735 588 147
111 Diamond Buster (5Pcs) 1 Box 567 453 113
112 Glorious Green (5Pcs) 1 Box 567 453 113
113 Gold Monets (5Pcs) 1 Box 567 453 113
114 volvo Red (5Pcs) 1 Box 567 453 113
115 Amaze (5Pcs) 1 Box 567 453 113
116 Sun Feast-Red,Green,Gold,White,Red&Green (5Pcs) 1 Box 640 512 128
117 Red Bloom/kit kat Red (5Pcs) 1 Box 840 672 168
118 Reen Garden/Green Flash/Tic Tac Mint (5Pcs) 1 Box 840 672 168
119 Red Sun/Little Fish/Dairy Milk (5Pcs) 1 Box 840 672 168
120 Gold Feast/Gold Coin/5 Star (5Pcs) 1 Box 840 672 168
121 Blue Ice/Silver Moon/Milky Bar (5Pcs) 1 Box 840 672 168
122 Miss Butterfly (5Pcs) 1 Box 840 672 168
123 Kinster/Jigarthanda (3Pcs) 1 Box 1140 912 228
124 Peacock Tail (2Pcs) 1 Box 1165 932 233
125 Electric Stone (10Pcs) 1 Box 90 72 18
126 Snake Egg (10Pcs) 1 Box 140 112 28
127 Gold Fish 2in1 (1Pcs) 1 Box 750 600 150
128 Croods Fish 2in1 (1Pcs) 1 Box 750 600 150
129 Angel Time 2in1 (1Pcs) 1 Box 750 600 150
130 8" Triple Monkey 3in 1 (1Pcs) 1 Box 975 780 195
131 6000 (1Pcs) 1 Box 645 516 129
132 Tweet (1Pcs) 1 Box 645 516 129
133 Poppings (1Pcs) 1 Box 645 516 129
134 Golden Peacock (1Pcs) 1 Box 645 516 129
135 Star Show Crackling (1Pcs) 1 Box 950 760 190
136 White Crackling (1Pcs) 1 Box 950 760 190
137 Autumn Rain(1Pcs) 1 Box 825 660 165
138 Winter Rain(1Pcs) 1 Box 825 660 165
139 Rain & Shin (1Pcs) 1 Box 900 720 180
140 Jelly Belly (1Pcs) 1 Box 900 720 180
141 Crack Jack (1Pcs) 1 Box 900 720 180
142 Tik Tok (1Pcs) 1 Box 900 720 180
143 Photo Flash (5Pcs) 1 Box 315 252 63
144 Helicopter (5Pcs) 1 Box 450 360 90
145 Bambaram (10Pcs) 1 Box 500 400 100
146 Butterfly (10Pcs) 1 Box 325 260 65
147 Drone (5Pcs) 1 Box 490 392 98
148 Bim Bam Crackling/Mad Max (10Pcs) 1 Box 240 192 48
149 Rainbow Colour Smoke (3Pcs) 1 Box 950 760 190
150 Dora Singer (5Pcs) 1 Box 700 560 140
151 Kit Kat (10Pcs) 1 Box 115 92 23
152 Assorted Cartoon (10Pcs) 1 Box 125 100 25
153 Bat and Ball (1Pcs) 1 Box 785 628 157
154 Fire Egg (2Pcs) 1 Box 775 620 155
155 Hammer of Thor (2Pcs) 1 Box 3615 2892 723
156 Sowrd (2Pcs) 1 Box 3615 2892 723
157 Money Bank (3Pcs) 1 Box 700 560 140
158 Mony Plast/Mangatha (5Pcs) 1 Box 950 760 190
159 Magic Whip (2000 sounds) (1Pcs) 1 Box 676 541 135
160 Kungfu Deluxe (1000 sounds) (1Pcs) 1 Box 275 220 55
161 Moon Droops(5Pcs) 1 Box 465 372 93
162 Feather Droops (5Pcs) 1 Box 465 372 93
163 Golden Drops (5Pcs) 1 Box 465 372 93
164 Peacock Feather (5Pcs) 1 Box 515 412 103
165 Touch and Touch (5Pcs) 1 Box 525 420 105
166 Sachin Small (10Box) 1 Box 360 288 72
167 Lion Delux (10Box) 1 Box 630 504 126
168 Royal Giant (10Box) 1 Box 810 648 162`;

// Category mapping
const categoryMap = {
  'sparklers': 'sparklers',
  'flower pots': 'flowerpots',
  'ground chakkar': 'chakras',
  'wheel': 'chakras',
  'peacock': 'special',
  'pencil': 'novelty',
  'bijili': 'bombs',
  'twinkling star': 'sparklers',
  'shot': 'aerial',
  'bomb': 'bombs',
  'lakshmi': 'bombs',
  'crackers': 'bombs',
  'rocket': 'rockets',
  'aerial': 'aerial',
  'fancy': 'aerial',
  'tin': 'aerial',
  'whistling': 'flowerpots',
  'colour': 'flowerpots',
  'crackling': 'flowerpots',
  'double': 'aerial',
  'mega': 'flowerpots',
  'children': 'novelty',
  'gift': 'giftbox',
  'digital': 'novelty'
};

function parseProductData(data) {
  const lines = data.trim().split('\n');
  const products = [];
  let currentCategory = 'sparklers';
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('S.No') || line.startsWith('Terms')) continue;
    
    // Check for category headers
    if (line.includes('SPARKLERS') || line.includes('FLOWER POTS') || 
        line.includes('GROUND CHAKKARS') || line.includes('WHEEL') || 
        line.includes('PEACOCKS') || line.includes('PENCIL') || 
        line.includes('BIJILI') || line.includes('TWINKLING STARS') || 
        line.includes('BOMBS') || line.includes('CRACKERS') || 
        line.includes('ROCKET') || line.includes('AERIAL') || 
        line.includes('SHOT') || line.includes('FANCY') || 
        line.includes('TIN') || line.includes('WHISTLING') || 
        line.includes('FOUNTAIN') || line.includes('DOUBLE') || 
        line.includes('MEGA') || line.includes('CHILDREN') || 
        line.includes('GIFT') || line.includes('DIGITAL')) {
      
      const categoryName = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      for (const [key, value] of Object.entries(categoryMap)) {
        if (categoryName.includes(key)) {
          currentCategory = value;
          break;
        }
      }
      continue;
    }
    
    // Parse product line
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length < 5) continue;
    
    let productName = '';
    let content = '';
    let price = 0;
    let finalPrice = 0;
    let quantity = 0;
    
    // Extract serial number
    const serialMatch = parts[0].match(/^\d+$/);
    if (!serialMatch) continue;
    
    // Find price values (look for numbers with decimals)
    const numbers = parts.map(p => parseFloat(p)).filter(n => !isNaN(n));
    if (numbers.length >= 2) {
      finalPrice = numbers[numbers.length - 2]; // Second to last number
      quantity = numbers[numbers.length - 1]; // Last number
    }
    
    // Extract product name (everything between serial number and prices)
    const serialIndex = parts.findIndex(p => p.match(/^\d+$/));
    if (serialIndex !== -1) {
      const nameParts = parts.slice(serialIndex + 1);
      const priceIndex = nameParts.findIndex(p => !isNaN(parseFloat(p)) && parseFloat(p) > 10);
      if (priceIndex !== -1) {
        productName = nameParts.slice(0, priceIndex).join(' ');
      }
    }
    
    if (productName && finalPrice > 0) {
      products.push({
        name: productName.trim(),
        originalPrice: Math.round(finalPrice / 0.8), // Calculate original price (80% discount)
        price: finalPrice,
        category: currentCategory,
        description: `${content} - Premium quality firecrackers`,
        stock: 50, // Default stock
        featured: Math.random() > 0.7, // 30% featured
        thumbnail: null,
        previews: []
      });
    }
  }
  
  return products;
}

async function importProducts() {
  try {
    const products = parseProductData(productData);
    console.log(`Parsed ${products.length} products`);
    
    // Create batch for bulk import
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');
    
    products.forEach((product, index) => {
      const docRef = doc(productsRef);
      batch.set(docRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    // Commit batch
    await batch.commit();
    console.log(`Successfully imported ${products.length} products to Firebase!`);
    
    // Log sample products
    console.log('\nSample products:');
    products.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ₹${p.price} (${p.category})`);
    });
    
  } catch (error) {
    console.error('Error importing products:', error);
  }
}

// Run the import
importProducts();
