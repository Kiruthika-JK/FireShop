const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  // You can copy this from your lib/config.ts file
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin email configuration
const adminConfig = {
  emails: [
    'admin@fireshop.com',
    'orders@fireshop.com',
    'manager@fireshop.com',
    // Add your actual admin emails here
  ],
  updatedAt: new Date().toISOString(),
  version: '1.0'
};

async function setupAdminEmails() {
  try {
    console.log('Setting up admin email configuration...');
    
    // Set admin emails in Firestore
    await setDoc(doc(db, 'admins', 'config'), adminConfig);
    
    console.log('Admin email configuration set successfully!');
    console.log('Admin emails:', adminConfig.emails);
    
  } catch (error) {
    console.error('Error setting up admin emails:', error);
  }
}

// Run the setup
setupAdminEmails();
