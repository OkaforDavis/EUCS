# 🧪 EUCS TESTING GUIDE

## 📍 CURRENT STATUS

**Domain:** NOT PURCHASED YET (will be eumco-op.com)  
**Hosting:** NOT SET UP YET  
**Current Location:** GitHub only  
**Test Location:** Local computer (your machine)

---

## 🚀 HOW TO TEST LOCALLY

### **Step 1: Extract ZIP**
```bash
# Right-click EUCS.zip → Extract All
# OR via terminal:
unzip EUCS.zip
cd EUCS
```

### **Step 2: Open in Browser**

**Option A: Direct File**
```bash
# Double-click this file:
EUCS/public/index.html

# OR drag file into browser
```

**Option B: Local Server** (Better)
```bash
# If you have Python installed:
cd EUCS/public
python -m http.server 8080

# OR if you have Node.js:
npx http-server public -p 8080

# Then visit: http://localhost:8080
```

### **Step 3: Login**
```
Member ID: EUCS001
Password: Admin@2026!
```

---

## ✅ COMPLETE TESTING CHECKLIST

### **1. Login System** (5 minutes)

**Test:**
- [ ] Open index.html in browser
- [ ] Enter correct credentials: EUCS001 / Admin@2026!
- [ ] Click "Login" button
- [ ] Should redirect to dashboard
- [ ] Refresh page - should stay logged in
- [ ] Click logout - should return to login page

**Test Wrong Password:**
- [ ] Enter: EUCS001 / WrongPassword
- [ ] Should show error message
- [ ] Should NOT login

**Test Password Toggle:**
- [ ] Click eye icon next to password field
- [ ] Password should become visible
- [ ] Click again - should hide

---

### **2. Dashboard** (5 minutes)

**Test Statistics Cards:**
- [ ] Should see 4 cards:
  - Total Contributions
  - Active Members
  - Outstanding Loans
  - Withdrawals
- [ ] Numbers should display

**Test Chart:**
- [ ] Should see line chart with data
- [ ] Click "Week" button - chart updates
- [ ] Click "Month" button - chart updates
- [ ] Click "Year" button - chart updates

**Test Recent Activity:**
- [ ] Should see activity list
- [ ] (May be empty if no transactions)

---

### **3. Navigation** (5 minutes)

**Test Each Menu Item:**
- [ ] Click "Overview" - shows dashboard
- [ ] Click "Contributions" - shows contributions page
- [ ] Click "Loans" - shows loans page
- [ ] Click "Withdrawals" - shows withdrawals page
- [ ] Click "Members" - shows member cards
- [ ] Click "Products" - shows products
- [ ] Click "Live Chat" - shows chat interface
- [ ] Click "Reports" - shows report cards
- [ ] Click "Settings" - shows settings

**Each page should load content, not blank!**

---

### **4. Quick Actions** (10 minutes)

**Test "Record Contribution":**
- [ ] Click quick action button
- [ ] Modal pops up
- [ ] Enter amount: 10000
- [ ] Click "Submit"
- [ ] Should see success message
- [ ] Go to Contributions page
- [ ] Should see new contribution in table

**Test "Apply for Loan":**
- [ ] Click quick action button
- [ ] Modal pops up
- [ ] Enter amount: 50000
- [ ] Enter purpose: "Business expansion"
- [ ] Click "Submit Application"
- [ ] Should see success message
- [ ] Go to Loans page
- [ ] Should see loan in table

**Test "Request Withdrawal":**
- [ ] Click quick action button
- [ ] Modal pops up
- [ ] Enter amount: 5000
- [ ] Enter reason: "Emergency"
- [ ] Click "Submit Request"
- [ ] Should see success message
- [ ] Go to Withdrawals page
- [ ] Should see withdrawal in table

**Test "Add Member"** (Admin only):
- [ ] Click quick action button
- [ ] Modal pops up
- [ ] Fill all fields:
  - First Name: John
  - Last Name: Doe
  - Email: john@test.com
  - Phone: +234800000000
  - Password: Test@123!
- [ ] Click "Add Member"
- [ ] Should see success with new Member ID
- [ ] Go to Members page
- [ ] Should see new member card

---

### **5. Products Marketplace** (10 minutes)

**Test View Products:**
- [ ] Navigate to Products page
- [ ] Should see product cards
- [ ] Should see product images
- [ ] Should see prices

**Test Add Product:**
- [ ] Click "Add Product" button
- [ ] Modal pops up
- [ ] Fill form:
  - Name: Test Product
  - Category: Grains
  - Price: 25000
  - Stock: 100
  - Description: Test description
- [ ] Click "Add Product"
- [ ] Should see success message
- [ ] Product appears on page

**Test Purchase Product:**
- [ ] Click "Purchase" on any product
- [ ] Modal pops up
- [ ] Enter quantity: 2
- [ ] Select payment: Paystack
- [ ] Enter delivery address
- [ ] Click "Complete Purchase"
- [ ] Should see success with total amount
- [ ] Should calculate: price × quantity

---

### **6. Profile & Settings** (10 minutes)

**Test Edit Profile:**
- [ ] Navigate to Settings
- [ ] Click "Edit Profile" button
- [ ] Modal pops up with current data
- [ ] Change first name to: NewName
- [ ] Change email to: newemail@test.com
- [ ] Change phone to: +234811111111
- [ ] Add address: New Address
- [ ] Click "Save Profile"
- [ ] Should see success message
- [ ] Check user menu - should show new name
- [ ] Refresh page - changes should persist

**Test Change Password:**
- [ ] Navigate to Settings
- [ ] Click "Change Password" button
- [ ] Modal pops up
- [ ] Enter current password: Admin@2026!
- [ ] Enter new password: NewPass@2026!
- [ ] Confirm new password: NewPass@2026!
- [ ] Click "Change Password"
- [ ] Should see success message
- [ ] Logout
- [ ] Login with new password
- [ ] Should work!

**Test Payment Gateway Settings** (Admin only):
- [ ] Navigate to Settings
- [ ] Should see payment key fields
- [ ] Enter Paystack Public Key: pk_test_123
- [ ] Enter Paystack Secret Key: sk_test_123
- [ ] Enter Flutterwave Public Key: FLWPUBK_123
- [ ] Enter Flutterwave Secret Key: FLWSECK_123
- [ ] Click "Save Payment Keys"
- [ ] Should see success message

**Test Admin Invite:**
- [ ] Navigate to Settings (as admin)
- [ ] Click "Generate Admin Invite Link"
- [ ] Link should appear
- [ ] Click "Copy Link"
- [ ] Should see "Link copied!" message

---

### **7. Members Management** (5 minutes)

**Test View Members:**
- [ ] Navigate to Members page
- [ ] Should see member cards
- [ ] Should see initials in avatar
- [ ] Should see member ID, role
- [ ] Should see contribution amount

**Test Delete Member** (Admin only):
- [ ] Navigate to Members page
- [ ] Find any member (not yourself!)
- [ ] Click "Delete" button
- [ ] Confirm in popup
- [ ] Should see success message
- [ ] Member should disappear
- [ ] Refresh page - still deleted

---

### **8. Live Chat** (5 minutes)

**Test Send Message:**
- [ ] Navigate to Chat page
- [ ] Type message in input box
- [ ] Click "Send" button
- [ ] Message should appear in chat
- [ ] Should show your name
- [ ] Should show timestamp

**Test Chat Rooms:**
- [ ] Should see room list (General, Executives, etc.)
- [ ] Click different room
- [ ] Active room should be highlighted

---

### **9. Reports** (2 minutes)

**Test Report Cards:**
- [ ] Navigate to Reports page
- [ ] Should see report cards
- [ ] Click any report card
- [ ] Should see toast notification
- [ ] (Full reports require backend - this is UI only)

---

### **10. Search Functionality** (3 minutes)

**Test Global Search:**
- [ ] Find search box in header
- [ ] Type: "EUCS"
- [ ] Should see toast with results count
- [ ] Type: "rice" (if you added products)
- [ ] Should show number of products found
- [ ] Type: "john" (if you added member)
- [ ] Should show number of users found

---

### **11. Mobile Responsiveness** (10 minutes)

**Test on Browser DevTools:**
- [ ] Press F12 (open DevTools)
- [ ] Press Ctrl+Shift+M (toggle device toolbar)
- [ ] Select "iPhone SE" (375px)

**Test Mobile Features:**
- [ ] Click hamburger menu (☰)
- [ ] Sidebar should slide in from left
- [ ] Click outside sidebar
- [ ] Sidebar should close ✅ (THIS MUST WORK!)
- [ ] Click menu item
- [ ] Sidebar should close ✅ (THIS MUST WORK!)
- [ ] View should change

**Test Mobile Layout:**
- [ ] Dashboard statistics - should be 2 columns
- [ ] Quick actions - should be 2 columns
- [ ] Members grid - should be 2 columns
- [ ] Products grid - should be 2 columns
- [ ] Text should be readable
- [ ] Buttons should be tap-friendly (not tiny)

**Test Different Devices:**
- [ ] iPhone SE (375px) - smallest
- [ ] iPhone 12 Pro (390px)
- [ ] Pixel 5 (393px)
- [ ] Samsung S20 (360px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

**All should work properly!**

---

### **12. Data Persistence** (3 minutes)

**Test Data Saves:**
- [ ] Add a contribution
- [ ] Refresh page (F5)
- [ ] Go to Contributions page
- [ ] Should still see contribution ✅

- [ ] Add a product
- [ ] Close browser completely
- [ ] Open again
- [ ] Go to Products page
- [ ] Should still see product ✅

**Test Session:**
- [ ] Login
- [ ] Refresh page
- [ ] Should stay logged in ✅
- [ ] Close browser
- [ ] Open again
- [ ] Open site again
- [ ] Should be logged out (session expired)

---

## 🔍 COMMON ISSUES & FIXES

### **Issue:** Login doesn't work
**Fix:** 
- Check browser console (F12)
- Make sure credentials are: EUCS001 / Admin@2026!
- Clear browser cache (Ctrl+Shift+Delete)
- Try again

### **Issue:** Pages are blank
**Fix:**
- Open browser console (F12)
- Look for JavaScript errors (red text)
- Make sure app.js loaded correctly
- Hard refresh (Ctrl+Shift+R)

### **Issue:** Changes don't save
**Fix:**
- Check if localStorage is enabled
- Chrome: Settings → Privacy → Site Settings → Cookies → Allow all
- Try different browser

### **Issue:** Mobile sidebar doesn't close
**Fix:**
- This should work! If not:
- Check console for errors
- Make sure you're clicking OUTSIDE the sidebar
- Try clicking on gray overlay area

### **Issue:** Chart doesn't show
**Fix:**
- Check if Chart.js loaded
- Open console, type: typeof Chart
- Should say "function"
- If "undefined", internet connection issue

### **Issue:** Images don't load
**Fix:**
- Product images use placeholder service
- Requires internet connection
- If offline, images won't show (this is normal)

---

## 📊 TESTING METRICS

### **What to Check:**
- ✅ All pages load
- ✅ All buttons work
- ✅ All forms submit
- ✅ All modals open/close
- ✅ All data saves
- ✅ All data persists
- ✅ Mobile sidebar closes properly
- ✅ Mobile layout is 2 columns
- ✅ No JavaScript errors
- ✅ No broken features

### **Performance:**
- Page should load in < 2 seconds
- Navigation should be instant
- Forms should submit in < 1 second
- Modals should open instantly

---

## 🎯 FINAL TESTING CHECKLIST

Before deployment:
- [ ] All 12 test sections passed
- [ ] Mobile responsiveness verified
- [ ] All features work
- [ ] No console errors
- [ ] Data persists correctly
- [ ] Sidebar closes on mobile
- [ ] Can add/edit/delete users
- [ ] Can add products
- [ ] Can purchase products
- [ ] Profile editing works
- [ ] Password change works
- [ ] Payment keys save (admin)
- [ ] Ready for GitHub commit

---

## 📝 TEST LOG

**Date:** _____________  
**Tester:** _____________  
**Browser:** _____________  
**OS:** _____________  

**Tests Passed:** ____ / 12  
**Issues Found:** _____________  
**Status:** ☐ Pass ☐ Fail ☐ Needs Fixes

---

## 🚀 AFTER TESTING

### **If all tests pass:**
```bash
# Commit to GitHub
git add .
git commit -m "All tests passed - ready for deployment"
git push
```

### **If tests fail:**
1. Note which test failed
2. Check browser console for errors
3. Review CHANGES_LOCATION.md for fixes
4. Fix the issue
5. Re-test
6. Repeat until all pass

---

## 🌐 WHEN READY TO DEPLOY

1. ✅ All local tests pass
2. ✅ Purchase domain: eumco-op.com
3. ✅ Purchase hosting: Hostinger/Namecheap
4. ✅ Upload `public/` folder to hosting
5. ✅ Test on live URL
6. ✅ Verify all features work online
7. ✅ Test on real mobile devices
8. ✅ Go live!

---

**Status:** ✅ System Ready for Testing  
**Next Step:** Test locally, then commit to GitHub  
**Future:** When domain/hosting ready, deploy
