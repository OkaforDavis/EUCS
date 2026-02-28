# 🚀 DEPLOYMENT GUIDE - EUCS TO HOSTINGER/NAMECHEAP

This guide shows how to deploy EUCS to your own domain (eumco-op.com or any domain) using Hostinger or Namecheap.

---

## 📋 REQUIREMENTS

1. **Domain Name** - e.g., `eumco-op.com` (purchase on Namecheap or Hostinger)
2. **Hosting Provider** - Hostinger or Namecheap
3. **FTP/File Manager Access** - Usually included with hosting
4. **GitHub Account** - For code backups

---

## 🌳 OPTION 1: HOSTINGER (RECOMMENDED)

### **Step 1: Purchase Domain**

1. Go to [Hostinger.com](https://hostinger.com)
2. Click "Domains" → Search for `eumco-op.com`
3. Add to cart and complete purchase (~₦3,500-5,000/year)
4. Note your domain credentials

### **Step 2: Purchase Hosting**

1. Go to "Web Hosting" on Hostinger
2. Choose a plan (Basic plan is enough: ~₦2,000-3,000/month)
3. Select your domain `eumco-op.com`
4. Complete purchase
5. You'll get:
   - FTP username & password
   - FTP host/server
   - Email access

### **Step 3: Connect to Hosting via File Manager**

**Using Hostinger File Manager (Easiest):**

1. Log in to Hostinger Dashboard
2. Click "Web Hosting" → Your domain
3. Click "File Manager"
4. Navigate to `public_html` folder
5. This is where you upload your files

**Using FTP Client (FileZilla):**

1. Download [FileZilla](https://filezilla-project.org/)
2. Open FileZilla
3. Go to File → Site Manager → New site
4. Add Hostinger FTP details:
   - **Host:** your-ftp-host (from Hostinger email)
   - **Username:** your-ftp-username
   - **Password:** your-ftp-password
   - **Port:** 21
5. Click "Connect"
6. Navigate to `public_html` folder

### **Step 4: Upload Files to Hostinger**

**Via File Manager:**

1. Click "Upload Files" button
2. Select all files from EUCS folder (index.html, css/, js/, public/, etc.)
3. Click "Upload"
4. Wait for upload to complete

**Via FTP (FileZilla):**

1. On **left panel:** Browse to your EUCS folder on computer
2. On **right panel:** You should see `public_html` folder
3. Double-click `public_html` to open it
4. **Drag & drop** all files from left to right
5. Wait for all files to upload (green checkmark = uploaded)

### **Step 5: Organize Files in public_html**

After upload, your `public_html` should look like:

```
public_html/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── public/
    ├── icons/
    └── images/
```

**⚠️ IMPORTANT:** Make sure `index.html` is IN `public_html` directly (not in a subfolder)

### **Step 6: Test Your Domain

1. Open your browser
2. Go to `http://eumco-op.com` (or your domain)
3. You should see the EUCS login page!

### **Step 7: Enable HTTPS (SSL)**

1. Go back to Hostinger Dashboard
2. Click "SSL" → "Manage SSL"
3. Click "Activate Free SSL Certificate"
4. Wait 15-30 minutes for activation
5. Your site will be at `https://eumco-op.com` ✅

---

## 🔗 OPTION 2: NAMECHEAP

### **Step 1: Purchase Domain**

1. Go to [Namecheap.com](https://namecheap.com)
2. Search for `eumco-op.com`
3. Add to cart and checkout (~₦3,500-5,000/year)

### **Step 2: Get Free Hosting (or Purchase)**

**Option A: Free Hosting (Limited)**
- Namecheap offers free basic hosting with domain purchase
- Limited storage and bandwidth

**Option B: Purchase Premium Hosting**
1. Go to "Hosting" → Select a plan
2. Cost: ~₦2,000-3,000/month
3. Connect to your domain

### **Step 3: Upload Files to Namecheap**

1. Go to your Namecheap Dashboard
2. Click "Hosting" → Your hosting account
3. Click "Control Panel" (cPanel)
4. Click  "File Manager"
5. Navigate to `public_html`
6. Click "Upload" button
7. Select all EUCS files
8. Upload all files

### **Step 4: Configure**

1. Make sure `index.html` is in `public_html` root
2. File structure should be the same as Hostinger option

### **Step 5: Enable HTTPS**

1. In cPanel, find "SSL/TLS Status"
2. Click "Manage"
3. Select your domain
4. Click "AutoSSL" → Enable

### **Step 6: Test Your Domain**

1. Go to `https://eumco-op.com`
2. Should see the login page!

---

## 📞 IMPORTANT CONFIGURATION

After deployment, edit these files based on your domain:

### **public/index.html (Line 8)**

Change the Content Security Policy:

```html
<!-- BEFORE -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.paystack.co https://api.flutterwave.com;">

<!-- AFTER - for eumco-op.com -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.paystack.co https://api.flutterwave.com;">
```

---

## 💳 SETTING UP PAYMENT PROCESSING

### **Paystack Setup** (Primary)

1. Go to [Paystack.com](https://paystack.com)
2. Create merchant account (Nigeria)
3. Verify identity and bank account
4. Get your **Public Key** and **Secret Key**
5. In `public/js/app.js` (Line ~720), add:

```javascript
const PAYMENT_CONFIG = {
    paystack: {
        publicKey: 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY_HERE',
        secretKey: 'sk_live_YOUR_PAYSTACK_SECRET_KEY_HERE'
    },
    flutterwave: {
        publicKey: 'FLWPUBK_LIVE_YOUR_FLUTTERWAVE_KEY_HERE'
    }
};
```

### **Flutterwave Setup** (Alternative)

1. Go to [Flutterwave.com](https://flutterwave.com)
2. Create merchant account
3. Complete KYC verification
4. Get your **Public Key**
5. Add to the config above

---

## 🔄 UPDATING YOUR SITE

After making changes locally:

### **Method 1: Via GitHub**

```bash
# In your EUCS folder
git add -A
git commit -m "Update: Made changes to [file/feature]"
git push origin main
```

Then re-upload via FTP/File Manager to your hosting

### **Method 2: Direct Upload**

1. Open File Manager (Hostinger/Namecheap)
2. Navigate to `public_html`
3. Delete old files
4. Upload new versions
5. Refresh browser (Ctrl+Shift+R) to clear cache

---

## ⚡ PERFORMANCE TIPS

1. **Enable Caching:**
   - In cPanel, go to "Caching" → Enable all caching options

2. **Optimize Images:**
   - Replace large images with WebP format
   - Compress images using TinyPNG.com

3. **Use CDN:**
   - Nameserver already uses CloudFlare (automatic CDN)
   - Hostinger can add CloudFlare for ₦500/month extra

4. **Minify Code:**
   - Before uploading, minimize your CSS and JS files

---

## 🔒 SECURITY SETUP

1. **Backup Real Frequently**
   - Monthly backups to GitHub
   - Use "Backup Wizard" in cPanel

2. **Enable WAF (Web Application Firewall)**
   - Hostinger: Dashboard → Security → Enable WAF
   - Namecheap: cPanel → ModSecurity

3. **Change Default Admin**
   - Edit `public/js/app.js` (USER_MANAGEMENT_GUIDE.md)
   - Create strong password

4. **Regular Updates**
   - Keep passwords updated
   - Regularly test login functionality

---

## 📊 MONITORING YOUR SITE

### **Check Uptime:**
- Use [UptimeRobot.com](https://uptimerobot.com)
- Free monitoring - alerts if site goes down

### **Check Performance:**
- Use [PageSpeed Insights](https://pagespeed.web.dev)
- Enter your domain

### **Analytics:**
- Add Google Analytics to `public/index.html` (Optional)
- Track visitor behavior

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **"Page not found" error** | Ensure `index.html` is in `public_html` root |
| **No CSS/JS loading** | Check file paths in HTML (must use relative paths) |
| **Images not showing** | Verify images folder structure matches |
| **Login not working** | Clear cache, enable browser developer tools to check errors |
| **Domain not resolving** | Wait 24-48 hours for DNS propagation, then try |
| **Slow loading** | Enable caching, optimize images, use CDN |

---

## 📝 CHECKLIST FOR DEPLOYMENT

- [ ] Purchase domain on Hostinger/Namecheap
- [ ] Purchase hosting plan
- [ ] Get FTP/File Manager access
- [ ] Download EUCS files from GitHub
- [ ] Upload to `public_html` folder
- [ ] Verify file structure is correct
- [ ] Test your domain in browser
- [ ] Enable SSL/HTTPS
- [ ] Change default admin credentials
- [ ] Set up Paystack/Flutterwave keys
- [ ] Test payment processing
- [ ] Set up monitoring (UptimeRobot)
- [ ] Enable WAF/Security
- [ ] Create backup strategy
- [ ] Test on mobile devices

---

## 💡 NEXT STEPS

After successful deployment:

1. **Customize Branding:**
   - Change colors in `public/css/styles.css`
   - Update logo in `public/index.html`

2. **Add More Members:**
   - Follow USER_MANAGEMENT_GUIDE.md
   - Update `public/js/app.js`

3. **Enable Features:**
   - Products page (already built)
   - Member profiles (already built)
   - Settings page (already built)

4. **Scale Up:**
   - Consider upgrading to VPS if traffic grows
   - Add database (MySQL) for permanent data storage

---

**Need help?** Contact your hosting provider's support team or consult the documentation at:
- [Hostinger Support](https://support.hostinger.com)
- [Namecheap Support](https://support.namecheap.com)
