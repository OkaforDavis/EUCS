# 🚀 EUCS Quick Start Guide

## Installation (5 Minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/OkaforDavis/EUCS.git
cd EUCS
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Database
```bash
# Create PostgreSQL database
createdb eucs_main

# Run schema
psql eucs_main < database_schema.sql
```

### Step 4: Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit with your settings
nano .env
```

**Minimum Required Settings:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eucs_main
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key-32-chars-min
```

### Step 5: Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

**Access:** http://localhost:5000

---

## Demo Login Credentials

### Admin
- **Member ID:** EUCS001
- **Password:** Admin@2026!

### Member
- **Member ID:** EUCS002
- **Password:** Member@2026!

---

## File Structure

```
EUCS/
├── public/              # Frontend (open index.html directly for demo)
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── server.js            # Backend API
├── database_schema.sql  # Database setup
└── .env.example         # Configuration template
```

---

## Testing Features

1. **Login:** Use credentials above
2. **Dashboard:** View statistics and chart
3. **Contributions:** Click quick action → Add contribution
4. **Loans:** Navigate to Loans → Apply
5. **Withdrawals:** Navigate to Withdrawals → Request
6. **Members:** View member directory
7. **Chat:** Send messages in live chat
8. **Settings:** Configure system (admin only)
9. **Search:** Use search box for global search

---

## Mobile Testing

Open on mobile device or use browser DevTools:
- Chrome: F12 → Toggle device toolbar
- Responsive design works from 320px to 1920px+

---

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep eucs_main
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3000

# Or kill existing process
lsof -ti:5000 | xargs kill
```

### Module Not Found
```bash
npm install
```

---

## Next Steps

- Review [Complete Documentation](docs/FIXES_APPLIED.md)
- Check [API Reference](docs/BACKEND_STRUCTURE.md)
- Read [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)
- Configure payment gateways in Settings
- Set up email/SMS services
- Deploy to production server

---

**Need Help?** Open an issue on GitHub!
