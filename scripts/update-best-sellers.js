/*
 * Updates `trending` (Best Seller) flags on products based on order counts.
 * - Counts how many orders contain each product (matched by name).
 * - Tag products with count > 3; if 10+ products have count > 5, use threshold 5.
 * - Clears trending on products below threshold.
 *
 * Usage: node update-best-sellers.js [--dry]
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ projectId: 'ganishkha-crackers-store' });
const db = getFirestore();

const dryRun = process.argv.includes('--dry');

async function updateBestSellers() {
    const [ordersSnap, productsSnap] = await Promise.all([
        db.collection('orders').get(),
        db.collection('products').get(),
    ]);

    // Count orders containing each product name
    const orderCount = new Map();
    ordersSnap.docs.forEach(docSnap => {
        const order = docSnap.data();
        (order.products || []).forEach(item => {
            const name = (item.name || '').trim();
            if (name) orderCount.set(name, (orderCount.get(name) || 0) + 1);
        });
    });

    // Threshold: products ordered in more than 10 orders are Best Sellers
    const threshold = 10;
    console.log(`Orders analyzed: ${ordersSnap.size} | Products: ${productsSnap.size}`);
    console.log(`Threshold: >${threshold} orders\n`);

    const batch = db.batch();
    let tagged = 0, untagged = 0, unchanged = 0;

    productsSnap.docs.forEach(docSnap => {
        const p = docSnap.data();
        const count = orderCount.get((p.name || '').trim()) || 0;
        const shouldBeTrending = count > threshold;

        if (shouldBeTrending === !!p.trending) {
            unchanged++;
            return;
        }

        if (!dryRun) batch.update(docSnap.ref, { trending: shouldBeTrending });
        console.log(`${shouldBeTrending ? 'TAG  ' : 'UNTAG'} (${count} orders) ${p.name}`);
        shouldBeTrending ? tagged++ : untagged++;
    });

    if (!dryRun) await batch.commit();
    console.log(`\nDone${dryRun ? ' (dry run)' : ''}. Tagged: ${tagged}, Untagged: ${untagged}, Unchanged: ${unchanged}`);
}

updateBestSellers().catch(err => {
    console.error('Failed:', err);
    process.exit(1);
});
