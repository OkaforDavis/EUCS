# 👤 USER MANAGEMENT GUIDE

## 📍 MANAGING USERS IN THE SYSTEM

All user data is stored in **LocalStorage** (browser storage). When you first open the app, default users are created.

---

## 1️⃣ WHERE TO FIND DEFAULT USERS

### **File:** `public/js/app.js` (or `js/app.js`)
### **Lines:** 25-80

**Search for this comment:**
```javascript
// ============================================
// MOCK DATABASE (LocalStorage-based)
// ============================================

const ECTDatabase = {
    // Initialize mock data
    init() {
        if (!localStorage.getItem('eucs_users')) {
            // Create default users
            const users = [
```

---

## 2️⃣ DEFAULT USERS (TO MODIFY)

### **Location:** Lines 38-80

You'll find the default users array. Each user looks like this:

```javascript
{
    userId: '1',
    memberId: 'EUCS001',           // ← CHANGE: Member login ID
    email: 'admin@eucs.coop',       // ← CHANGE: Admin email
    password: this.hashPassword('Admin@2026!'),  // ← CHANGE: Password
    firstName: 'System',            // ← CHANGE: First name
    lastName: 'Administrator',      // ← CHANGE: Last name
    role: 'admin',                  // ← CHANGE: Can be 'admin' or 'member'
    status: 'active',               // ← CHANGE: 'active' or 'inactive'
    phone: '+2348012345678',        // ← CHANGE: Phone number
    joinDate: '2024-01-15',         // ← CHANGE: Join date
    totalContributions: 500000,     // ← CHANGE: Starting contribution amount
    profilePhoto: null
}
```

---

## 3️⃣ HOW TO CHANGE A USER

### **Example: Change Admin User**

**Step 1:** Open `public/js/app.js`

**Step 2:** Find lines 38-80 (the const users array)

**Step 3:** Change the admin user:

```javascript
{
    userId: '1',
    memberId: 'ADMIN001',                              // ← CHANGED FROM 'EUCS001'
    email: 'manager@eumco-op.com',                     // ← CHANGED EMAIL
    password: this.hashPassword('MyPassword@2026!'),   // ← NEW PASSWORD
    firstName: 'John',                                 // ← NEW NAME
    lastName: 'Manager',                               // ← NEW NAME
    role: 'admin',
    status: 'active',
    phone: '+2349012345678',                           // ← NEW PHONE
    joinDate: '2024-01-15',
    totalContributions: 500000,
    profilePhoto: null
}
```

---

## 4️⃣ HOW TO ADD A NEW USER

**Step 1:** Open `public/js/app.js`

**Step 2:** Find the users array (lines 38-80)

**Step 3:** Add a new user object to the array:

```javascript
const users = [
    {
        userId: '1',
        memberId: 'EUCS001',
        // ... admin user data
    },
    {
        userId: '2',
        memberId: 'MEMBER001',              // ← NEW MEMBER ID
        email: 'chioma@eumco-op.com',       // ← NEW EMAIL
        password: this.hashPassword('SafePass@2026!'),  // ← MEMBER PASSWORD
        firstName: 'Chioma',                 // ← MEMBER NAME
        lastName: 'Okoro',
        role: 'member',                      // ← NOT ADMIN
        status: 'active',
        phone: '+2348123456789',
        joinDate: '2024-02-01',
        totalContributions: 250000,
        profilePhoto: null
    },
    // ← ADD YOUR NEW USER HERE
    {
        userId: '3',
        memberId: 'MEMBER002',
        email: 'adeze@eumco-op.com',
        password: this.hashPassword('AnotherPass@2026!'),
        firstName: 'Adezze',
        lastName: 'Nwosu',
        role: 'member',
        status: 'active',
        phone: '+2348098765432',
        joinDate: '2024-03-01',
        totalContributions: 150000,
        profilePhoto: null
    }
];
```

**NOTE:** Make sure each user has a unique `userId` and `memberId`

---

## 5️⃣ HOW TO DELETE A USER

**Step 1:** Open `public/js/app.js`

**Step 2:** Find the users array (lines 38-80)

**Step 3:** DELETE the entire user object. For example, to delete MEMBER002:

```javascript
// BEFORE
const users = [
    { userId: '1', memberId: 'EUCS001', ... },
    { userId: '2', memberId: 'MEMBER001', ... },
    { userId: '3', memberId: 'MEMBER002', ... }  // ← DELETE THIS LINE
];

// AFTER
const users = [
    { userId: '1', memberId: 'EUCS001', ... },
    { userId: '2', memberId: 'MEMBER001', ... }
];
```

---

## 6️⃣ PASSWORD RULES

- **Format:** `this.hashPassword('YourPassword')`
- **Example Passwords:**
  - `Admin@2026!`
  - `SafePass@2026!`
  - `Member@2024!`
- **Note:** Use strong passwords with uppercase, lowercase, numbers, and special characters

---

## 7️⃣ LOGIN CREDENTIALS REFERENCE

After changes, your login credentials will be:

| User | Member ID | Password | Role |
|------|-----------|----------|------|
| System Admin | EUCS001 | Admin@2026! | admin |
| (Or whatever you changed it to) | (Your ID) | (Your password) | admin |

---

## 8️⃣ DEPLOY CHANGES

After modifying users:

```bash
# Step 1: Make sure you're in the EUCS folder
cd c:\Users\PC\Downloads\EUCS

# Step 2: Copy updated file to public folder
Copy-Item -Path .\js\app.js -Destination .\public\js\app.js -Force

# Step 3: Commit and push to GitHub
git add -A
git commit -m "Update: Modified user credentials and added/removed users"
git push origin main
```

The changes will be live on GitHub Pages within a few seconds!

---

## 9️⃣ REMEMBER

- ✅ Always update BOTH files:
  - `js/app.js` (root)
  - `public/js/app.js` (deployed version)
- ✅ Keep passwords secure
- ✅ Make unique Member IDs
- ✅ Test login after changes
- ⚠️ When you deploy, old browsers with cached data might show old users - clear cache

---

## ❌ TROUBLESHOOTING

**Problem:** Login not working with new credentials
- **Solution:** Clear browser cache → Settings → Clear browsing data → Clear localStorage

**Problem:** Can't find the users array
- **Solution:** Search for "EUCS001" in the file, you'll find the users section

**Problem:** Users disappeared after restart
- **Solution:** They're in LocalStorage. Only default users show on first load. Add new users through UI or code.
