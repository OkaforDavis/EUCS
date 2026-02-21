/**
 * ============================================
 * ELUGWU UMUOSHIE CO-OPERATIVE SOCIETY LTD
 * Main Server File
 * ============================================
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Import configurations
const { pool } = require('./config/database');
const logger = require('./config/logger');
const { rateLimiter, authLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const contributionRoutes = require('./routes/contribution.routes');
const loanRoutes = require('./routes/loan.routes');
const withdrawalRoutes = require('./routes/withdrawal.routes');
const barnRoutes = require('./routes/barn.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const reportRoutes = require('./routes/report.routes');
const paymentRoutes = require('./routes/payment.routes');

// Initialize Express
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

// Attach io to app for access in routes
app.set('io', io);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.paystack.co", "https://api.flutterwave.com"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/', rateLimiter);
app.use('/api/auth/', authLimiter);

// ============================================
// GENERAL MIDDLEWARE
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: logger.stream }));
} else {
    app.use(morgan('dev'));
}

// Custom request logger
app.use(requestLogger);

// Trust proxy (if behind nginx/load balancer)
app.set('trust proxy', 1);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', async (req, res) => {
    try {
        // Check database connection
        await pool.query('SELECT 1');
        
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: 'Database connection failed'
        });
    }
});

// ============================================
// API ROUTES
// ============================================

const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/contributions`, contributionRoutes);
app.use(`${API_PREFIX}/loans`, loanRoutes);
app.use(`${API_PREFIX}/withdrawals`, withdrawalRoutes);
app.use(`${API_PREFIX}/barn`, barnRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: process.env.APP_NAME,
        version: process.env.API_VERSION,
        message: 'Elugwu Umuoshie Co-operative Society - API Server',
        documentation: `${process.env.APP_URL}/docs`,
        status: 'operational'
    });
});

// ============================================
// SOCKET.IO - REAL-TIME FEATURES
// ============================================

io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    
    // Join user-specific room
    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
        logger.info(`User ${userId} joined their room`);
    });
    
    // Join chat room
    socket.on('join-chat', (roomId) => {
        socket.join(`chat:${roomId}`);
        logger.info(`Socket ${socket.id} joined chat room ${roomId}`);
    });
    
    // Handle chat messages
    socket.on('send-message', async (data) => {
        try {
            // Broadcast to room
            io.to(`chat:${data.roomId}`).emit('new-message', data);
        } catch (error) {
            logger.error('Socket message error:', error);
        }
    });
    
    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use(errorHandler);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    httpServer.close(async () => {
        logger.info('HTTP server closed');
        
        try {
            await pool.end();
            logger.info('Database pool closed');
            
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
    
    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught exception handler
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    logger.info(`
    ============================================
    🌳 EUCS Backend Server Started
    ============================================
    Environment: ${process.env.NODE_ENV}
    Port: ${PORT}
    API Version: ${process.env.API_VERSION}
    Time: ${new Date().toISOString()}
    ============================================
    `);
});

module.exports = { app, io };
