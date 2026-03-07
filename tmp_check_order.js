const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function main() {
    console.log("Fetching orders from Firestore...");
    const ordersCol = collection(firestore, 'orders');
    const snapshot = await getDocs(ordersCol);
    if (snapshot.empty) {
        console.log("No orders found.");
        return;
    }
    const doc = snapshot.docs[0];
    console.log(`Order ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
}

main().catch(console.error);
