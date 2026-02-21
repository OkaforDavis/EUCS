/**
 * ============================================
 * ELUGWU UMUOSHIE CO-OPERATIVE SOCIETY LTD
 * Secure Financial Management System
 * Abbreviated as: EUCS | EU Co-op
 * ============================================
 */

// ============================================
// SECURITY CONFIGURATION
// ============================================

const ECT_SECURITY_CONFIG = {
    // Session timeout (30 minutes)
    SESSION_TIMEOUT: 1800000,
    // Maximum login attempts
    MAX_LOGIN_ATTEMPTS: 5,
    // Lockout duration (15 minutes)
    LOCKOUT_DURATION: 900000,
    // Password requirements
    PASSWORD_MIN_LENGTH: 12,
    PASSWORD_REQUIREMENTS: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        specialChars: true
    },
    // CSRF token refresh interval
    CSRF_REFRESH: 300000,
    // Encryption key rotation
    KEY_ROTATION_INTERVAL: 86400000
};

// ============================================
// ENCRYPTION & SECURITY UTILITIES
// ============================================

class ECTSecurityManager {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.sessionKey = null;
        this.loginAttempts = {};
        this.initSecurity();
    }

    initSecurity() {
        // Set up CSRF token rotation
        setInterval(() => {
            this.csrfToken = this.generateCSRFToken();
        }, ECT_SECURITY_CONFIG.CSRF_REFRESH);

        // Monitor for suspicious activity
        this.setupActivityMonitoring();
        
        // Set up session timeout
        this.initSessionTimeout();
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    validatePassword(password) {
        const errors = [];
        
        if (password.length < ECT_SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
            errors.push(`Password must be at least ${ECT_SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`);
        }
        
        if (ECT_SECURITY_CONFIG.PASSWORD_REQUIREMENTS.uppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (ECT_SECURITY_CONFIG.PASSWORD_REQUIREMENTS.lowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (ECT_SECURITY_CONFIG.PASSWORD_REQUIREMENTS.numbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (ECT_SECURITY_CONFIG.PASSWORD_REQUIREMENTS.specialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    checkLoginAttempts(memberId) {
        const now = Date.now();
        const attempts = this.loginAttempts[memberId];
        
        if (!attempts) {
            return { allowed: true };
        }
        
        // Check if user is locked out
        if (attempts.lockedUntil && now < attempts.lockedUntil) {
            const remainingTime = Math.ceil((attempts.lockedUntil - now) / 60000);
            return {
                allowed: false,
                reason: `Account locked. Try again in ${remainingTime} minutes.`
            };
        }
        
        // Reset if lockout period has passed
        if (attempts.lockedUntil && now >= attempts.lockedUntil) {
            delete this.loginAttempts[memberId];
            return { allowed: true };
        }
        
        // Check attempt count
        if (attempts.count >= ECT_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
            this.loginAttempts[memberId].lockedUntil = now + ECT_SECURITY_CONFIG.LOCKOUT_DURATION;
            return {
                allowed: false,
                reason: 'Too many failed attempts. Account locked for 15 minutes.'
            };
        }
        
        return { allowed: true };
    }

    recordFailedLogin(memberId) {
        const now = Date.now();
        
        if (!this.loginAttempts[memberId]) {
            this.loginAttempts[memberId] = { count: 0, firstAttempt: now };
        }
        
        this.loginAttempts[memberId].count++;
        this.loginAttempts[memberId].lastAttempt = now;
    }

    clearLoginAttempts(memberId) {
        delete this.loginAttempts[memberId];
    }

    async encryptData(data, key) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        const keyBuffer = encoder.encode(key);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            cryptoKey,
            dataBuffer
        );
        
        return {
            encrypted: Array.from(new Uint8Array(encryptedBuffer)),
            iv: Array.from(iv)
        };
    }

    setupActivityMonitoring() {
        // Monitor for rapid-fire requests (potential bot/attack)
        const requestLog = [];
        const monitorRequest = () => {
            const now = Date.now();
            requestLog.push(now);
            
            // Keep only last 10 seconds of requests
            const recent = requestLog.filter(time => now - time < 10000);
            
            // More than 50 requests in 10 seconds = suspicious
            if (recent.length > 50) {
                console.warn('ECT SECURITY: Suspicious activity detected');
                this.triggerSecurityAlert('High request rate detected');
            }
        };
        
        // Attach to all fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            monitorRequest();
            return originalFetch.apply(this, args);
        };
    }

    initSessionTimeout() {
        let timeoutId;
        
        const resetTimeout = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                this.handleSessionTimeout();
            }, ECT_SECURITY_CONFIG.SESSION_TIMEOUT);
        };
        
        // Reset timeout on user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimeout);
        });
        
        resetTimeout();
    }

    handleSessionTimeout() {
        ECTApp.showToast('Session expired for security. Please login again.', 'warning');
        setTimeout(() => {
            ECTApp.logout();
        }, 2000);
    }

    triggerSecurityAlert(message) {
        // In production, this would notify administrators
        console.error('ECT SECURITY ALERT:', message);
        ECTApp.showToast('Security alert: ' + message, 'error');
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    validateTransaction(transaction) {
        // Validate transaction integrity
        const requiredFields = ['amount', 'memberId', 'type', 'timestamp'];
        
        for (const field of requiredFields) {
            if (!transaction[field]) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
        }
        
        // Validate amount
        if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
            return { valid: false, error: 'Invalid transaction amount' };
        }
        
        // Validate type
        const validTypes = ['contribution', 'withdrawal', 'loan', 'repayment'];
        if (!validTypes.includes(transaction.type)) {
            return { valid: false, error: 'Invalid transaction type' };
        }
        
        return { valid: true };
    }
}

// ============================================
// MAIN APPLICATION CLASS
// ============================================

class ECTApplication {
    constructor() {
        this.security = new ECTSecurityManager();
        this.currentUser = null;
        this.currentView = 'overview';
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('ect-sysldr-overlay-9x4k');
            if (loadingScreen) {
                loadingScreen.classList.add('ect-hidden');
            }
        }, 1500);

        // Setup event listeners
        this.setupAuthListeners();
        this.setupDashboardListeners();
        this.setupNavigationListeners();
        
        // Check for existing session
        this.checkSession();
        
        // Initialize chart if available
        this.initializeCharts();
    }

    setupAuthListeners() {
        // Login form
        const loginForm = document.getElementById('ect-login-form-8k3p');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const toggleBtn = document.getElementById('ect-btn-toggle-pwd-4m8k');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePassword());
        }

        // Forgot password
        const forgotLink = document.getElementById('ect-link-forgot-pwd-1w9z');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // New member registration
        const registerLink = document.getElementById('ect-link-new-member-7y4x');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
    }

    setupDashboardListeners() {
        // Logout buttons
        const logoutBtns = [
            document.getElementById('ect-btn-logout-panel-6w9p'),
            document.getElementById('ect-dropdown-logout-7m4p')
        ];
        
        logoutBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('ect-btn-mobile-menu-2k5w');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // User menu dropdown
        const userMenu = document.getElementById('ect-dropdown-user-menu-9k2m');
        if (userMenu) {
            const trigger = userMenu.querySelector('.ect-user-menu-trigger');
            if (trigger) {
                trigger.addEventListener('click', () => {
                    userMenu.classList.toggle('active');
                });
            }

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });
        }

        // Quick action buttons
        const quickActions = {
            'ect-btn-quick-contribution-9m3k': () => this.showContributionModal(),
            'ect-btn-quick-loan-5k7w': () => this.showLoanModal(),
            'ect-btn-quick-withdrawal-2p8m': () => this.showWithdrawalModal(),
            'ect-btn-quick-member-4w9k': () => this.showMemberModal()
        };

        Object.entries(quickActions).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });
    }

    setupNavigationListeners() {
        const navItems = document.querySelectorAll('.ect-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) {
                    this.switchView(view);
                }
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const memberIdInput = document.getElementById('ect-input-member-id-5n7q');
        const passwordInput = document.getElementById('ect-input-password-2t9r');
        const submitBtn = document.getElementById('ect-btn-submit-login-3x5v');
        
        const memberId = this.security.sanitizeInput(memberIdInput.value.trim());
        const password = passwordInput.value;
        
        // Check login attempts
        const attemptCheck = this.security.checkLoginAttempts(memberId);
        if (!attemptCheck.allowed) {
            this.showToast(attemptCheck.reason, 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('ect-loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call with security measures
            await this.simulateAPICall(1500);
            
            // In production, this would be a secure API call
            // const response = await this.secureAPICall('/auth/login', { memberId, password });
            
            // For demo purposes, accept specific credentials (case-insensitive member ID)
            if (memberId.toLowerCase() === 'admin001' && password === 'EverGreen@2026!') {
                // Clear failed attempts
                this.security.clearLoginAttempts(memberId);
                
                // Set user session
                this.currentUser = {
                    memberId: memberId,
                    name: 'Admin User',
                    role: 'Administrator',
                    permissions: ['all']
                };
                
                this.isAuthenticated = true;
                
                // Store encrypted session (in production, use httpOnly cookies)
                sessionStorage.setItem('ect_session', btoa(JSON.stringify({
                    user: this.currentUser,
                    token: this.security.csrfToken,
                    timestamp: Date.now()
                })));
                
                // Show dashboard
                this.showDashboard();
                
                this.showToast('Login successful! Welcome back.', 'success');
            } else {
                // Record failed login
                this.security.recordFailedLogin(memberId);
                
                const attemptsLeft = ECT_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 
                    (this.security.loginAttempts[memberId]?.count || 0);
                
                this.showToast(
                    `Invalid credentials. ${attemptsLeft} attempts remaining.`,
                    'error'
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Login failed. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('ect-loading');
            submitBtn.disabled = false;
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('ect-input-password-2t9r');
        if (passwordInput) {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        }
    }

    handleForgotPassword() {
        this.showToast('Password reset link will be sent to your registered email.', 'info');
        // In production, this would trigger a secure password reset flow
    }

    handleRegistration() {
        this.showToast('Please contact the cooperative administrator for new member registration.', 'info');
        // In production, this would open a registration form or redirect
    }

    checkSession() {
        const session = sessionStorage.getItem('ect_session');
        
        if (session) {
            try {
                const data = JSON.parse(atob(session));
                const age = Date.now() - data.timestamp;
                
                if (age < ECT_SECURITY_CONFIG.SESSION_TIMEOUT) {
                    this.currentUser = data.user;
                    this.isAuthenticated = true;
                    this.showDashboard();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Session error:', error);
                this.logout();
            }
        }
    }

    showDashboard() {
        const authContainer = document.getElementById('ect-auth-container-7h2m');
        const dashboardContainer = document.getElementById('ect-dashboard-main-2k8p');
        
        if (authContainer && dashboardContainer) {
            authContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            
            // Update user info
            this.updateUserInfo();
            
            // Load initial data
            this.loadDashboardData();
        }
    }

    updateUserInfo() {
        if (!this.currentUser) return;
        
        // Update all user name displays
        document.querySelectorAll('.ect-user-name').forEach(el => {
            el.textContent = this.currentUser.name;
        });
        
        // Update all user role displays
        document.querySelectorAll('.ect-user-role').forEach(el => {
            el.textContent = this.currentUser.role;
        });
        
        // Update avatar initials
        const initials = this.currentUser.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
        
        document.querySelectorAll('.ect-avatar-text, .ect-header-avatar span').forEach(el => {
            el.textContent = initials;
        });
    }

    logout() {
        // Clear session
        sessionStorage.removeItem('ect_session');
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Show auth screen
        const authContainer = document.getElementById('ect-auth-container-7h2m');
        const dashboardContainer = document.getElementById('ect-dashboard-main-2k8p');
        
        if (authContainer && dashboardContainer) {
            authContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
        }
        
        // Clear forms
        const loginForm = document.getElementById('ect-login-form-8k3p');
        if (loginForm) {
            loginForm.reset();
        }
        
        this.showToast('Logged out successfully', 'success');
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.ect-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
        
        // Update view panels
        document.querySelectorAll('.ect-view-panel').forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        });
        
        const activePanel = document.querySelector(`[data-view="${viewName}"]`);
        if (activePanel && activePanel.classList.contains('ect-view-panel')) {
            activePanel.classList.add('active');
            activePanel.style.display = 'block';
        }
        
        // Update page title
        const pageTitle = document.getElementById('ect-dynamic-page-title-7p3m');
        if (pageTitle) {
            const titles = {
                'overview': 'Dashboard Overview',
                'contributions': 'Member Contributions',
                'loans': 'Loan Management',
                'withdrawals': 'Withdrawal Requests',
                'members': 'Member Directory',
                'chat': 'Live Chat',
                'reports': 'Reports & Analytics',
                'settings': 'System Settings'
            };
            pageTitle.textContent = titles[viewName] || 'Dashboard';
        }
        
        this.currentView = viewName;
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.ect-sidebar-nav');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    loadDashboardData() {
        // Load statistics
        this.updateStatistics();
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Update chart
        this.updateChart();
    }

    updateStatistics() {
        // In production, these would be fetched from the API
        const stats = {
            totalContributions: '₦12,450,000',
            activeMembers: '156',
            outstandingLoans: '₦4,280,000',
            withdrawals: '₦850,000'
        };
        
        const statElements = {
            'ect-stat-total-contrib-5k2p': stats.totalContributions,
            'ect-stat-active-members-9w3m': stats.activeMembers,
            'ect-stat-outstanding-loans-4p7t': stats.outstandingLoans,
            'ect-stat-withdrawals-8k3w': stats.withdrawals
        };
        
        Object.entries(statElements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
            }
        });
    }

    loadRecentActivity() {
        // In production, this would fetch from the API
        // Activity is already in the HTML for demo purposes
    }

    initializeCharts() {
        const canvas = document.getElementById('ect-canvas-contrib-chart-3w8k');
        
        if (!canvas || typeof Chart === 'undefined') {
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        this.contributionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Contributions',
                    data: [1200000, 1450000, 1300000, 1680000, 1520000, 980000, 1340000],
                    borderColor: '#6BA368',
                    backgroundColor: 'rgba(107, 163, 104, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#6BA368',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#6BA368',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '₦' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000) + 'k';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateChart() {
        // Period selector
        const periodBtns = document.querySelectorAll('.ect-period-btn');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                periodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // In production, this would fetch and update chart data
                const period = btn.dataset.period;
                console.log('Chart period changed to:', period);
            });
        });
    }

    showContributionModal() {
        this.showToast('Opening contribution form...', 'info');
        // In production, this would open a modal with a contribution form
    }

    showLoanModal() {
        this.showToast('Opening loan application form...', 'info');
        // In production, this would open a modal with a loan form
    }

    showWithdrawalModal() {
        this.showToast('Opening withdrawal request form...', 'info');
        // In production, this would open a modal with a withdrawal form
    }

    showMemberModal() {
        this.showToast('Opening new member registration...', 'info');
        // In production, this would open a modal with a member registration form
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('ect-toast-notification-area-4m9k');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `ect-toast ect-toast-${type}`;
        
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        
        toast.innerHTML = `
            <div class="ect-toast-icon" style="color: var(--ect-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'});">
                ${icons[type] || icons.info}
            </div>
            <div class="ect-toast-content">
                <div class="ect-toast-message">${this.security.sanitizeInput(message)}</div>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'ect-toast-slide-in 0.3s ease-out reverse';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 5000);
    }

    async simulateAPICall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // In production, this would be a secure API call with proper authentication
    async secureAPICall(endpoint, data) {
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.security.csrfToken,
            'Authorization': `Bearer ${sessionStorage.getItem('ect_token')}`
        };
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error('API call failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

const ECTApp = new ECTApplication();

// Export for debugging (remove in production)
window.ECTApp = ECTApp;

// Prevent right-click in production for added security
// Uncomment in production:
// document.addEventListener('contextmenu', (e) => e.preventDefault());
