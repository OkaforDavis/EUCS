# 🔧 EUCS - WHERE TO MAKE CHANGES GUIDE

## ⚠️ IMPORTANT NOTES

**DOMAIN STATUS:** Not purchased yet  
**HOSTING STATUS:** Not hosted yet  
**CURRENT STATUS:** In development (GitHub only)  
**FUTURE DOMAIN:** eumco-op.com (when ready)  
**REPOSITORY:** https://github.com/OkaforDavis/EUCS

---

## 📍 EXACT FILE LOCATIONS FOR CHANGES

All changes are made in the **ZIP file** you download. After making changes, commit to GitHub.

### **File Structure:**
```
EUCS/
├── public/
│   ├── index.html          ← Main HTML file
│   ├── css/
│   │   └── styles.css      ← All styling
│   ├── js/
│   │   └── app.js          ← All functionality
│   └── icons/
├── docs/
│   ├── CHANGES_LOCATION.md ← This file
│   └── TESTING_GUIDE.md
├── README.md
└── .gitignore
```

---

## 1️⃣ CHANGE DEFAULT ADMIN USER

### **Location:** `public/js/app.js`
### **Line Numbers:** 40-65

**Find this section:**
```javascript
if (!localStorage.getItem('eucs_users')) {
    const users = [
        {
            userId: '1',
            memberId: 'EUCS001',                      // ← CHANGE THIS
            email: 'admin@eumco-op.com',              // ← CHANGE THIS
            password: this.hashPassword('Admin@2026!'), // ← CHANGE THIS
            firstName: 'System',                      // ← CHANGE THIS
            lastName: 'Administrator',                // ← CHANGE THIS
            role: 'admin',
            status: 'active',
            phone: '+2348012345678',                  // ← CHANGE THIS
            address: 'Elugwu, Umuoshie',             // ← CHANGE THIS
            joinDate: '2024-01-15',
            totalContributions: 500000,
            profilePhoto: null
        }
    ];
```

**What to change:**
- `memberId`: Your preferred admin ID (e.g., 'ADMIN001', 'EUCS001')
- `email`: Your admin email
- `password`: Your admin password (inside the hashPassword function)
- `firstName`: Admin first name
- `lastName`: Admin last name
- `phone`: Admin phone number
- `address`: Admin address

**Example change:**
```javascript
{
    userId: '1',
    memberId: 'ADMIN001',
    email: 'manager@eumco-op.com',
    password: this.hashPassword('MySecurePass@2026!'),
    firstName: 'John',
    lastName: 'Manager',
    role: 'admin',
    status: 'active',
    phone: '+2348098765432',
    address: 'Elugwu Main Street',
    joinDate: '2024-01-15',
    totalContributions: 0,
    profilePhoto: null
}
```

---

## 2️⃣ ADD MORE DEFAULT USERS

### **Location:** `public/js/app.js`
### **Line Numbers:** 40-65 (same section as above)

**Add more users to the array:**
```javascript
const users = [
    {
        // ... existing admin user ...
    },
    // ADD MORE USERS HERE:
    {
        userId: '2',
        memberId: 'EUCS002',
        email: 'member1@eumco-op.com',
        password: this.hashPassword('Member@2026!'),
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'member',
        status: 'active',
        phone: '+2348011111111',
        address: 'Elugwu, Umuoshie',
        joinDate: '2024-02-01',
        totalContributions: 100000,
        profilePhoto: null
    },
    {
        userId: '3',
        memberId: 'EUCS003',
        email: 'member2@eumco-op.com',
        password: this.hashPassword('Member@2026!'),
        firstName: 'Peter',
        lastName: 'Smith',
        role: 'member',
        status: 'active',
        phone: '+2348022222222',
        address: 'Elugwu, Umuoshie',
        joinDate: '2024-02-15',
        totalContributions: 75000,
        profilePhoto: null
    }
];
```

**Important:** Increment `userId` for each new user (2, 3, 4, etc.)

---

## 3️⃣ DELETE ALL DEFAULT USERS (FRESH START)

### **Location:** `public/js/app.js`
### **Line Numbers:** 40-65

**Replace entire section with empty array:**
```javascript
if (!localStorage.getItem('eucs_users')) {
    const users = [];  // ← Empty array = no default users
    localStorage.setItem('eucs_users', JSON.stringify(users));
}
```

**Result:** System starts with NO users. First user must be created manually.

---

## 4️⃣ CHANGE SYSTEM NAME/BRANDING

### **Location:** `public/index.html`

**Line ~25:** Page title
```html
<title>EUCS - Cooperative Management</title>
<!-- CHANGE TO: -->
<title>Your Co-op Name Here</title>
```

**Line ~45:** Login page heading
```html
<h1 class="ect-auth-title">Elugwu Umuoshie Co-operative Society Ltd</h1>
<!-- CHANGE TO: -->
<h1 class="ect-auth-title">Your Cooperative Name</h1>
```

**Line ~50:** Tagline
```html
<p class="ect-auth-subtitle">Building Prosperity Together</p>
<!-- CHANGE TO: -->
<p class="ect-auth-subtitle">Your Tagline Here</p>
```

---

## 5️⃣ CHANGE COLORS/THEME

### **Location:** `public/css/styles.css`
### **Line Numbers:** 1-50 (CSS Variables section)

**Find this section:**
```css
:root {
    --ect-green-500: #6BA368;   /* ← Main brand color */
    --ect-green-600: #3D7C3A;   /* ← Dark brand color */
    --ect-green-700: #2D5A2C;
    /* ... more colors ... */
}
```

**Change primary colors:**
```css
:root {
    --ect-green-500: #YOUR_COLOR_HERE;  /* Main color */
    --ect-green-600: #YOUR_DARK_COLOR;  /* Dark variant */
    /* ... rest stays same ... */
}
```

**Color picker:** Use https://colorpicker.me to get hex codes

---

## 6️⃣ CHANGE PAYMENT GATEWAY DEFAULTS

### **Location:** `public/js/app.js`
### **Search for:** "Payment Method"

**Line ~850-860:** Purchase modal payment options
```javascript
<select id="purchase-payment" class="ect-form-input">
    <option value="paystack">Paystack</option>
    <option value="flutterwave">Flutterwave</option>
    <option value="cash">Cash on Delivery</option>
</select>
```

**Add more payment options:**
```javascript
<select id="purchase-payment" class="ect-form-input">
    <option value="paystack">Paystack</option>
    <option value="flutterwave">Flutterwave</option>
    <option value="bank_transfer">Bank Transfer</option>  <!-- NEW -->
    <option value="cash">Cash on Delivery</option>
    <option value="mobile_money">Mobile Money</option>   <!-- NEW -->
</select>
```

---

## 7️⃣ CHANGE PRODUCT CATEGORIES

### **Location:** `public/js/app.js`
### **Line Numbers:** ~820-830

**Find this section:**
```javascript
<select id="product-category" class="ect-form-input">
    <option value="Grains">Grains & Cereals</option>
    <option value="Tubers">Tubers & Roots</option>
    <option value="Vegetables">Vegetables</option>
    <option value="Fruits">Fruits</option>
    <option value="Livestock">Livestock</option>
</select>
```

**Change categories:**
```javascript
<select id="product-category" class="ect-form-input">
    <option value="Grains">Grains & Cereals</option>
    <option value="Tubers">Tubers & Roots</option>
    <option value="Vegetables">Vegetables</option>
    <option value="Fruits">Fruits</option>
    <option value="Livestock">Livestock</option>
    <option value="Dairy">Dairy Products</option>        <!-- NEW -->
    <option value="Processed">Processed Goods</option>   <!-- NEW -->
    <option value="Herbs">Herbs & Spices</option>        <!-- NEW -->
</select>
```

---

## 8️⃣ CHANGE SAMPLE PRODUCTS

### **Location:** `public/js/app.js`
### **Line Numbers:** 70-100

**Find this section:**
```javascript
const sampleProducts = [
    {
        id: '1',
        name: 'Premium Rice (50kg)',    // ← CHANGE
        category: 'Grains',
        price: 35000,                    // ← CHANGE
        stock: 100,
        sellerId: '1',
        sellerName: 'System Administrator',
        description: 'High quality local rice',  // ← CHANGE
        image: 'https://via.placeholder.com/300x200/6BA368/ffffff?text=Rice',
        featured: true,
        createdAt: new Date().toISOString()
    },
    // ... more products ...
];
```

**Add your own products:**
```javascript
const sampleProducts = [
    {
        id: '1',
        name: 'Fresh Cassava (1 ton)',
        category: 'Tubers',
        price: 120000,
        stock: 50,
        sellerId: '1',
        sellerName: 'Your Name',
        description: 'Fresh harvested cassava',
        image: 'https://via.placeholder.com/300x200/6BA368/ffffff?text=Cassava',
        featured: true,
        createdAt: new Date().toISOString()
    }
];
```

**Delete all sample products:**
```javascript
const sampleProducts = [];  // ← Empty array
```

---

## 9️⃣ DELETE SPECIFIC USERS (CODE METHOD)

### **Option 1: Via Browser Console** (After deployment)
```javascript
// Open browser console (F12)
// Run this code:

// View all users
const users = JSON.parse(localStorage.getItem('eucs_users'));
console.table(users);

// Delete user by ID
const filtered = users.filter(u => u.userId !== '2'); // Change '2' to user ID
localStorage.setItem('eucs_users', JSON.stringify(filtered));
location.reload();
```

### **Option 2: Via UI** (After deployment)
1. Login as admin
2. Go to Members page
3. Click "Delete" button on user card
4. Confirm deletion

---

## 🔟 UPDATE DOMAIN REFERENCES (WHEN DOMAIN IS PURCHASED)

### **Search and Replace:**

**In:** `public/js/app.js`  
**Find:** `eumco-op.com`  
**Replace with:** `your-actual-domain.com`

**In:** `README.md`  
**Find:** `eumco-op.com`  
**Replace with:** `your-actual-domain.com`

**Use Find & Replace in your code editor:**
- VS Code: Ctrl+H (Windows) or Cmd+H (Mac)
- Sublime: Ctrl+H
- Notepad++: Ctrl+H

---

## 1️⃣1️⃣ CHANGE GITHUB REPOSITORY URL

### **When creating NEW repository:**

**Current:** https://github.com/OkaforDavis/EUCS  
**Your new:** https://github.com/YourUsername/YourRepoName

**In:** `README.md` - Line 5
```markdown
📦 **Repository:** https://github.com/OkaforDavis/EUCS
<!-- CHANGE TO: -->
📦 **Repository:** https://github.com/YourUsername/YourRepoName
```

---

## 📝 STEP-BY-STEP CHANGE WORKFLOW

### **When you're ready to customize:**

1. **Extract ZIP file**
   ```bash
   unzip EUCS.zip
   cd EUCS
   ```

2. **Open in code editor**
   ```bash
   code .              # VS Code
   # OR
   subl .              # Sublime Text
   # OR
   atom .              # Atom
   ```

3. **Make changes** (refer to sections above)
   - Change default users
   - Change branding
   - Change colors
   - Etc.

4. **Save all files**

5. **Test locally**
   ```bash
   # Open in browser
   open public/index.html
   # OR
   npx http-server public -p 8080
   ```

6. **Commit to GitHub**
   ```bash
   git add .
   git commit -m "Customized EUCS system"
   git push
   ```

7. **When domain is ready:**
   - Purchase domain (eumco-op.com)
   - Purchase hosting (Hostinger/Namecheap)
   - Upload `public/` folder to `/public_html/`
   - Enable SSL
   - Test at your domain

---

## 🚨 IMPORTANT REMINDERS

### **DON'T EDIT:**
- File structure (keep folders as is)
- Function names in app.js
- CSS class names
- HTML element IDs

### **DO EDIT:**
- User data (names, emails, passwords)
- Branding text
- Colors
- Product data
- Payment methods
- Categories

### **WHEN EDITING app.js:**
- Keep JavaScript syntax correct
- Don't remove commas
- Keep quotes matched (' or ")
- Keep curly braces balanced { }
- Test after every change

### **TESTING AFTER CHANGES:**
```bash
# Always test locally first
open public/index.html
# Try to login
# Try to add contribution
# Try to add product
# If errors: Check browser console (F12)
```

---

## 📞 NEED HELP?

**Common Issues:**

**Issue:** Can't login after changing password  
**Solution:** Password must be inside `this.hashPassword('password')`

**Issue:** Changes not showing  
**Solution:** Clear browser cache (Ctrl+Shift+Delete)

**Issue:** JavaScript error  
**Solution:** Check browser console (F12) for error details

**Issue:** Users not saving  
**Solution:** Check localStorage is enabled in browser

---

## 🎯 QUICK REFERENCE

| What to Change | File | Line | Search For |
|----------------|------|------|------------|
| Default admin | app.js | 40-65 | `memberId: 'EUCS001'` |
| System name | index.html | 25, 45 | `<title>`, `<h1>` |
| Colors | styles.css | 1-50 | `:root {` |
| Products | app.js | 70-100 | `sampleProducts` |
| Payment methods | app.js | 850-860 | `<option value=` |
| Categories | app.js | 820-830 | `product-category` |

---

## ✅ FINAL CHECKLIST BEFORE DEPLOYMENT

- [ ] Changed default admin credentials
- [ ] Updated system name/branding
- [ ] Customized colors (if needed)
- [ ] Added real users or cleared samples
- [ ] Updated product categories
- [ ] Tested locally in browser
- [ ] All features work
- [ ] No JavaScript errors (F12 console)
- [ ] Committed to GitHub
- [ ] Domain purchased (when ready)
- [ ] Hosting purchased (when ready)

---

**Version:** 3.0  
**Last Updated:** February 22, 2026  
**Status:** Ready for Customization ✅
