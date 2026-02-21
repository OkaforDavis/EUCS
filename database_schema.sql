-- ============================================
-- ELUGWU UMUOSHIE CO-OPERATIVE SOCIETY LTD
-- COMPLETE DATABASE SCHEMA v1.0
-- PostgreSQL 14+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE eucs_users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(64) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    
    -- Address Information
    address_street VARCHAR(255),
    address_village VARCHAR(100),
    address_town VARCHAR(100) DEFAULT 'Elugwu',
    address_lga VARCHAR(100) DEFAULT 'Umuoshie',
    address_state VARCHAR(100),
    address_country VARCHAR(100) DEFAULT 'Nigeria',
    
    -- Role & Status
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    status VARCHAR(20) DEFAULT 'active',
    membership_type VARCHAR(50) DEFAULT 'regular',
    
    -- Farm Information
    is_farmer BOOLEAN DEFAULT true,
    farm_size_hectares DECIMAL(10,2),
    primary_crop VARCHAR(100),
    secondary_crops TEXT[],
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    last_password_change TIMESTAMP,
    
    -- OAuth
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    
    -- Verification
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    phone_verified BOOLEAN DEFAULT false,
    phone_verification_token VARCHAR(10),
    
    -- Profile
    profile_photo_url TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    id_document_url TEXT,
    
    -- Next of Kin
    nok_name VARCHAR(255),
    nok_relationship VARCHAR(50),
    nok_phone VARCHAR(20),
    nok_address TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Metadata
    created_by UUID REFERENCES eucs_users(user_id),
    metadata JSONB,
    
    CONSTRAINT valid_role CHECK (role IN ('admin', 'chairman', 'vice_chairman', 'treasurer', 'financial_secretary', 'assistant_secretary', 'member')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'inactive', 'pending'))
);

CREATE INDEX idx_users_member_id ON eucs_users(member_id);
CREATE INDEX idx_users_email ON eucs_users(email);
CREATE INDEX idx_users_phone ON eucs_users(phone);
CREATE INDEX idx_users_role ON eucs_users(role);
CREATE INDEX idx_users_status ON eucs_users(status);

-- ============================================
-- SESSIONS & TOKENS
-- ============================================

CREATE TABLE eucs_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_sessions_user_id ON eucs_sessions(user_id);
CREATE INDEX idx_sessions_token ON eucs_sessions(session_token);
CREATE INDEX idx_sessions_active ON eucs_sessions(is_active);

CREATE TABLE eucs_password_resets (
    reset_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id) ON DELETE CASCADE,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONTRIBUTIONS
-- ============================================

CREATE TABLE eucs_contribution_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id),
    frequency VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    auto_debit BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_frequency CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

CREATE TABLE eucs_contributions (
    contribution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id),
    plan_id UUID REFERENCES eucs_contribution_plans(plan_id),
    amount DECIMAL(15,2) NOT NULL,
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Payment Information
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50),
    transaction_ref VARCHAR(100) UNIQUE,
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- Processing
    status VARCHAR(20) DEFAULT 'pending',
    receipt_number VARCHAR(50) UNIQUE,
    receipt_url TEXT,
    
    -- Verification
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES eucs_users(user_id),
    verification_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES eucs_users(user_id),
    metadata JSONB,
    
    CONSTRAINT positive_contribution CHECK (amount > 0),
    CONSTRAINT valid_payment_method CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'paystack', 'flutterwave', 'mobile_money'))
);

CREATE INDEX idx_contributions_user ON eucs_contributions(user_id);
CREATE INDEX idx_contributions_date ON eucs_contributions(contribution_date);
CREATE INDEX idx_contributions_status ON eucs_contributions(status);
CREATE INDEX idx_contributions_receipt ON eucs_contributions(receipt_number);

-- ============================================
-- LOANS
-- ============================================

CREATE TABLE eucs_loan_products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    max_duration_months INT NOT NULL,
    multiplier_of_contribution DECIMAL(3,1) DEFAULT 2.0,
    requires_guarantor BOOLEAN DEFAULT true,
    min_membership_months INT DEFAULT 6,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eucs_loans (
    loan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id),
    product_id UUID REFERENCES eucs_loan_products(product_id),
    
    -- Loan Details
    amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    duration_months INT NOT NULL,
    monthly_payment DECIMAL(15,2) NOT NULL,
    total_repayment DECIMAL(15,2) NOT NULL,
    
    -- Dates
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    approval_date DATE,
    disbursement_date DATE,
    first_payment_date DATE,
    maturity_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Purpose
    purpose TEXT NOT NULL,
    
    -- Guarantors
    guarantor_id UUID REFERENCES eucs_users(user_id),
    guarantor_signature TEXT,
    guarantor_approved_at TIMESTAMP,
    
    secondary_guarantor_id UUID REFERENCES eucs_users(user_id),
    secondary_guarantor_approved_at TIMESTAMP,
    
    -- Approvals
    approved_by UUID REFERENCES eucs_users(user_id),
    approval_notes TEXT,
    
    -- Eligibility Check
    user_total_contributions DECIMAL(15,2),
    membership_duration_months INT,
    consistency_score DECIMAL(3,2),
    
    -- Disbursement
    disbursement_method VARCHAR(50),
    disbursement_account VARCHAR(100),
    disbursement_ref VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    CONSTRAINT valid_loan_status CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'disbursed', 'active', 'completed', 'defaulted', 'written_off')),
    CONSTRAINT positive_loan_amount CHECK (amount >= 1000)
);

CREATE INDEX idx_loans_user ON eucs_loans(user_id);
CREATE INDEX idx_loans_status ON eucs_loans(status);
CREATE INDEX idx_loans_guarantor ON eucs_loans(guarantor_id);

CREATE TABLE eucs_loan_repayments (
    repayment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES eucs_loans(loan_id),
    amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    
    -- Payment Info
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE,
    receipt_url TEXT,
    
    status VARCHAR(20) DEFAULT 'completed',
    late_payment BOOLEAN DEFAULT false,
    late_fee DECIMAL(15,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES eucs_users(user_id)
);

CREATE INDEX idx_repayments_loan ON eucs_loan_repayments(loan_id);
CREATE INDEX idx_repayments_date ON eucs_loan_repayments(payment_date);

-- ============================================
-- WITHDRAWALS
-- ============================================

CREATE TABLE eucs_withdrawals (
    withdrawal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id),
    
    -- Withdrawal Details
    amount DECIMAL(15,2) NOT NULL,
    withdrawal_type VARCHAR(50) NOT NULL,
    reason TEXT,
    
    -- Account Details
    bank_name VARCHAR(100),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    
    -- Status & Processing
    status VARCHAR(20) DEFAULT 'pending',
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Approval Chain
    approved_by UUID REFERENCES eucs_users(user_id),
    approved_at TIMESTAMP,
    approval_notes TEXT,
    
    secondary_approval_by UUID REFERENCES eucs_users(user_id),
    secondary_approval_at TIMESTAMP,
    
    -- Processing
    processed_by UUID REFERENCES eucs_users(user_id),
    processed_at TIMESTAMP,
    transaction_ref VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE,
    receipt_url TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    CONSTRAINT valid_withdrawal_status CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
    CONSTRAINT valid_withdrawal_type CHECK (withdrawal_type IN ('savings', 'dividend', 'loan_proceeds', 'emergency')),
    CONSTRAINT positive_withdrawal CHECK (amount > 0)
);

CREATE INDEX idx_withdrawals_user ON eucs_withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON eucs_withdrawals(status);
CREATE INDEX idx_withdrawals_date ON eucs_withdrawals(request_date);

-- ============================================
-- BARN (AGRICULTURAL PRODUCTS MARKETPLACE)
-- ============================================

CREATE TABLE eucs_product_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eucs_barn_products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES eucs_users(user_id),
    category_id UUID REFERENCES eucs_product_categories(category_id),
    
    -- Product Details
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_type VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(15,2) NOT NULL,
    quantity_available DECIMAL(10,2) NOT NULL,
    min_order_quantity DECIMAL(10,2) DEFAULT 1,
    
    -- Quality & Origin
    harvest_date DATE,
    quality_grade VARCHAR(20),
    organic BOOLEAN DEFAULT false,
    farm_location VARCHAR(255),
    
    -- Media
    primary_image_url TEXT,
    additional_images TEXT[],
    
    -- Status
    status VARCHAR(20) DEFAULT 'available',
    featured BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    CONSTRAINT valid_product_status CHECK (status IN ('available', 'out_of_stock', 'reserved', 'discontinued')),
    CONSTRAINT positive_price CHECK (price_per_unit > 0),
    CONSTRAINT positive_quantity CHECK (quantity_available >= 0)
);

CREATE INDEX idx_barn_seller ON eucs_barn_products(seller_id);
CREATE INDEX idx_barn_category ON eucs_barn_products(category_id);
CREATE INDEX idx_barn_status ON eucs_barn_products(status);

CREATE TABLE eucs_barn_orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES eucs_users(user_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Totals
    subtotal DECIMAL(15,2) NOT NULL,
    delivery_fee DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Delivery
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_date DATE,
    delivery_status VARCHAR(20) DEFAULT 'pending',
    
    -- Payment
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_ref VARCHAR(100),
    paid_at TIMESTAMP,
    
    -- Status
    order_status VARCHAR(20) DEFAULT 'pending',
    
    -- Receipt
    receipt_number VARCHAR(50) UNIQUE,
    receipt_url TEXT,
    
    -- Notes
    buyer_notes TEXT,
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_order_status CHECK (order_status IN ('pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_orders_buyer ON eucs_barn_orders(buyer_id);
CREATE INDEX idx_orders_number ON eucs_barn_orders(order_number);
CREATE INDEX idx_orders_status ON eucs_barn_orders(order_status);

CREATE TABLE eucs_barn_order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES eucs_barn_orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES eucs_barn_products(product_id),
    seller_id UUID NOT NULL REFERENCES eucs_users(user_id),
    
    product_name VARCHAR(255) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MESSAGES & CHAT
-- ============================================

CREATE TABLE eucs_chat_rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    
    -- Access Control
    is_public BOOLEAN DEFAULT false,
    required_role VARCHAR(50),
    
    created_by UUID REFERENCES eucs_users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_room_type CHECK (room_type IN ('general', 'executives', 'stakeholders', 'announcement', 'support', 'private'))
);

CREATE TABLE eucs_chat_members (
    membership_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES eucs_chat_rooms(room_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES eucs_users(user_id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP,
    
    UNIQUE(room_id, user_id)
);

CREATE TABLE eucs_messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES eucs_chat_rooms(room_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES eucs_users(user_id),
    
    message_type VARCHAR(20) DEFAULT 'text',
    content TEXT NOT NULL,
    
    -- Attachments
    attachments JSONB,
    
    -- Status
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'image', 'document', 'announcement'))
);

CREATE INDEX idx_messages_room ON eucs_messages(room_id);
CREATE INDEX idx_messages_sender ON eucs_messages(sender_id);
CREATE INDEX idx_messages_created ON eucs_messages(created_at);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE eucs_notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES eucs_users(user_id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Links
    action_url TEXT,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Delivery Channels
    sent_email BOOLEAN DEFAULT false,
    sent_sms BOOLEAN DEFAULT false,
    sent_push BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

CREATE INDEX idx_notifications_user ON eucs_notifications(user_id);
CREATE INDEX idx_notifications_read ON eucs_notifications(is_read);
CREATE INDEX idx_notifications_type ON eucs_notifications(notification_type);

-- ============================================
-- SYSTEM CONFIGURATION
-- ============================================

CREATE TABLE eucs_system_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    category VARCHAR(50),
    updated_by UUID REFERENCES eucs_users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_setting_type CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'encrypted'))
);

-- Payment Gateway Settings
INSERT INTO eucs_system_settings (setting_key, setting_value, setting_type, description, category, is_encrypted) VALUES
    ('paystack_public_key', '', 'encrypted', 'Paystack Public Key', 'payment', true),
    ('paystack_secret_key', '', 'encrypted', 'Paystack Secret Key', 'payment', true),
    ('flutterwave_public_key', '', 'encrypted', 'Flutterwave Public Key', 'payment', true),
    ('flutterwave_secret_key', '', 'encrypted', 'Flutterwave Secret Key', 'payment', true),
    ('smtp_host', '', 'string', 'Email SMTP Host', 'email', false),
    ('smtp_port', '587', 'number', 'Email SMTP Port', 'email', false),
    ('smtp_username', '', 'encrypted', 'Email SMTP Username', 'email', true),
    ('smtp_password', '', 'encrypted', 'Email SMTP Password', 'email', true),
    ('sms_provider', 'termii', 'string', 'SMS Provider', 'sms', false),
    ('sms_api_key', '', 'encrypted', 'SMS API Key', 'sms', true),
    ('min_withdrawal_amount', '1000', 'number', 'Minimum Withdrawal Amount', 'system', false),
    ('max_withdrawal_amount', '5000000', 'number', 'Maximum Withdrawal Amount', 'system', false),
    ('loan_interest_rate', '5.0', 'number', 'Default Loan Interest Rate (%)', 'loan', false),
    ('max_loan_multiplier', '2.0', 'number', 'Maximum Loan as Multiple of Contributions', 'loan', false);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE eucs_audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES eucs_users(user_id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Request Info
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Severity
    severity VARCHAR(20) DEFAULT 'info',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_severity CHECK (severity IN ('info', 'warning', 'error', 'critical'))
);

CREATE INDEX idx_audit_user ON eucs_audit_log(user_id);
CREATE INDEX idx_audit_action ON eucs_audit_log(action);
CREATE INDEX idx_audit_entity ON eucs_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON eucs_audit_log(created_at);

-- ============================================
-- FINANCIAL REPORTS
-- ============================================

CREATE TABLE eucs_financial_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_date DATE NOT NULL,
    
    total_contributions DECIMAL(15,2) DEFAULT 0,
    total_withdrawals DECIMAL(15,2) DEFAULT 0,
    total_loans_disbursed DECIMAL(15,2) DEFAULT 0,
    total_loans_repaid DECIMAL(15,2) DEFAULT 0,
    outstanding_loans DECIMAL(15,2) DEFAULT 0,
    
    active_members_count INT DEFAULT 0,
    new_members_count INT DEFAULT 0,
    
    barn_sales_total DECIMAL(15,2) DEFAULT 0,
    barn_orders_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(snapshot_date)
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON eucs_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON eucs_contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON eucs_loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON eucs_withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barn_products_updated_at BEFORE UPDATE ON eucs_barn_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barn_orders_updated_at BEFORE UPDATE ON eucs_barn_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

CREATE VIEW eucs_user_balances AS
SELECT 
    u.user_id,
    u.member_id,
    u.first_name,
    u.last_name,
    COALESCE(SUM(c.amount), 0) as total_contributions,
    COALESCE((SELECT SUM(amount) FROM eucs_withdrawals WHERE user_id = u.user_id AND status = 'completed'), 0) as total_withdrawals,
    COALESCE((SELECT SUM(amount) FROM eucs_loans WHERE user_id = u.user_id AND status IN ('disbursed', 'active', 'completed')), 0) as total_loans,
    COALESCE(SUM(c.amount), 0) - COALESCE((SELECT SUM(amount) FROM eucs_withdrawals WHERE user_id = u.user_id AND status = 'completed'), 0) as current_balance
FROM eucs_users u
LEFT JOIN eucs_contributions c ON u.user_id = c.user_id AND c.status = 'completed'
GROUP BY u.user_id;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Create admin user (password will be: Admin@2026!)
INSERT INTO eucs_users (
    member_id, email, phone, password_hash, password_salt, 
    first_name, last_name, role, status, email_verified
) VALUES (
    'admin001',
    'admin@eucs.coop',
    '+2348012345678',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', -- Hash of "Admin@2026!"
    'eucs_salt_2026',
    'System',
    'Administrator',
    'admin',
    'active',
    true
);

-- Create product categories
INSERT INTO eucs_product_categories (category_name, description, display_order) VALUES
    ('Grains & Cereals', 'Rice, Corn, Wheat, Millet', 1),
    ('Tubers & Roots', 'Yam, Cassava, Sweet Potato', 2),
    ('Vegetables', 'Fresh vegetables and leafy greens', 3),
    ('Fruits', 'Fresh seasonal fruits', 4),
    ('Legumes', 'Beans, Groundnut, Soybean', 5),
    ('Livestock', 'Poultry, Goat, Fish', 6),
    ('Processed Products', 'Palm oil, Garri, Flour', 7);

-- Create default chat rooms
INSERT INTO eucs_chat_rooms (room_type, room_name, description, is_public, required_role) VALUES
    ('general', 'General Discussion', 'Open forum for all members', true, NULL),
    ('executives', 'Executive Board', 'For executive members only', false, 'chairman'),
    ('stakeholders', 'Stakeholders Forum', 'For major stakeholders', false, NULL),
    ('announcement', 'Announcements', 'Official announcements from administration', true, NULL),
    ('support', 'Support & Help', 'Get help and support', true, NULL);

-- ============================================
-- GRANTS (Run as superuser)
-- ============================================

-- Create application user
-- CREATE USER eucs_app WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE eucs_main TO eucs_app;
-- GRANT USAGE ON SCHEMA public TO eucs_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eucs_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eucs_app;
