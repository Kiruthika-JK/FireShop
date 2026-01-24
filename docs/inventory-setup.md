# Inventory Management System - Setup Guide

## 🎉 Implementation Complete!

The inventory management system has been successfully implemented with the following features:

### ✅ Features Implemented

1. **Product Model Updates**
   - Added `discountPercent` field (0-100)
   - Added `outOfStock` boolean field
   - Automatic price calculation from discount

2. **Image Processing**
   - Client-side image validation (4:3 aspect ratio)
   - Automatic image compression before upload
   - Firebase Storage integration

3. **Firestore Integration**
   - Full CRUD operations for products
   - Fallback to static data during development
   - Automatic timestamp tracking

4. **Admin-Only Inventory Page**
   - Product listing with thumbnails
   - Add/Edit/Delete functionality
   - Image upload with validation
   - Out of stock management

5. **Navbar Updates**
   - Inventory link visible only to admins
   - Already implemented in existing code

## 🚀 Firebase Setup Required

To use the inventory management system, you need to configure Firebase:

### Step 1: Enable Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ganishkhasri-crackers`
3. Click **Firestore Database** in the left menu
4. Click **Create database**
5. Select **Start in test mode** (we'll secure it next)
6. Choose a location (e.g., `us-central1`)
7. Click **Enable**

### Step 2: Enable Firebase Storage

1. In Firebase Console, click **Storage** in the left menu
2. Click **Get started**
3. Review security rules (we'll update them)
4. Choose the same location as Firestore
5. Click **Done**

### Step 3: Set Up Firestore Security Rules

1. In Firestore Database, click on the **Rules** tab
2. Replace the default rules with:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products collection - read for all, write for admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admins collection - read for authenticated users, write never (manual management)
    match /admins/{adminId} {
      allow read: if request.auth != null;
      allow write: if false; // Admins can only be added manually
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.email));
    }
  }
}
\`\`\`

3. Click **Publish**

### Step 4: Set Up Storage Security Rules

1. In Storage, click on the **Rules** tab
2. Replace the default rules with:

\`\`\`javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Products folder - read for all, write for admins only
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                     firestore.exists(/databases/(default)/documents/admins/$(request.auth.email));
    }
  }
}
\`\`\`

3. Click **Publish**

### Step 5: Create Admin Collection

1. In Firestore Database, click **Data** tab
2. Click **Start collection**
3. Collection ID: `admins`
4. Click **Next**

#### Add Your First Admin User

1. **Document ID**: Use your email (e.g., `admin@example.com`)
2. **Field**: `email` (type: string)
3. **Value**: Your email address (same as document ID)
4. Click **Save**

Example:
\`\`\`
Collection: admins
Document ID: vivek@example.com
Fields:
  - email: "vivek@example.com"
\`\`\`

### Step 6: Create Products Collection

Firestore will automatically create the `products` collection when you add your first product through the inventory interface. No manual setup needed!

## 📖 How to Use

### For Admins

1. **Login** with your admin account (email must be in the `admins` collection)
2. **Click "Inventory"** in the navbar (only visible to admins)
3. **Add Products**:
   - Click "Add New Product"
   - Fill in product details
   - Upload image (must be 4:3 aspect ratio)
   - Image will be automatically compressed
   - Click "Create Product"

4. **Edit Products**:
   - Click the edit icon (pencil)
   - Modify fields
   - Optionally upload a new image
   - Click "Update Product"

5. **Delete Products**:
   - Click the delete icon (trash)
   - Confirm deletion
   - Product and image will be permanently deleted

### Image Requirements

- **Aspect Ratio**: 4:3 (e.g., 1600x1200, 800x600, 1920x1440)
- **Format**: JPG, PNG, or any image format
- **Size**: Any size (will be compressed to max 1MB)
- **Max Dimension**: 1920px (larger images will be resized)

### Discount Calculation

The system automatically calculates the final price:
\`\`\`
Final Price = Original Price × (1 - Discount Percent / 100)
\`\`\`

Example:
- Original Price: $100
- Discount: 20%
- Final Price: $80

## 🔍 Testing the Implementation

### 1. Test Product List Page (Home)

\`\`\`bash
# Visit: http://localhost:3000
\`\`\`

Should display products from Firestore or fallback to static products.

### 2. Test Admin Access

\`\`\`bash
# Login as admin user
# Visit: http://localhost:3000/inventory
\`\`\`

Should show inventory management page.

### 3. Test Non-Admin Access

\`\`\`bash
# Login as regular user (not in admins collection)
# Try to visit: http://localhost:3000/inventory
\`\`\`

Should redirect to home page.

### 4. Test Image Upload

1. Find a 4:3 image or create one
2. Add new product with the image
3. Check Firebase Storage for uploaded image
4. Check Firestore for product document
5. Verify image displays on home page

### 5. Test Image Validation

1. Try uploading a non-4:3 image (e.g., 16:9)
2. Should show error message with current aspect ratio
3. Upload will be blocked until correct ratio is used

## 🐛 Troubleshooting

### "Permission Denied" Error

**Problem**: Can't read/write to Firestore or Storage

**Solution**:
1. Check Firebase Security Rules are published
2. Verify user is logged in
3. Confirm user email is in `admins` collection (for writes)

### Images Not Uploading

**Problem**: Image upload fails

**Solution**:
1. Check Storage Security Rules
2. Verify user email is in `admins` collection
3. Check browser console for errors
4. Ensure image meets 4:3 aspect ratio requirement

### "Inventory" Link Not Showing

**Problem**: Admin can't see inventory link

**Solution**:
1. Verify user is logged in
2. Check user's email is exactly in `admins` collection
3. Check Firestore rules allow reading `admins` collection
4. Clear browser cache and reload

### Products Not Loading

**Problem**: Home page shows no products

**Solution**:
1. Check browser console for errors
2. Verify Firestore Security Rules allow public read
3. Add products through inventory page
4. System will fallback to static products if Firestore is empty

## 📊 Data Structure

### Firestore Collections

#### `products` Collection
\`\`\`typescript
{
  id: string;              // Auto-generated
  name: string;            // Product name
  originalPrice: number;   // Original price
  price: number;           // Final price (calculated)
  discountPercent: number; // Discount 0-100
  outOfStock: boolean;     // Stock status
  thumbnail: string;       // Firebase Storage URL
  previews: string[];      // Array of preview URLs
  createdAt: timestamp;    // Auto-generated
  updatedAt: timestamp;    // Auto-updated
}
\`\`\`

#### `admins` Collection
\`\`\`typescript
{
  email: string; // Admin email address
}
\`\`\`

### Firebase Storage Structure
\`\`\`
products/
  ├── {productId}/
  │   ├── thumbnail_1234567890.jpg
  │   ├── preview_0_1234567890.jpg
  │   └── preview_1_1234567890.jpg
\`\`\`

## 🎯 Next Steps

1. **Set up Firebase** following steps above
2. **Add yourself as admin** in Firestore
3. **Login to the app** with your admin account
4. **Add your first product** via inventory page
5. **Test all CRUD operations**
6. **Add more admins** as needed

## 📝 Notes

- Static products from `StaticProductsDs.ts` remain unchanged and serve as fallback
- The home page (`/`) will show Firestore products if available, otherwise static products
- Inventory page (`/inventory`) only shows Firestore products
- Image compression happens automatically on the client-side before upload
- All uploaded images are stored as JPEG for consistency

## 🔐 Security Best Practices

1. **Never store payment keys** or admin SDK keys in client-side code
2. **Admin collection** should only be modified manually (write: false in rules)
3. **Product images** are public (fine for e-commerce)
4. **User data** should have appropriate security rules if added later
5. **Regular backups** of Firestore data recommended

---

**Implementation completed successfully!** 🎉

Your FireShop inventory management system is ready to use!
