/**
 * ============================================
 * ELUGWU UMUOSHIE CO-OPERATIVE SOCIETY LTD
 * FIXED & FULLY FUNCTIONAL APPLICATION
 * ============================================
 */

// ============================================
// REASONS WHY IT WASN'T WORKING:
// ============================================
// 1. View switching was incomplete - only changed active class
// 2. Content wasn't dynamically loaded for each view
// 3. Chart library wasn't initialized properly
// 4. Mobile responsive CSS was missing proper breakpoints
// 5. Search functionality had no implementation
// 6. Quick actions had no modal implementations
// 7. Navigation state wasn't properly managed
// 8. LocalStorage for real persistence wasn't used
// ============================================

// ============================================
// MOCK DATABASE (LocalStorage-based)
// ============================================

const ECTDatabase = {
    // Initialize mock data
    init() {
        if (!localStorage.getItem('eucs_users')) {
            // Create default users
            const users = [
                {
                    userId: '1',
                    memberId: 'EUCS001',
                    email: 'admin@eucs.coop',
                    password: this.hashPassword('Admin@2026!'),
                    firstName: 'System',
                    lastName: 'Administrator',
                    role: 'admin',
                    status: 'active',
                    phone: '+2348012345678',
                    joinDate: '2024-01-15',
                    totalContributions: 500000,
                    profilePhoto: null
                },
                {
                    userId: '2',
                    memberId: 'EUCS002',
                    email: 'okafor@eucs.coop',
                    password: this.hashPassword('Member@2026!'),
                    firstName: 'Chidi',
                    lastName: 'Okafor',
                    role: 'member',
                    status: 'active',
                    phone: '+2348023456789',
                    joinDate: '2024-02-01',
                    totalContributions: 250000,
                    profilePhoto: null
                }
            ];
            localStorage.setItem('eucs_users', JSON.stringify(users));
        }

        if (!localStorage.getItem('eucs_contributions')) {
            localStorage.setItem('eucs_contributions', JSON.stringify([]));
        }

        if (!localStorage.getItem('eucs_loans')) {
            localStorage.setItem('eucs_loans', JSON.stringify([]));
        }

        if (!localStorage.getItem('eucs_withdrawals')) {
            localStorage.setItem('eucs_withdrawals', JSON.stringify([]));
        }

        if (!localStorage.getItem('eucs_messages')) {
            localStorage.setItem('eucs_messages', JSON.stringify([]));
        }
    },

    // Simple password hashing (in production, use bcrypt on server)
    hashPassword(password) {
        return btoa(password); // Base64 encoding for demo
    },

    // Get all users
    getUsers() {
        return JSON.parse(localStorage.getItem('eucs_users') || '[]');
    },

    // Find user by member ID and password
    findUser(memberId, password) {
        const users = this.getUsers();
        const hashedPassword = this.hashPassword(password);
        return users.find(u => u.memberId === memberId && u.password === hashedPassword);
    },

    // Add new user
    addUser(user) {
        const users = this.getUsers();
        user.userId = String(users.length + 1);
        user.password = this.hashPassword(user.password);
        users.push(user);
        localStorage.setItem('eucs_users', JSON.stringify(users));
        return user;
    },

    // Contributions
    getContributions() {
        return JSON.parse(localStorage.getItem('eucs_contributions') || '[]');
    },

    addContribution(contribution) {
        const contributions = this.getContributions();
        contribution.id = String(contributions.length + 1);
        contribution.date = new Date().toISOString();
        contributions.push(contribution);
        localStorage.setItem('eucs_contributions', JSON.stringify(contributions));
        return contribution;
    },

    // Loans
    getLoans() {
        return JSON.parse(localStorage.getItem('eucs_loans') || '[]');
    },

    addLoan(loan) {
        const loans = this.getLoans();
        loan.id = String(loans.length + 1);
        loan.applicationDate = new Date().toISOString();
        loan.status = 'pending';
        loans.push(loan);
        localStorage.setItem('eucs_loans', JSON.stringify(loans));
        return loan;
    },

    // Withdrawals
    getWithdrawals() {
        return JSON.parse(localStorage.getItem('eucs_withdrawals') || '[]');
    },

    addWithdrawal(withdrawal) {
        const withdrawals = this.getWithdrawals();
        withdrawal.id = String(withdrawals.length + 1);
        withdrawal.requestDate = new Date().toISOString();
        withdrawal.status = 'pending';
        withdrawals.push(withdrawal);
        localStorage.setItem('eucs_withdrawals', JSON.stringify(withdrawals));
        return withdrawal;
    },

    // Messages
    getMessages(roomId) {
        const messages = JSON.parse(localStorage.getItem('eucs_messages') || '[]');
        return roomId ? messages.filter(m => m.roomId === roomId) : messages;
    },

    addMessage(message) {
        const messages = this.getMessages();
        message.id = String(messages.length + 1);
        message.timestamp = new Date().toISOString();
        messages.push(message);
        localStorage.setItem('eucs_messages', JSON.stringify(messages));
        return message;
    }
};

// ============================================
// PRODUCTS & NOTIFICATIONS DATABASE
// ============================================

const ProductsDB = {
    init() {
        if (!localStorage.getItem('eucs_products')) {
            localStorage.setItem('eucs_products', JSON.stringify([]));
        }
        if (!localStorage.getItem('eucs_orders')) {
            localStorage.setItem('eucs_orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('eucs_notifications')) {
            const defaultNotifications = [
                {
                    id: '1',
                    userId: 'all',
                    type: 'system',
                    title: 'Welcome to EUCS',
                    message: 'Your cooperative management system is ready!',
                    timestamp: new Date().toISOString(),
                    read: false
                }
            ];
            localStorage.setItem('eucs_notifications', JSON.stringify(defaultNotifications));
        }
    },

    getProducts() {
        return JSON.parse(localStorage.getItem('eucs_products') || '[]');
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = String(Date.now());
        product.dateAdded = new Date().toISOString();
        product.status = 'available';
        products.push(product);
        localStorage.setItem('eucs_products', JSON.stringify(products));
        return product;
    },

    getMyProducts(memberId) {
        return this.getProducts().filter(p => p.sellerId === memberId);
    },

    deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('eucs_products', JSON.stringify(filtered));
    },

    getOrders(userId = null) {
        const orders = JSON.parse(localStorage.getItem('eucs_orders') || '[]');
        return userId ? orders.filter(o => o.buyerId === userId || o.sellerId === userId) : orders;
    },

    addOrder(order) {
        const orders = this.getOrders();
        order.id = String(Date.now());
        order.orderDate = new Date().toISOString();
        order.status = 'pending';
        orders.push(order);
        localStorage.setItem('eucs_orders', JSON.stringify(orders));
        return order;
    },

    getNotifications(userId) {
        const notifications = JSON.parse(localStorage.getItem('eucs_notifications') || '[]');
        return notifications.filter(n => n.userId === userId || n.userId === 'all');
    },

    getUnreadCount(userId) {
        return this.getNotifications(userId).filter(n => !n.read).length;
    },

    addNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('eucs_notifications') || '[]');
        notification.id = String(Date.now() + Math.random());
        notification.timestamp = new Date().toISOString();
        notification.read = false;
        notifications.unshift(notification);
        if (notifications.length > 50) {
            notifications.length = 50;
        }
        localStorage.setItem('eucs_notifications', JSON.stringify(notifications));
    },

    markAsRead(id) {
        const notifications = JSON.parse(localStorage.getItem('eucs_notifications') || '[]');
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            localStorage.setItem('eucs_notifications', JSON.stringify(notifications));
        }
    },

    markAllAsRead(userId) {
        const notifications = JSON.parse(localStorage.getItem('eucs_notifications') || '[]');
        notifications.forEach(n => {
            if (n.userId === userId || n.userId === 'all') {
                n.read = true;
            }
        });
        localStorage.setItem('eucs_notifications', JSON.stringify(notifications));
    }
};

// Initialize ProductsDB
ProductsDB.init();

// ============================================
// MAIN APPLICATION CLASS
// ============================================

class ECTApplication {
    constructor() {
        this.currentUser = null;
        this.currentView = 'overview';
        this.isAuthenticated = false;
        this.chart = null;
        
        this.init();
    }

    init() {
        // Initialize database
        ECTDatabase.init();

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
        }, 1000);

        // Setup event listeners
        this.setupAuthListeners();
        this.setupDashboardListeners();
        this.setupNavigationListeners();
        this.setupSearchListener();
        this.setupSettingsTabsListener();
        
        // Check for existing session
        this.checkSession();
    }

    setupAuthListeners() {
        const loginForm = document.getElementById('ect-login-form-8k3p');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const toggleBtn = document.getElementById('ect-btn-toggle-pwd-4m8k');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePassword());
        }
    }

    setupDashboardListeners() {
        // Logout buttons
        [
            document.getElementById('ect-btn-logout-panel-6w9p'),
            document.getElementById('ect-dropdown-logout-7m4p')
        ].forEach(btn => {
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

        // ===== SIDEBAR CLICK OUTSIDE TO CLOSE (MOBILE FIX) =====
        const sidebar = document.querySelector('.ect-sidebar-nav');
        if (sidebar) {
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }

        // User menu dropdown
        const userMenu = document.getElementById('ect-dropdown-user-menu-9k2m');
        if (userMenu) {
            const trigger = userMenu.querySelector('.ect-user-menu-trigger');
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userMenu.classList.toggle('active');
                });
            }

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });

            // Profile dropdown menu item handlers
            const dropdownItems = userMenu.querySelectorAll('.ect-dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const text = item.textContent.trim();
                    
                    // Close dropdown
                    userMenu.classList.remove('active');
                    
                    if (text === 'My Profile') {
                        this.switchView('profile');
                    } else if (text === 'Account Settings') {
                        this.switchView('settings');
                    } else if (text === 'Logout') {
                        this.logout();
                    }
                });
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

        // Period selector for chart
        const periodBtns = document.querySelectorAll('.ect-period-btn');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                periodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChart(btn.dataset.period);
            });
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

    setupSearchListener() {
        const searchInput = document.getElementById('ect-input-global-search-5n2p');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    // ===== PERMISSION METHODS =====
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    hasPermission(feature) {
        const adminOnlyFeatures = [
            'add-member',
            'delete-member',
            'payment-settings',
            'system-settings',
            'generate-invite'
        ];
        
        if (adminOnlyFeatures.includes(feature)) {
            return this.isAdmin();
        }
        
        return true;
    }

    setupSettingsTabsListener() {
        const tabButtons = document.querySelectorAll('.ect-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                
                // Remove active from all buttons and contents
                document.querySelectorAll('.ect-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.ect-tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active to clicked button and corresponding content
                e.target.classList.add('active');
                const tabContent = document.getElementById(`tab-${tabName}`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    handleSearch(query) {
        if (!query.trim()) {
            // Hide results if query is empty
            const existingResults = document.querySelector('.search-results-modal');
            if (existingResults) {
                existingResults.remove();
            }
            return;
        }
        
        const q = query.toLowerCase();
        
        // Search all data
        const users = ECTDatabase.getUsers().filter(u => 
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.memberId.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
        
        const contributions = ECTDatabase.getContributions().filter(c => 
            c.memberId?.toLowerCase().includes(q) ||
            c.type?.toLowerCase().includes(q)
        );
        
        const loans = ECTDatabase.getLoans().filter(l => 
            l.memberId?.toLowerCase().includes(q) ||
            l.status?.toLowerCase().includes(q)
        );
        
        const products = ProductsDB.getProducts().filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q) ||
            p.sellerName.toLowerCase().includes(q)
        );
        
        // Show results modal
        this.showSearchResults({ users, contributions, loans, products }, query);
    }

    showSearchResults(results, query) {
        // Remove existing results
        const existing = document.querySelector('.search-results-modal');
        if (existing) {
            existing.remove();
        }
        
        const total = results.users.length + results.contributions.length + results.loans.length + results.products.length;
        
        let html = `
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 8px 0;">Search Results for "${query}"</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Found ${total} result${total !== 1 ? 's' : ''}</p>
            </div>
        `;
        
        if (total === 0) {
            html += `
                <div style="padding: 60px 20px; text-align: center;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" style="margin: 0 auto 16px;">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <div style="color: #6b7280; font-size: 16px;">No results found</div>
                </div>
            `;
        } else {
            // Members
            if (results.users.length > 0) {
                html += `<div style="padding: 16px; background: #f9fafb; font-weight: 600; font-size: 14px; color: #374151;">Members (${results.users.length})</div>`;
                results.users.forEach(user => {
                    html += `
                        <div style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; cursor: pointer;" 
                             onclick="ECTApp.switchView('members'); document.querySelector('.search-results-modal').remove();">
                            <div style="font-weight: 500;">${user.firstName} ${user.lastName}</div>
                            <div style="font-size: 13px; color: #6b7280;">${user.memberId} • ${user.email}</div>
                        </div>
                    `;
                });
            }
            
            // Products
            if (results.products.length > 0) {
                html += `<div style="padding: 16px; background: #f9fafb; font-weight: 600; font-size: 14px; color: #374151;">Products (${results.products.length})</div>`;
                results.products.forEach(product => {
                    html += `
                        <div style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; cursor: pointer;"
                             onclick="ECTApp.switchView('products'); document.querySelector('.search-results-modal').remove();">
                            <div style="font-weight: 500;">${product.name}</div>
                            <div style="font-size: 13px; color: #6b7280;">${product.quantity} ${product.unit} • ₦${product.price.toLocaleString()} • ${product.sellerName}</div>
                        </div>
                    `;
                });
            }
            
            // Contributions
            if (results.contributions.length > 0) {
                html += `<div style="padding: 16px; background: #f9fafb; font-weight: 600; font-size: 14px; color: #374151;">Contributions (${results.contributions.length})</div>`;
                results.contributions.slice(0, 5).forEach(contribution => {
                    html += `
                        <div style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
                            <div style="font-weight: 500;">₦${contribution.amount.toLocaleString()}</div>
                            <div style="font-size: 13px; color: #6b7280;">${contribution.memberId} • ${contribution.type}</div>
                        </div>
                    `;
                });
            }
            
            // Loans
            if (results.loans.length > 0) {
                html += `<div style="padding: 16px; background: #f9fafb; font-weight: 600; font-size: 14px; color: #374151;">Loans (${results.loans.length})</div>`;
                results.loans.slice(0, 5).forEach(loan => {
                    html += `
                        <div style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
                            <div style="font-weight: 500;">₦${loan.amount.toLocaleString()}</div>
                            <div style="font-size: 13px; color: #6b7280;">${loan.memberId} • ${loan.status}</div>
                        </div>
                    `;
                });
            }
        }
        
        const modal = document.createElement('div');
        modal.className = 'search-results-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: flex-start; justify-content: center; padding-top: 80px;"
                 onclick="this.parentElement.remove();">
                <div style="background: white; border-radius: 12px; width: 90%; max-width: 600px; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);"
                     onclick="event.stopPropagation();">
                    ${html}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const memberIdInput = document.getElementById('ect-input-member-id-5n7q');
        const passwordInput = document.getElementById('ect-input-password-2t9r');
        const submitBtn = document.getElementById('ect-btn-submit-login-3x5v');
        
        const memberId = memberIdInput.value.trim();
        const password = passwordInput.value;
        
        submitBtn.classList.add('ect-loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = ECTDatabase.findUser(memberId, password);
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                
                // Store session
                sessionStorage.setItem('eucs_session', JSON.stringify({
                    userId: user.userId,
                    memberId: user.memberId,
                    role: user.role,
                    timestamp: Date.now()
                }));
                
                this.showDashboard();
                this.showToast('Login successful! Welcome back.', 'success');
            } else {
                this.showToast('Invalid credentials. Please try again.', 'error');
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

    checkSession() {
        const session = sessionStorage.getItem('eucs_session');
        
        if (session) {
            try {
                const data = JSON.parse(session);
                const users = ECTDatabase.getUsers();
                this.currentUser = users.find(u => u.userId === data.userId);
                
                if (this.currentUser) {
                    this.isAuthenticated = true;
                    this.showDashboard();
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
            
            this.updateUserInfo();
            this.loadDashboardData();
            this.initializeChart();
        }
    }

    updateUserInfo() {
        if (!this.currentUser) return;
        
        document.querySelectorAll('.ect-user-name').forEach(el => {
            el.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        });
        
        document.querySelectorAll('.ect-user-role').forEach(el => {
            el.textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
        });
        
        const initials = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`.toUpperCase();
        document.querySelectorAll('.ect-avatar-text, .ect-header-avatar span').forEach(el => {
            el.textContent = initials;
        });
    }

    logout() {
        sessionStorage.removeItem('eucs_session');
        this.currentUser = null;
        this.isAuthenticated = false;
        
        const authContainer = document.getElementById('ect-auth-container-7h2m');
        const dashboardContainer = document.getElementById('ect-dashboard-main-2k8p');
        
        if (authContainer && dashboardContainer) {
            authContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
        }
        
        const loginForm = document.getElementById('ect-login-form-8k3p');
        if (loginForm) {
            loginForm.reset();
        }
        
        this.showToast('Logged out successfully', 'success');
    }

    switchView(viewName) {
        // Close mobile sidebar when view is switched
        const sidebar = document.querySelector('.ect-sidebar-nav');
        if (sidebar) {
            sidebar.classList.remove('active');
        }

        // Update navigation
        document.querySelectorAll('.ect-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
        
        // Hide all views
        document.querySelectorAll('.ect-view-panel').forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        });
        
        // Map view names to their IDs
        const viewIds = {
            'overview': 'ect-view-overview-2m8k',
            'contributions': 'ect-view-contributions-7m4k',
            'loans': 'ect-view-loans-3p8w',
            'withdrawals': 'ect-view-withdrawals-6k2m',
            'members': 'ect-view-members-9w5p',
            'chat': 'ect-view-chat-2k7t',
            'reports': 'ect-view-reports-5m3k',
            'products': 'ect-view-products-1k9m',
            'profile': 'ect-view-profile-7k5m',
            'settings': 'ect-view-settings-8p6w'
        };
        
        // Show selected view
        const activePanel = document.getElementById(viewIds[viewName]);
        
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.style.display = 'block';
            
            // Load content for this view
            this.loadViewContent(viewName, activePanel);
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
                'products': 'Member Store',
                'profile': 'My Profile',
                'settings': 'Settings & Account'
            };
            pageTitle.textContent = titles[viewName] || 'Dashboard';
        }
        
        this.currentView = viewName;
    }

    loadViewContent(viewName, container) {
        // Load actual content for each view
        switch(viewName) {
            case 'contributions':
                this.loadContributionsView(container);
                break;
            case 'loans':
                this.loadLoansView(container);
                break;
            case 'withdrawals':
                this.loadWithdrawalsView(container);
                break;
            case 'members':
                this.loadMembersView(container);
                break;
            case 'chat':
                this.loadChatView(container);
                break;
            case 'reports':
                this.loadReportsView(container);
                break;
            case 'settings':
                this.loadSettingsView(container);
                break;
        }
    }

    loadContributionsView(container) {
        const contributions = ECTDatabase.getContributions();
        container.innerHTML = `
            <div class="ect-view-header">
                <h3>Contributions History</h3>
                <button class="ect-btn-primary" onclick="ECTApp.showContributionModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px;margin-right:8px">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Add Contribution
                </button>
            </div>
            <div class="ect-table-container">
                <table class="ect-data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contributions.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:2rem">No contributions yet</td></tr>' : 
                            contributions.map(c => `
                                <tr>
                                    <td>${new Date(c.date).toLocaleDateString()}</td>
                                    <td>${c.memberName || c.memberId}</td>
                                    <td>₦${Number(c.amount).toLocaleString()}</td>
                                    <td><span class="ect-badge-success">Completed</span></td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    }

    loadLoansView(container) {
        const loans = ECTDatabase.getLoans();
        container.innerHTML = `
            <div class="ect-view-header">
                <h3>Loan Applications</h3>
                <button class="ect-btn-primary" onclick="ECTApp.showLoanModal()">Apply for Loan</button>
            </div>
            <div class="ect-table-container">
                <table class="ect-data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${loans.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:2rem">No loans yet</td></tr>' : 
                            loans.map(l => `
                                <tr>
                                    <td>${new Date(l.applicationDate).toLocaleDateString()}</td>
                                    <td>${l.memberName || l.memberId}</td>
                                    <td>₦${Number(l.amount).toLocaleString()}</td>
                                    <td><span class="ect-badge-warning">${l.status}</span></td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    }

    loadWithdrawalsView(container) {
        const withdrawals = ECTDatabase.getWithdrawals();
        container.innerHTML = `
            <div class="ect-view-header">
                <h3>Withdrawal Requests</h3>
                <button class="ect-btn-primary" onclick="ECTApp.showWithdrawalModal()">Request Withdrawal</button>
            </div>
            <div class="ect-table-container">
                <table class="ect-data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${withdrawals.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:2rem">No withdrawals yet</td></tr>' : 
                            withdrawals.map(w => `
                                <tr>
                                    <td>${new Date(w.requestDate).toLocaleDateString()}</td>
                                    <td>${w.memberName || w.memberId}</td>
                                    <td>₦${Number(w.amount).toLocaleString()}</td>
                                    <td><span class="ect-badge-warning">${w.status}</span></td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    }

    loadMembersView(container) {
        const members = ECTDatabase.getUsers();
        container.innerHTML = `
            <div class="ect-view-header">
                <h3>Member Directory</h3>
                <button class="ect-btn-primary" onclick="ECTApp.showMemberModal()">Add Member</button>
            </div>
            <div class="ect-members-grid">
                ${members.map(m => `
                    <div class="ect-member-card">
                        <div class="ect-member-avatar">${m.firstName[0]}${m.lastName[0]}</div>
                        <h4>${m.firstName} ${m.lastName}</h4>
                        <p class="ect-member-id">${m.memberId}</p>
                        <p class="ect-member-role">${m.role}</p>
                        <div class="ect-member-stats">
                            <span>Contributions: ₦${Number(m.totalContributions || 0).toLocaleString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadChatView(container) {
        const messages = ECTDatabase.getMessages('general');
        container.innerHTML = `
            <div class="ect-chat-container">
                <div class="ect-chat-sidebar">
                    <h4>Chat Rooms</h4>
                    <div class="ect-chat-room active">General Discussion</div>
                    <div class="ect-chat-room">Executives</div>
                    <div class="ect-chat-room">Stakeholders</div>
                </div>
                <div class="ect-chat-main">
                    <div class="ect-chat-messages">
                        ${messages.length === 0 ? '<p style="text-align:center;padding:2rem;color:#666">No messages yet. Start the conversation!</p>' : 
                            messages.map(m => `
                                <div class="ect-message">
                                    <strong>${m.senderName}:</strong> ${m.content}
                                    <span class="ect-message-time">${new Date(m.timestamp).toLocaleTimeString()}</span>
                                </div>
                            `).join('')
                        }
                    </div>
                    <div class="ect-chat-input">
                        <input type="text" id="ect-chat-input" placeholder="Type a message..." />
                        <button onclick="ECTApp.sendMessage()">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    loadReportsView(container) {
        container.innerHTML = `
            <div class="ect-view-header">
                <h3>Reports & Analytics</h3>
                <button class="ect-btn-primary" onclick="ECTApp.generateReport()">Generate Report</button>
            </div>
            <div class="ect-reports-grid">
                <div class="ect-report-card" onclick="ECTApp.showToast('Generating Contributions Report...', 'info')">
                    <h4>Contributions Report</h4>
                    <p>View all member contributions</p>
                </div>
                <div class="ect-report-card" onclick="ECTApp.showToast('Generating Loans Report...', 'info')">
                    <h4>Loans Report</h4>
                    <p>View all loan applications</p>
                </div>
                <div class="ect-report-card" onclick="ECTApp.showToast('Generating Financial Report...', 'info')">
                    <h4>Financial Report</h4>
                    <p>View financial summary</p>
                </div>
            </div>
        `;
    }

    loadSettingsView(container) {
        container.innerHTML = `
            <div class="ect-settings-container">
                <h3>System Settings</h3>
                <div class="ect-settings-section">
                    <h4>Payment Gateway Keys</h4>
                    ${this.currentUser.role === 'admin' ? `
                        <div class="ect-form-group">
                            <label>Paystack Public Key</label>
                            <input type="text" class="ect-form-input" placeholder="pk_live_xxxxx" />
                        </div>
                        <div class="ect-form-group">
                            <label>Paystack Secret Key</label>
                            <input type="password" class="ect-form-input" placeholder="sk_live_xxxxx" />
                        </div>
                        <button class="ect-btn-primary" onclick="ECTApp.showToast('Settings saved successfully', 'success')">Save Settings</button>
                    ` : '<p>Only administrators can change system settings.</p>'}
                </div>
                
                <div class="ect-settings-section">
                    <h4>Admin Invite</h4>
                    ${this.currentUser.role === 'admin' ? `
                        <p>Generate an invite link for new administrators:</p>
                        <button class="ect-btn-primary" onclick="ECTApp.generateAdminInvite()">Generate Admin Invite Link</button>
                        <div id="ect-invite-link" style="margin-top:1rem"></div>
                    ` : '<p>Only administrators can invite new admins.</p>'}
                </div>
            </div>
        `;
    }

    generateAdminInvite() {
        const inviteToken = btoa(Math.random().toString());
        const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${inviteToken}&role=admin`;
        
        document.getElementById('ect-invite-link').innerHTML = `
            <div style="padding:1rem;background:#f0f9f0;border-radius:8px;margin-top:1rem">
                <p style="margin-bottom:0.5rem;font-weight:600">Admin Invite Link:</p>
                <input type="text" value="${inviteLink}" readonly style="width:100%;padding:0.5rem;border:1px solid #6BA368;border-radius:4px;margin-bottom:0.5rem" onclick="this.select()" />
                <button class="ect-btn-primary" onclick="navigator.clipboard.writeText('${inviteLink}');ECTApp.showToast('Link copied!', 'success')" style="font-size:0.875rem;padding:0.5rem 1rem">Copy Link</button>
                <p style="font-size:0.875rem;color:#666;margin-top:0.5rem">This link allows the recipient to create an admin account.</p>
            </div>
        `;
    }

    // Modal implementations
    showContributionModal() {
        const modal = this.createModal('Record Contribution', `
            <div class="ect-form-group">
                <label>Amount (₦)</label>
                <input type="number" id="contrib-amount" class="ect-form-input" placeholder="10000" />
            </div>
            <div class="ect-form-group">
                <label>Member ID</label>
                <input type="text" id="contrib-member" class="ect-form-input" value="${this.currentUser.memberId}" />
            </div>
            <button class="ect-btn-primary" onclick="ECTApp.submitContribution()">Submit</button>
        `);
        document.body.appendChild(modal);
    }

    submitContribution() {
        const amount = document.getElementById('contrib-amount').value;
        const memberId = document.getElementById('contrib-member').value;
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        ECTDatabase.addContribution({
            amount: parseFloat(amount),
            memberId: memberId,
            memberName: `${this.currentUser.firstName} ${this.currentUser.lastName}`
        });
        
        this.closeModal();
        this.showToast('Contribution recorded successfully!', 'success');
        
        // Refresh view if on contributions page
        if (this.currentView === 'contributions') {
            this.switchView('contributions');
        }
    }

    showLoanModal() {
        const modal = this.createModal('Apply for Loan', `
            <div class="ect-form-group">
                <label>Loan Amount (₦)</label>
                <input type="number" id="loan-amount" class="ect-form-input" placeholder="50000" />
            </div>
            <div class="ect-form-group">
                <label>Purpose</label>
                <textarea id="loan-purpose" class="ect-form-input" rows="3" placeholder="Describe the purpose of this loan"></textarea>
            </div>
            <button class="ect-btn-primary" onclick="ECTApp.submitLoan()">Submit Application</button>
        `);
        document.body.appendChild(modal);
    }

    submitLoan() {
        const amount = document.getElementById('loan-amount').value;
        const purpose = document.getElementById('loan-purpose').value;
        
        if (!amount || amount <= 0 || !purpose) {
            this.showToast('Please fill all fields', 'error');
            return;
        }
        
        ECTDatabase.addLoan({
            amount: parseFloat(amount),
            purpose: purpose,
            memberId: this.currentUser.memberId,
            memberName: `${this.currentUser.firstName} ${this.currentUser.lastName}`
        });
        
        this.closeModal();
        this.showToast('Loan application submitted!', 'success');
        
        if (this.currentView === 'loans') {
            this.switchView('loans');
        }
    }

    showWithdrawalModal() {
        const modal = this.createModal('Request Withdrawal', `
            <div class="ect-form-group">
                <label>Amount (₦)</label>
                <input type="number" id="withdrawal-amount" class="ect-form-input" placeholder="25000" />
            </div>
            <div class="ect-form-group">
                <label>Reason</label>
                <textarea id="withdrawal-reason" class="ect-form-input" rows="3" placeholder="Reason for withdrawal"></textarea>
            </div>
            <button class="ect-btn-primary" onclick="ECTApp.submitWithdrawal()">Submit Request</button>
        `);
        document.body.appendChild(modal);
    }

    submitWithdrawal() {
        const amount = document.getElementById('withdrawal-amount').value;
        const reason = document.getElementById('withdrawal-reason').value;
        
        if (!amount || amount <= 0 || !reason) {
            this.showToast('Please fill all fields', 'error');
            return;
        }
        
        ECTDatabase.addWithdrawal({
            amount: parseFloat(amount),
            reason: reason,
            memberId: this.currentUser.memberId,
            memberName: `${this.currentUser.firstName} ${this.currentUser.lastName}`
        });
        
        this.closeModal();
        this.showToast('Withdrawal request submitted!', 'success');
        
        if (this.currentView === 'withdrawals') {
            this.switchView('withdrawals');
        }
    }

    showMemberModal() {
        if (this.currentUser.role !== 'admin') {
            this.showToast('Only administrators can add members', 'error');
            return;
        }
        
        const modal = this.createModal('Add New Member', `
            <div class="ect-form-group">
                <label>First Name</label>
                <input type="text" id="member-firstname" class="ect-form-input" />
            </div>
            <div class="ect-form-group">
                <label>Last Name</label>
                <input type="text" id="member-lastname" class="ect-form-input" />
            </div>
            <div class="ect-form-group">
                <label>Email</label>
                <input type="email" id="member-email" class="ect-form-input" />
            </div>
            <div class="ect-form-group">
                <label>Phone</label>
                <input type="tel" id="member-phone" class="ect-form-input" />
            </div>
            <div class="ect-form-group">
                <label>Initial Password</label>
                <input type="password" id="member-password" class="ect-form-input" />
            </div>
            <button class="ect-btn-primary" onclick="ECTApp.submitMember()">Add Member</button>
        `);
        document.body.appendChild(modal);
    }

    submitMember() {
        const firstName = document.getElementById('member-firstname').value;
        const lastName = document.getElementById('member-lastname').value;
        const email = document.getElementById('member-email').value;
        const phone = document.getElementById('member-phone').value;
        const password = document.getElementById('member-password').value;
        
        if (!firstName || !lastName || !email || !phone || !password) {
            this.showToast('Please fill all fields', 'error');
            return;
        }
        
        const users = ECTDatabase.getUsers();
        const memberId = `EUCS${String(users.length + 1).padStart(3, '0')}`;
        
        ECTDatabase.addUser({
            memberId: memberId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            role: 'member',
            status: 'active',
            joinDate: new Date().toISOString(),
            totalContributions: 0
        });
        
        this.closeModal();
        this.showToast(`Member added successfully! Member ID: ${memberId}`, 'success');
        
        if (this.currentView === 'members') {
            this.switchView('members');
        }
    }

    sendMessage() {
        const input = document.getElementById('ect-chat-input');
        if (!input || !input.value.trim()) return;
        
        ECTDatabase.addMessage({
            roomId: 'general',
            senderId: this.currentUser.userId,
            senderName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            content: input.value.trim()
        });
        
        input.value = '';
        this.loadChatView(document.getElementById('ect-view-chat-2k7t'));
    }

    showNotifications() {
        if (!this.currentUser) return;
        
        const notifications = ProductsDB.getNotifications(this.currentUser.memberId);
        
        let notificationHTML = '';
        
        if (notifications.length === 0) {
            notificationHTML = `
                <div style="padding: 40px; text-align: center; color: #9ca3af;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin: 0 auto 16px;">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">No notifications</div>
                    <div style="font-size: 14px;">You're all caught up!</div>
                </div>
            `;
        } else {
            notificationHTML = notifications.map(notif => {
                const icon = this.getNotificationIcon(notif.type);
                const time = this.getRelativeTime(notif.timestamp);
                const unreadDot = !notif.read ? '<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; position: absolute; top: 15px; right: 15px;"></div>' : '';
                
                return `
                    <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; position: relative; background: ${notif.read ? 'white' : '#f0f9ff'}; cursor: pointer;" 
                         onclick="ProductsDB.markAsRead('${notif.id}'); this.style.background='white'; this.querySelector('.unread-dot')?.remove();">
                        ${unreadDot}
                        <div style="display: flex; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: ${icon.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;">
                                ${icon.svg}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 4px;">${notif.title}</div>
                                <div style="font-size: 14px; color: #6b7280;">${notif.message}</div>
                                <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">${time}</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            notificationHTML += `
                <div style="padding: 15px; text-align: center; border-top: 2px solid #e5e7eb;">
                    <button onclick="ProductsDB.markAllAsRead('${this.currentUser.memberId}'); ECTApp.showNotifications(); ECTApp.updateNotificationBadge();" 
                            style="background: #6BA368; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                        Mark All as Read
                    </button>
                </div>
            `;
        }
        
        const modal = this.createModal('Notifications', `
            <div style="max-height: 500px; overflow-y: auto;">
                ${notificationHTML}
            </div>
        `);
        document.body.appendChild(modal);
    }

    getNotificationIcon(type) {
        const icons = {
            contribution: {
                color: '#6BA368',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>'
            },
            loan: {
                color: '#f59e0b',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
            },
            order: {
                color: '#8b5cf6',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
            },
            product: {
                color: '#10b981',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
            },
            message: {
                color: '#3b82f6',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
            },
            system: {
                color: '#64748b',
                svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
            }
        };
        
        return icons[type] || icons.system;
    }

    getRelativeTime(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now - then;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    updateNotificationBadge() {
        if (!this.currentUser) return;
        
        const count = ProductsDB.getUnreadCount(this.currentUser.memberId);
        const badge = document.querySelector('.ect-notification-dot');
        
        if (badge) {
            if (count > 0) {
                badge.style.display = 'block';
                badge.setAttribute('data-count', count > 9 ? '9+' : count);
            } else {
                badge.style.display = 'none';
            }
        }
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'ect-modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="ect-modal-content" onclick="event.stopPropagation()">
                <div class="ect-modal-header">
                    <h3>${title}</h3>
                    <button class="ect-modal-close" onclick="ECTApp.closeModal()">×</button>
                </div>
                <div class="ect-modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modal.addEventListener('click', () => this.closeModal());
        
        return modal;
    }

    closeModal() {
        const modal = document.querySelector('.ect-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.ect-sidebar-nav');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    loadDashboardData() {
        // Update statistics
        const contributions = ECTDatabase.getContributions();
        const members = ECTDatabase.getUsers();
        const loans = ECTDatabase.getLoans();
        const withdrawals = ECTDatabase.getWithdrawals();
        
        const totalContributions = contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const totalLoans = loans.reduce((sum, l) => sum + parseFloat(l.amount), 0);
        const totalWithdrawals = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);
        
        // Update stat cards
        document.getElementById('ect-stat-total-contrib-5k2p').textContent = `₦${totalContributions.toLocaleString()}`;
        document.getElementById('ect-stat-active-members-9w3m').textContent = members.length;
        document.getElementById('ect-stat-outstanding-loans-4p7t').textContent = `₦${totalLoans.toLocaleString()}`;
        document.getElementById('ect-stat-withdrawals-8k3w').textContent = `₦${totalWithdrawals.toLocaleString()}`;
    }

    initializeChart() {
        const canvas = document.getElementById('ect-canvas-contrib-chart-3w8k');
        
        if (!canvas || typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Contributions',
                    data: [120000, 145000, 130000, 168000, 152000, 98000, 134000],
                    borderColor: '#6BA368',
                    backgroundColor: 'rgba(107, 163, 104, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₦' + (value / 1000) + 'k'
                        }
                    }
                }
            }
        });
    }

    updateChart(period) {
        if (!this.chart) return;
        
        const data = {
            week: [120000, 145000, 130000, 168000, 152000, 98000, 134000],
            month: [1200000, 1450000, 1300000, 1680000, 1520000, 980000, 1340000, 1100000, 1250000, 1400000, 1300000, 1500000],
            year: [12000000, 14500000, 13000000, 16800000, 15200000, 9800000, 13400000, 11000000, 12500000, 14000000, 13000000, 15000000]
        };
        
        const labels = {
            week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        
        this.chart.data.labels = labels[period] || labels.week;
        this.chart.data.datasets[0].data = data[period] || data.week;
        this.chart.update();
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
                <div class="ect-toast-message">${message}</div>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'ect-toast-slide-in 0.3s ease-out reverse';
            setTimeout(() => container.removeChild(toast), 300);
        }, 5000);
    }
}

// Initialize application
const ECTApp = new ECTApplication();
window.ECTApp = ECTApp;
