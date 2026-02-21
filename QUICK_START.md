# 🚀 Quick Start Guide - EUCS Management System

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional but recommended)
- Git

## Installation Steps

### 1. Extract the Package
```bash
unzip eucs-complete-system.zip
cd eucs-complete-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
```bash
# Create database
createdb eucs_main

# Run migrations
psql eucs_main < database_schema.sql

# Verify tables created
psql eucs_main -c "\dt eucs_*"
```

### 4. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

**Required Settings:**
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Random 32+ character string
- `SMTP_*` - Email configuration
- Payment gateway keys (for production)

### 5. Start Development Server
```bash
npm run dev
```

Server starts at: http://localhost:5000

### 6. Access Frontend
```bash
# Serve static files (development)
npx http-server public -p 3000
```

Frontend at: http://localhost:3000

## Demo Login

**Member ID:** admin001  
**Password:** EverGreen@2026!

⚠️ **Change immediately in production!**

## File Structure

```
eucs-complete-system/
├── public/              # Frontend (HTML, CSS, JS)
├── config/              # Configuration files
├── middleware/          # Express middleware
├── models/              # Database models
├── controllers/         # Business logic
├── routes/              # API routes
├── services/            # External services
├── utils/               # Helper functions
├── tests/               # Test files
├── scripts/             # Deployment scripts
├── docs/                # Documentation
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env.example         # Environment template
```

## API Endpoints

Server runs on port 5000 by default.

### Test Health Check
```bash
curl http://localhost:5000/health
```

### Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"memberId":"admin001","password":"EverGreen@2026!"}'
```

See `docs/BACKEND_STRUCTURE.md` for complete API documentation.

## Next Steps

1. ✅ Review `docs/IMPLEMENTATION_GUIDE.md`
2. ✅ Configure payment gateways
3. ✅ Set up email/SMS services
4. ✅ Customize branding
5. ✅ Run tests: `npm test`
6. ✅ Deploy to production

## Production Deployment

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name eucs-api

# Set up auto-restart
pm2 startup
pm2 save
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check database exists: `psql -l`

### Port Already in Use
- Change PORT in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

### Module Not Found
- Run: `npm install`
- Check Node version: `node --version`

## Support

- Documentation: `docs/` folder
- Implementation Guide: `docs/IMPLEMENTATION_GUIDE.md`
- API Reference: `docs/BACKEND_STRUCTURE.md`

## Security Checklist

Before going live:
- [ ] Change default admin password
- [ ] Update JWT_SECRET
- [ ] Configure SSL certificate
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure backup system
- [ ] Enable audit logging
- [ ] Test payment gateways
- [ ] Verify email/SMS delivery

---

**Version:** 1.0.0  
**Status:** Production Ready ✅
