/*
 * Updates SEO fields for all existing products in Firestore.
 *
 * Usage: node update-seo.js
 *        node update-seo.js --force
 * Auth: uses firebase-admin with Application Default Credentials
 *       (run `gcloud auth application-default login` beforehand)
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { generateProductSEO } = require('./product-seo');

initializeApp({ projectId: 'ganishkha-crackers-store' });
const db = getFirestore();

const force = process.argv.includes('--force');

function hasValidCanonical(product) {
  const expected = `https://www.ganishkhasricrackers.in/product/${product.id}`;
  return product.canonicalUrl === expected;
}

async function updateSEO() {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();

  if (snapshot.empty) {
    console.log('No products found.');
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const docSnap of snapshot.docs) {
    const product = { id: docSnap.id, ...docSnap.data() };

    if (!force && product.seoTitle && product.structuredData && hasValidCanonical(product)) {
      skipped++;
      continue;
    }

    const seo = generateProductSEO(product, docSnap.id);
    await docSnap.ref.update(seo);
    updated++;
    console.log(`Updated: ${product.name}`);
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}, total ${snapshot.size}`);
}

updateSEO().catch((err) => {
  console.error('SEO update failed:', err);
  process.exit(1);
});
