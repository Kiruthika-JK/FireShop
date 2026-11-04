/*
 * Sets Cache-Control: public, max-age=2592000 (30 days) on all Storage objects.
 * Current default is "private, max-age=0" which forces every visitor to
 * re-download every image — driving up Class B operation costs.
 *
 * Usage: node set-storage-cache.js
 * Auth: firebase-admin Application Default Credentials
 */

const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

initializeApp({ projectId: 'ganishkha-crackers-store' });
const bucket = getStorage().bucket('ganishkha-crackers-store.firebasestorage.app');

const CACHE_CONTROL = 'public, max-age=2592000';

async function setCache() {
    const [files] = await bucket.getFiles();
    console.log(`Found ${files.length} files. Setting Cache-Control: ${CACHE_CONTROL}\n`);

    let updated = 0;
    let skipped = 0;
    for (const file of files) {
        const [metadata] = await file.getMetadata();
        if (metadata.cacheControl === CACHE_CONTROL) {
            skipped++;
            continue;
        }
        await file.setMetadata({ cacheControl: CACHE_CONTROL });
        updated++;
        console.log(`Updated: ${file.name}`);
    }

    console.log(`\nDone. Updated ${updated}, already set ${skipped}, total ${files.length}`);
}

setCache().catch((err) => {
    console.error('Failed to set cache headers:', err);
    process.exit(1);
});
