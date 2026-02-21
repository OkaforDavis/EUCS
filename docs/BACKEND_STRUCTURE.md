# 🏗️ EUCS Backend - Complete Structure & API Documentation

## Project Structure

```
eucs-backend/
├── server.js                      # Main server file ✅
├── package.json                    # Dependencies ✅
├── .env.example                    # Environment template ✅
├── database_schema.sql             # Database schema ✅
│
├── config/
│   ├── database.js                # PostgreSQL connection pool
│   ├── logger.js                  # Winston logger configuration
│   ├── redis.js                   # Redis client setup
│   ├── email.js                   # Nodemailer configuration
│   ├── sms.js                     # SMS provider setup
│   └── storage.js                 # File storage (Cloudinary/S3)
│
├── middleware/
│   ├── auth.js                    # JWT authentication
│   ├── rateLimiter.js             # Rate limiting
│   ├── validator.js               # Input validation
│   ├── errorHandler.js            # Global error handler
│   ├── requestLogger.js           # Request logging
│   ├── upload.js                  # File upload handling
│   └── permissions.js             # Role-based access control
│
├── models/
│   ├── User.model.js              # User database operations
│   ├── Contribution.model.js     # Contributions

 CRUD
│   ├── Loan.model.js              # Loans CRUD
│   ├── Withdrawal.model.js        # Withdrawals CRUD
│   ├── BarnProduct.model.js       # Barn products CRUD
│   ├── BarnOrder.model.js         # Barn orders CRUD
│   ├── Message.model.js           # Chat messages CRUD
│   ├── Notification.model.js      # Notifications CRUD
│   └── AuditLog.model.js          # Audit trail logging
│
├── controllers/
│   ├── auth.controller.js         # Authentication logic
│   ├── user.controller.js         # User management
│   ├── contribution.controller.js # Contributions handling
│   ├── loan.controller.js         # Loan processing
│   ├── withdrawal.controller.js   # Withdrawal processing
│   ├── barn.controller.js         # Barn marketplace
│   ├── chat.controller.js         # Chat functionality
│   ├── notification.controller.js # Notifications
│   ├── admin.controller.js        # Admin operations
│   ├── report.controller.js       # Reports generation
│   └── payment.controller.js      # Payment processing
│
├── routes/
│   ├── auth.routes.js             # /api/v1/auth/*
│   ├── user.routes.js             # /api/v1/users/*
│   ├── contribution.routes.js     # /api/v1/contributions/*
│   ├── loan.routes.js             # /api/v1/loans/*
│   ├── withdrawal.routes.js       # /api/v1/withdrawals/*
│   ├── barn.routes.js             # /api/v1/barn/*
│   ├── chat.routes.js             # /api/v1/chat/*
│   ├── notification.routes.js     # /api/v1/notifications/*
│   ├── admin.routes.js            # /api/v1/admin/*
│   ├── report.routes.js           # /api/v1/reports/*
│   └── payment.routes.js          # /api/v1/payments/*
│
├── services/
│   ├── auth.service.js            # Authentication business logic
│   ├── email.service.js           # Email sending
│   ├── sms.service.js             # SMS sending
│   ├── payment.service.js         # Payment gateway integration
│   ├── receipt.service.js         # Receipt generation (PDF)
│   ├── notification.service.js    # Notification delivery
│   ├── storage.service.js         # File upload/storage
│   ├── encryption.service.js      # Data encryption/decryption
│   ├── loan-eligibility.service.js # Loan eligibility checking
│   └── report.service.js          # Report generation
│
├── utils/
│   ├── validator.js               # Validation helpers
│   ├── sanitizer.js               # Input sanitization
│   ├── pagination.js              # Pagination helper
│   ├── dateHelper.js              # Date utilities
│   ├── numberHelper.js            # Number formatting (Naira)
│   ├── pdfGenerator.js            # PDF generation
│   └── csvParser.js               # CSV import/export
│
├── tests/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
│
├── scripts/
│   ├── migrate.js                 # Database migration runner
│   ├── seed.js                    # Database seeding
│   ├── backup.js                  # Database backup script
│   └── cleanup.js                 # Cleanup old data
│
├── uploads/                        # Temporary upload directory
├── logs/                           # Application logs
└── docs/                           # API documentation
```

---

## 📡 Complete API Endpoints

### 🔐 Authentication Endpoints

```
POST   /api/v1/auth/register              - Register new member
POST   /api/v1/auth/login                 - Login (returns JWT)
POST   /api/v1/auth/logout                - Logout
POST   /api/v1/auth/refresh-token         - Refresh access token
POST   /api/v1/auth/forgot-password       - Request password reset
POST   /api/v1/auth/reset-password        - Reset password with token
POST   /api/v1/auth/verify-email          - Verify email address
POST   /api/v1/auth/resend-verification   - Resend verification email
POST   /api/v1/auth/setup-2fa             - Setup two-factor auth
POST   /api/v1/auth/verify-2fa            - Verify 2FA code
POST   /api/v1/auth/google                - Google OAuth login
POST   /api/v1/auth/google/callback       - Google OAuth callback
```

### 👤 User Management

```
GET    /api/v1/users/me                   - Get current user profile
PUT    /api/v1/users/me                   - Update profile
PUT    /api/v1/users/me/password          - Change password
POST   /api/v1/users/me/photo             - Upload profile photo
GET    /api/v1/users/:id                  - Get user by ID (admin)
GET    /api/v1/users                      - List all users (admin)
PUT    /api/v1/users/:id                  - Update user (admin)
DELETE /api/v1/users/:id                  - Delete user (admin)
PUT    /api/v1/users/:id/status           - Change user status (admin)
PUT    /api/v1/users/:id/role             - Change user role (admin)
GET    /api/v1/users/search               - Search users
GET    /api/v1/users/:id/balance          - Get user balance
GET    /api/v1/users/:id/statistics       - Get user statistics
```

### 💰 Contributions

```
POST   /api/v1/contributions              - Record new contribution
GET    /api/v1/contributions              - List contributions (paginated)
GET    /api/v1/contributions/:id          - Get contribution details
PUT    /api/v1/contributions/:id          - Update contribution
DELETE /api/v1/contributions/:id          - Delete contribution (admin)
POST   /api/v1/contributions/:id/verify   - Verify contribution (admin)
GET    /api/v1/contributions/user/:userId - Get user contributions
GET    /api/v1/contributions/export       - Export contributions (CSV)
POST   /api/v1/contributions/import       - Import contributions (CSV)
GET    /api/v1/contributions/statistics   - Get contribution statistics

POST   /api/v1/contributions/plans        - Create contribution plan
GET    /api/v1/contributions/plans        - List contribution plans
PUT    /api/v1/contributions/plans/:id    - Update contribution plan
DELETE /api/v1/contributions/plans/:id    - Delete contribution plan
```

### 🏦 Loans

```
POST   /api/v1/loans                      - Apply for loan
GET    /api/v1/loans                      - List loans
GET    /api/v1/loans/:id                  - Get loan details
PUT    /api/v1/loans/:id                  - Update loan
DELETE /api/v1/loans/:id                  - Cancel loan application

POST   /api/v1/loans/:id/approve          - Approve loan (admin)
POST   /api/v1/loans/:id/reject           - Reject loan (admin)
POST   /api/v1/loans/:id/disburse         - Disburse loan (admin)
POST   /api/v1/loans/:id/guarantor        - Add/approve as guarantor
GET    /api/v1/loans/:id/schedule         - Get repayment schedule
POST   /api/v1/loans/:id/repayments       - Record repayment
GET    /api/v1/loans/:id/repayments       - Get repayment history
GET    /api/v1/loans/user/:userId         - Get user loans
GET    /api/v1/loans/eligibility/:userId  - Check loan eligibility

GET    /api/v1/loans/products             - List loan products
POST   /api/v1/loans/products             - Create loan product (admin)
PUT    /api/v1/loans/products/:id         - Update loan product (admin)
```

### 💸 Withdrawals

```
POST   /api/v1/withdrawals                - Request withdrawal
GET    /api/v1/withdrawals                - List withdrawals
GET    /api/v1/withdrawals/:id            - Get withdrawal details
PUT    /api/v1/withdrawals/:id            - Update withdrawal
DELETE /api/v1/withdrawals/:id            - Cancel withdrawal

POST   /api/v1/withdrawals/:id/approve    - Approve withdrawal (admin)
POST   /api/v1/withdrawals/:id/reject     - Reject withdrawal (admin)
POST   /api/v1/withdrawals/:id/process    - Process withdrawal (admin)
GET    /api/v1/withdrawals/user/:userId   - Get user withdrawals
GET    /api/v1/withdrawals/pending        - Get pending withdrawals (admin)
```

### 🏪 Barn (Agricultural Marketplace)

```
# Products
POST   /api/v1/barn/products              - Create product listing
GET    /api/v1/barn/products              - List all products
GET    /api/v1/barn/products/:id          - Get product details
PUT    /api/v1/barn/products/:id          - Update product
DELETE /api/v1/barn/products/:id          - Delete product
POST   /api/v1/barn/products/:id/images   - Upload product images
GET    /api/v1/barn/products/search       - Search products
GET    /api/v1/barn/products/category/:id - Get products by category
GET    /api/v1/barn/products/seller/:id   - Get seller's products
GET    /api/v1/barn/products/featured     - Get featured products

# Categories
GET    /api/v1/barn/categories            - List categories
POST   /api/v1/barn/categories            - Create category (admin)
PUT    /api/v1/barn/categories/:id        - Update category (admin)

# Orders
POST   /api/v1/barn/orders                - Create order
GET    /api/v1/barn/orders                - List orders
GET    /api/v1/barn/orders/:id            - Get order details
PUT    /api/v1/barn/orders/:id/status     - Update order status
POST   /api/v1/barn/orders/:id/pay        - Pay for order
GET    /api/v1/barn/orders/buyer/:userId  - Get buyer orders
GET    /api/v1/barn/orders/seller/:userId - Get seller orders
```

### 💬 Chat & Messaging

```
GET    /api/v1/chat/rooms                 - List chat rooms
GET    /api/v1/chat/rooms/:id             - Get room details
POST   /api/v1/chat/rooms/:id/join        - Join chat room
POST   /api/v1/chat/rooms/:id/leave       - Leave chat room
GET    /api/v1/chat/rooms/:id/messages    - Get room messages
POST   /api/v1/chat/rooms/:id/messages    - Send message
PUT    /api/v1/chat/messages/:id          - Edit message
DELETE /api/v1/chat/messages/:id          - Delete message
POST   /api/v1/chat/messages/:id/read     - Mark as read
```

### 🔔 Notifications

```
GET    /api/v1/notifications              - List notifications
GET    /api/v1/notifications/:id          - Get notification
PUT    /api/v1/notifications/:id/read     - Mark as read
PUT    /api/v1/notifications/read-all     - Mark all as read
DELETE /api/v1/notifications/:id          - Delete notification
GET    /api/v1/notifications/unread       - Get unread count
```

### 💳 Payments

```
POST   /api/v1/payments/initialize        - Initialize payment
GET    /api/v1/payments/:reference        - Verify payment
POST   /api/v1/payments/webhook/paystack  - Paystack webhook
POST   /api/v1/payments/webhook/flutterwave - Flutterwave webhook
GET    /api/v1/payments/history           - Get payment history
GET    /api/v1/payments/:id/receipt       - Get payment receipt
```

### 🔧 Admin Operations

```
GET    /api/v1/admin/dashboard            - Get dashboard statistics
GET    /api/v1/admin/users                - List all users
PUT    /api/v1/admin/users/:id            - Update user
DELETE /api/v1/admin/users/:id            - Delete user
GET    /api/v1/admin/audit-log            - View audit log
GET    /api/v1/admin/system-health        - System health check

# Settings Management
GET    /api/v1/admin/settings             - Get all settings
GET    /api/v1/admin/settings/:key        - Get specific setting
PUT    /api/v1/admin/settings/:key        - Update setting
POST   /api/v1/admin/settings/payment     - Update payment keys

# Bulk Operations
POST   /api/v1/admin/bulk-contributions   - Import contributions
POST   /api/v1/admin/bulk-users           - Import users
POST   /api/v1/admin/send-notification    - Send bulk notification
```

### 📊 Reports & Analytics

```
GET    /api/v1/reports/contributions      - Contributions report
GET    /api/v1/reports/loans              - Loans report
GET    /api/v1/reports/withdrawals        - Withdrawals report
GET    /api/v1/reports/barn-sales         - Barn sales report
GET    /api/v1/reports/members            - Members report
GET    /api/v1/reports/financial          - Financial summary
GET    /api/v1/reports/export             - Export report (PDF/CSV)
GET    /api/v1/reports/analytics          - Analytics dashboard data
```

---

## 🔒 Security Features Implemented

### 1. **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Two-factor authentication (2FA) support
- OAuth 2.0 integration (Google)
- Session management with Redis
- Failed login attempt tracking
- Account lockout mechanism

### 2. **Data Protection**
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF tokens for state-changing operations
- Data encryption for sensitive fields
- Secure password reset flow
- Email/phone verification

### 3. **API Security**
- Rate limiting (100 requests per 15 minutes)
- Stricter auth endpoint limiting (5 attempts per 15 minutes)
- CORS configuration
- Helmet.js security headers
- Request ID tracking
- IP address logging

### 4. **Monitoring & Auditing**
- Comprehensive audit logging
- Error tracking and logging
- Performance monitoring
- Security event alerts
- Database query logging
- User activity tracking

---

## 📋 Request/Response Formats

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-15T12:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2026-02-15T12:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 10,
    "totalRecords": 200,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Individual function testing
- Service layer testing
- Utility function testing
- Coverage target: 80%+

### Integration Tests
- API endpoint testing
- Database integration
- External service mocking
- Authentication flow testing

### End-to-End Tests
- Complete user workflows
- Payment processing
- Loan application flow
- Order placement and fulfillment

### Security Testing
- Penetration testing
- OWASP Top 10 compliance
- SQL injection testing
- XSS vulnerability testing
- CSRF protection testing
- Authentication bypass attempts
- Authorization escalation tests

---

## 📱 Mobile-First Frontend Enhancements

### Responsive Design Improvements
- Touch-optimized UI elements
- Swipe gestures for navigation
- Bottom navigation for mobile
- Pull-to-refresh functionality
- Infinite scroll for lists
- Image lazy loading
- Progressive Web App (PWA) support

### Performance Optimizations
- Code splitting
- Asset minification
- Image optimization
- Caching strategies
- Service worker implementation
- Offline mode support

### Mobile-Specific Features
- Biometric authentication (fingerprint/face)
- Push notifications
- Camera integration for document upload
- QR code scanning
- Location services
- Click-to-call functionality
- SMS-based OTP

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Backup system set up
- [ ] Monitoring tools configured
- [ ] Load balancer configured (if applicable)
- [ ] CDN set up for static assets
- [ ] Redis configured and secured
- [ ] Email service configured
- [ ] SMS service configured
- [ ] Payment gateways configured
- [ ] Domain DNS configured
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Error logging verified
- [ ] Performance baseline established

---

## 📖 Next Steps

1. **Create all configuration files** (database, logger, etc.)
2. **Implement authentication system** (register, login, 2FA)
3. **Build core models** (User, Contribution, Loan, etc.)
4. **Develop controllers** for each module
5. **Set up routes** with proper validation
6. **Implement payment integration**
7. **Build barn marketplace** functionality
8. **Create PDF receipt generator**
9. **Set up email/SMS services**
10. **Write comprehensive tests**
11. **Deploy to staging** environment
12. **Perform security audit**
13. **Deploy to production**

---

**Status:** Architecture Complete ✅  
**Next Phase:** Core Implementation  
**Priority:** Authentication → Contributions → Loans → Barn
