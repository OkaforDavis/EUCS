# EUCS - Elugwu Umuoshie Co-operative Society

**Complete Cooperative Financial Management System v3.0**

🌐 **Live Demo:** https://okafordavis.github.io/EUCS/  
📦 **Repository:** https://github.com/OkaforDavis/EUCS

---

## 🚀 Quick Start

### **Test Locally:**
1. Clone this repository
2. Open `index.html` in browser
3. Login: **EUCS001** / **Admin@2026!**

### **Access Online:**
Visit: https://okafordavis.github.io/EUCS/

---

## 📁 Repository Structure

```
EUCS/                    ← GitHub repository root
├── index.html          ← Main page (GitHub Pages serves this)
├── css/
│   └── styles.css      ← All styling
├── js/
│   └── app.js          ← All functionality
├── icons/              ← App icons (add your own)
├── images/             ← Images (add your own)
├── docs/
│   ├── CHANGES_LOCATION.md  ← Where to edit
│   └── TESTING_GUIDE.md     ← How to test
└── README.md           ← This file
```

---

## ✨ Features

### Financial Management
- ✅ Member contributions (weekly/monthly/quarterly/yearly)
- ✅ Loan applications with approval workflow
- ✅ Withdrawal requests
- ✅ Payment gateway (Paystack + Flutterwave)

### Products Marketplace
- ✅ Add products for sale
- ✅ Purchase products
- ✅ Order management
- ✅ Multiple payment options

### User Management
- ✅ Profile editing
- ✅ Password change
- ✅ Admin invite system
- ✅ User deletion (admin only)

### Communication
- ✅ Live chat messaging
- ✅ Toast notifications
- ✅ Real-time feedback

### Mobile-First
- ✅ 2-column responsive grids
- ✅ Sidebar closes on outside click
- ✅ Touch-optimized interface
- ✅ Works on all devices (320px - 1920px+)

---

## 🔧 Customization

**See:** [docs/CHANGES_LOCATION.md](docs/CHANGES_LOCATION.md)

**To change default admin:**
- Edit: `js/app.js` (Line 40-65)
- Change: memberId, email, password, name

**To change branding:**
- Edit: `index.html` (Lines 25, 45, 50)
- Change: System name, tagline

**To change colors:**
- Edit: `css/styles.css` (Lines 1-50)
- Change: CSS color variables

---

## 🧪 Testing

**See:** [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)

**Quick test:**
1. Open `index.html`
2. Login: EUCS001 / Admin@2026!
3. Test all features

---

## 🗄️ Database Management

**Current:** LocalStorage (browser-based)

**View all users (Browser Console - F12):**
```javascript
console.table(JSON.parse(localStorage.getItem('eucs_users')));
```

**Add user:**
```javascript
const users = JSON.parse(localStorage.getItem('eucs_users'));
users.push({
    userId: String(users.length + 1),
    memberId: 'EUCS' + String(users.length + 1).padStart(3, '0'),
    email: 'user@eumco-op.com',
    password: btoa('Password123!'),
    firstName: 'First',
    lastName: 'Last',
    role: 'member',
    status: 'active',
    phone: '+234800000000',
    joinDate: new Date().toISOString()
});
localStorage.setItem('eucs_users', JSON.stringify(users));
location.reload();
```

**Delete user:**
```javascript
const users = JSON.parse(localStorage.getItem('eucs_users'));
const filtered = users.filter(u => u.userId !== '2');
localStorage.setItem('eucs_users', JSON.stringify(filtered));
location.reload();
```

**Reset everything:**
```javascript
localStorage.clear();
location.reload();
```

---

## 🌐 Deployment

### **GitHub Pages (Current)**
Already live at: https://okafordavis.github.io/EUCS/

### **Custom Domain (Future: eumco-op.com)**

**Option 1: GitHub Pages with custom domain**
1. Purchase domain: eumco-op.com
2. Go to repository Settings → Pages
3. Add custom domain
4. Configure DNS records

**Option 2: Traditional hosting**
1. Purchase hosting (Hostinger/Namecheap)
2. Upload these files to `/public_html/`:
   - index.html
   - css/
   - js/
   - icons/
   - images/
3. Enable SSL
4. Visit: https://eumco-op.com

---

## 📱 Mobile Testing

**Browser DevTools:**
1. Press F12
2. Press Ctrl+Shift+M (device view)
3. Select device (iPhone, Pixel, etc.)
4. Test all features

**Works on:**
- ✅ iPhone SE (375px)
- ✅ iPhone 12 Pro (390px)
- ✅ Pixel 5 (393px)
- ✅ Samsung S20 (360px)
- ✅ iPad (768px)
- ✅ iPad Pro (1024px)

---

## 🔑 Default Credentials

**Admin:**
```
Member ID: EUCS001
Password: Admin@2026!
```

⚠️ **Change before going live!**

---

## 📞 Support

**Issues:** https://github.com/OkaforDavis/EUCS/issues  
**Documentation:**
- [CHANGES_LOCATION.md](docs/CHANGES_LOCATION.md) - How to customize
- [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) - How to test

---

## 📄 License

Copyright © 2026 Elugwu Umuoshie Co-operative Society Ltd  
All rights reserved.

---

## 🎯 Current Status

**Repository:** ✅ Active  
**GitHub Pages:** ✅ Live at https://okafordavis.github.io/EUCS/  
**Custom Domain:** ⏳ Not configured yet (future: eumco-op.com)

---

**Version:** 3.0  
**Last Updated:** February 22, 2026  
**Built with ❤️ for Elugwu Umuoshie Co-operative**
