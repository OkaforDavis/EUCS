# 🌳 EUCS - Elugwu Umuoshie Co-operative Society

**Complete Cooperative Financial Management System**

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)]()
[![Version](https://img.shields.io/badge/version-2.0-blue.svg)]()

---

## 📋 Quick Start

```bash
# Clone the repository
git clone https://github.com/OkaforDavis/EUCS.git
cd EUCS

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
createdb eucs_main
psql eucs_main < database_schema.sql

# Start development server
npm run dev
```

**Access:** http://localhost:5000

---

## 🔑 Demo Accounts

### Admin Account
- **Member ID:** `EUCS001`
- **Password:** `Admin@2026!`
- **Access:** Full system access, settings, admin invite

### Member Account
- **Member ID:** `EUCS002`
- **Password:** `Member@2026!`
- **Access:** Contributions, loans, withdrawals

---

## 📁 Project Structure

```
EUCS/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # Complete stylesheet
│   ├── js/
│   │   └── app.js         # Application logic
│   ├── icons/             # App icons
│   └── images/            # Assets
│
├── config/                 # Configuration files
├── middleware/             # Express middleware
├── models/                 # Database models
├── controllers/            # Business logic
├── routes/                 # API routes
├── services/               # External services
├── utils/                  # Helper functions
├── tests/                  # Test suites
├── scripts/                # Deployment scripts
├── docs/                   # Documentation
│
├── server.js               # Express server
├── package.json            # Dependencies
├── database_schema.sql     # PostgreSQL schema
└── .env.example            # Environment template
```

---

## ✨ Features

### Financial Management
- ✅ Member contributions (weekly/monthly/quarterly/yearly)
- ✅ Loan applications with eligibility checking
- ✅ Withdrawal requests with approval workflow
- ✅ Payment gateway integration (Paystack & Flutterwave)
- ✅ Automated PDF receipt generation

### Member Management
- ✅ User registration and authentication
- ✅ Role-based access control (Admin, Chairman, Treasurer, etc.)
- ✅ Member directory with search
- ✅ Profile management

### Communication
- ✅ Real-time chat system
- ✅ Push notifications
- ✅ Email & SMS notifications
- ✅ WhatsApp group integration

### Admin Tools
- ✅ Dashboard with analytics
- ✅ Payment gateway configuration
- ✅ Admin invite system
- ✅ Financial reports
- ✅ Audit logging

### Mobile-First Design
- ✅ Progressive Web App (PWA)
- ✅ Responsive on all devices
- ✅ Touch-optimized interface
- ✅ Offline support

---

## 🔒 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Bcrypt password hashing (12 rounds)
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection protection
- ✅ Rate limiting
- ✅ Session timeout (30 minutes)
- ✅ Failed login tracking
- ✅ Account lockout mechanism
- ✅ Comprehensive audit logging

---

## 📱 Mobile Responsive

### Desktop (1024px+)
- 4-column grids
- Full sidebar navigation
- Complete feature access

### Tablet (768px - 1023px)
- 2-column grids
- Collapsible sidebar
- Touch-optimized controls

### Mobile (< 768px)
- 2-column grids
- Bottom navigation
- Swipe gestures
- Larger touch targets

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name eucs-api

# Save configuration
pm2 save
pm2 startup
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name eucs.coop;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📚 Documentation

- [Complete Guide](docs/FIXES_APPLIED.md) - All features explained
- [API Documentation](docs/BACKEND_STRUCTURE.md) - Complete API reference
- [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md) - Setup instructions
- [Brand Guidelines](docs/BRANDING_GUIDE.md) - Brand identity

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run security tests
npm run test:security
```

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom Properties)
- Vanilla JavaScript (ES6+)
- Chart.js for visualizations

### Backend
- Node.js
- Express.js
- PostgreSQL
- Redis (session management)
- Socket.IO (real-time features)

### Security
- Helmet.js
- bcrypt
- jsonwebtoken
- express-rate-limit
- CORS

### Payments
- Paystack
- Flutterwave

---

## 📞 Support

For issues, questions, or contributions:
- **Issues:** [GitHub Issues](https://github.com/OkaforDavis/EUCS/issues)
- **Discussions:** [GitHub Discussions](https://github.com/OkaforDavis/EUCS/discussions)
- **Email:** support@eucs.coop

---

## 📄 License

Copyright © 2026 Elugwu Umuoshie Co-operative Society Ltd. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🙏 Acknowledgments

Built with ❤️ for the Elugwu Umuoshie community.

**Tagline:** *Building Prosperity Together*

---

**Version:** 2.0.0  
**Last Updated:** February 21, 2026  
**Status:** Production Ready ✅
