# 🌳 EUCS - Elugwu Umuoshie Co-operative Society

**Complete Cooperative Financial Management System v3.0**

🌐 **Domain:** eumco-op.com  
📦 **Repository:** https://github.com/OkaforDavis/EUCS  
✅ **Status:** Production Ready

---

## ⚡ Quick Start

```bash
# 1. Extract ZIP file
unzip EUCS.zip
cd EUCS

# 2. Open in browser
open public/index.html
# OR start local server
npx http-server public -p 8080

# 3. Login
Member ID: EUCS001
Password: Admin@2026!
```

---

## 📋 Complete Features

### ✅ Financial Management
- Member contributions (weekly/monthly/quarterly/yearly)
- Loan applications with approval workflow
- Withdrawal requests
- Payment gateway (Paystack + Flutterwave)
- Automated receipts

### ✅ Products Marketplace
- Add products for sale
- Purchase products
- Order management
- Multiple payment options

### ✅ User Management
- Role-based access control
- Profile management
- Password change
- Admin invites

### ✅ Communication
- Live chat messaging
- Real-time notifications
- Toast feedback system

### ✅ Mobile-First
- 2-column responsive grids
- Sidebar closes on outside click
- Touch-optimized interface
- PWA ready

---

## 📁 Project Structure

```
EUCS/
├── public/                  # Frontend files
│   ├── index.html          # Main page
│   ├── css/styles.css      # Stylesheet
│   ├── js/app.js           # Application
│   └── icons/              # App icons
├── docs/                    # Documentation
│   └── COMPLETE_GUIDE.md   # Full guide
├── server.js                # Backend (optional)
├── database_schema.sql      # Database schema
└── README.md                # This file
```

---

## 🧪 Testing

See `COMPLETE_GUIDE.md` for comprehensive testing instructions.

**Quick Test:**
1. Open `public/index.html`
2. Login with `EUCS001` / `Admin@2026!`
3. Test all features

---

## 🌐 Deployment

### Hostinger / Namecheap
1. Upload `public/` folder contents to `/public_html/`
2. Configure domain
3. Enable SSL
4. Done!

**Full deployment guide:** See `COMPLETE_GUIDE.md`

---

## 🗄️ Database Management

**Add User (Browser Console - F12):**
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

**Delete User:**
```javascript
const users = JSON.parse(localStorage.getItem('eucs_users'));
const filtered = users.filter(u => u.userId !== 'USER_ID_HERE');
localStorage.setItem('eucs_users', JSON.stringify(filtered));
location.reload();
```

**Reset System:**
```javascript
localStorage.clear();
location.reload();
```

---

## 🔑 Payment Gateway Setup

### Paystack
1. Get keys from https://paystack.com
2. Login as admin → Settings
3. Add Paystack keys
4. Save

### Flutterwave
1. Get keys from https://flutterwave.com
2. Login as admin → Settings
3. Add Flutterwave keys
4. Save

---

## 📞 Support

**Issues:** https://github.com/OkaforDavis/EUCS/issues  
**Email:** support@eumco-op.com  
**Documentation:** See `COMPLETE_GUIDE.md`

---

## 📄 License

Copyright © 2026 Elugwu Umuoshie Co-operative Society Ltd  
All rights reserved.

---

**Built with ❤️ for the Elugwu Umuoshie community**
