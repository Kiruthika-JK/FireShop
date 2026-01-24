# Quick Setup: Firebase Firestore & Storage Rules

## 🔥 Firestore Security Rules

**Path**: Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products: Read for all, Write for admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admins: Read for authenticated, Write never
    match /admins/{adminId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.email));
    }
  }
}
```

## 💾 Storage Security Rules

**Path**: Firebase Console → Storage → Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Products: Read for all, Write for admins only
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                     firestore.exists(/databases/(default)/documents/admins/$(request.auth.email));
    }
  }
}
```

## 👤 Create First Admin

**Path**: Firebase Console → Firestore Database → Data

1. Click "Start collection"
2. Collection ID: `admins`
3. Document ID: Your email (e.g., `admin@example.com`)
4. Add field:
   - Name: `email`
   - Type: `string`
   - Value: Your email

Example:
```
Collection: admins
├── admin@example.com
    └── email: "admin@example.com"
```

## ✅ Verification

After setup:
1. Login to app with admin email
2. Check navbar for "Inventory" link
3. Visit `/inventory`
4. Add a test product
5. Verify it appears on home page

---

**Done!** Your inventory system is now configured and ready to use.
