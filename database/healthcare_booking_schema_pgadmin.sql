-- =====================================================================================
-- HEALTHCARE APPOINTMENT BOOKING SYSTEM - POSTGRESQL SCHEMA
-- =====================================================================================
-- Version: 1.0
-- Database: PostgreSQL 12+
-- Tool: pgAdmin 4
-- Author: Healthcare Development Team
-- Created: 2024
-- 
-- DESCRIPTION:
-- This schema creates a comprehensive healthcare appointment booking system with
-- proper normalization, constraints, indexes, and audit trails for production use.
--
-- EXECUTION INSTRUCTIONS:
-- 1. Open pgAdmin 4
-- 2. Connect to your PostgreSQL server
-- 3. Create a new database: 'healthcare_booking'
-- 4. Open Query Tool for the database
-- 5. Execute this entire script
-- =====================================================================================

-- =====================================================================================
-- SECTION 1: DATABASE SETUP AND EXTENSIONS
-- =====================================================================================

-- Enable required PostgreSQL extensions
-- UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
COMMENT ON EXTENSION "uuid-ossp" IS 'Extension for generating UUID values';

-- Enable pgcrypto for password hashing (if needed for additional security)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
COMMENT ON EXTENSION "pgcrypto" IS 'Extension for cryptographic functions';

-- Create custom domain types for better data validation
CREATE DOMAIN email_address AS VARCHAR(255) 
    CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
COMMENT ON DOMAIN email_address IS 'Custom domain for email validation';

CREATE DOMAIN phone_number AS VARCHAR(20) 
    CHECK (VALUE ~* '^\+?[\d\s\-\(\)]+$');
COMMENT ON DOMAIN phone_number IS 'Custom domain for phone number validation';

-- =====================================================================================
-- SECTION 2: CORE USER MANAGEMENT TABLES
-- =====================================================================================

-- USERS TABLE: Central authentication and basic user information
-- This table serves as the foundation for all user types (patients, doctors, admins)
CREATE TABLE users (
    -- Primary key using UUID for better security and distribution
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Authentication fields
    email email_address UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hash with salt
    
    -- Basic personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone phone_number,
    
    -- Role-based access control
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    
    -- Account status management
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL, -- Email verification status
    
    -- Security fields
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id), -- Self-referencing for admin tracking
    updated_by UUID REFERENCES users(id)
);

-- Add table and column comments for documentation
COMMENT ON TABLE users IS 'Central user authentication and basic information table';
COMMENT ON COLUMN users.id IS 'Unique identifier for each user (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, validated)';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hashed password with salt';
COMMENT ON COLUMN users.role IS 'User role: patient, doctor, or admin';
COMMENT ON COLUMN users.is_active IS 'Account active status (soft delete)';
COMMENT ON COLUMN users.is_verified IS 'Email verification status';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for failed login attempts';
COMMENT ON COLUMN users.locked_until IS 'Account lock expiration timestamp';

-- =====================================================================================
-- SECTION 3: PATIENT-SPECIFIC TABLES
-- =====================================================================================

-- PATIENTS TABLE: Extended information for patient users
-- One-to-one relationship with users table for patients
CREATE TABLE patients (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key to users table (one-to-one relationship)
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal information
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Contact and address information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    
    -- Emergency contact information
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone phone_number,
    emergency_contact_relationship VARCHAR(50),
    
    -- Medical information
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    
    -- Preferences
    preferred_language VARCHAR(50) DEFAULT 'English',
    communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "phone": false}',
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Add comprehensive comments
COMMENT ON TABLE patients IS 'Extended patient information and medical data';
COMMENT ON COLUMN patients.user_id IS 'Reference to users table (one-to-one)';
COMMENT ON COLUMN patients.medical_history IS 'Patient medical history and conditions';
COMMENT ON COLUMN patients.allergies IS 'Known allergies and reactions';
COMMENT ON COLUMN patients.communication_preferences IS 'JSON object storing communication preferences';

-- =====================================================================================
-- SECTION 4: DOCTOR-SPECIFIC TABLES
-- =====================================================================================

-- DOCTORS TABLE: Extended information for doctor users
-- One-to-one relationship with users table for doctors
CREATE TABLE doctors (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key to users table (one-to-one relationship)
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional information
    specialization VARCHAR(100) NOT NULL,
    sub_specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_state VARCHAR(50),
    license_expiry_date DATE,
    
    -- Experience and qualifications
    years_of_experience INTEGER CHECK (years_of_experience >= 0),
    medical_school VARCHAR(200),
    residency_program VARCHAR(200),
    board_certifications TEXT[], -- Array of certifications
    
    -- Practice information
    consultation_fee DECIMAL(10,2) CHECK (consultation_fee >= 0),
    consultation_duration INTEGER DEFAULT 30 CHECK (consultation_duration > 0), -- in minutes
    bio TEXT,
    languages_spoken TEXT[] DEFAULT ARRAY['English'],
    
    -- Availability and status
    is_available BOOLEAN DEFAULT true NOT NULL,
    is_accepting_new_patients BOOLEAN DEFAULT true NOT NULL,
    
    -- Practice location (can be extended to multiple locations)
    practice_name VARCHAR(200),
    practice_address TEXT,
    practice_city VARCHAR(100),
    practice_state VARCHAR(100),
    practice_postal_code VARCHAR(20),
    practice_phone phone_number,
    
    -- Ratings and reviews (calculated fields)
    average_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Add comprehensive comments
COMMENT ON TABLE doctors IS 'Extended doctor information, qualifications, and practice details';
COMMENT ON COLUMN doctors.user_id IS 'Reference to users table (one-to-one)';
COMMENT ON COLUMN doctors.license_number IS 'Medical license number (unique)';
COMMENT ON COLUMN doctors.board_certifications IS 'Array of board certifications';
COMMENT ON COLUMN doctors.languages_spoken IS 'Array of languages the doctor speaks';
COMMENT ON COLUMN doctors.consultation_duration IS 'Default consultation duration in minutes';

-- =====================================================================================
-- SECTION 5: SCHEDULING AND AVAILABILITY TABLES
-- =====================================================================================

-- DOCTOR_SCHEDULES TABLE: Doctor availability patterns
-- Defines when doctors are available for appointments
CREATE TABLE doctor_schedules (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key to doctors table
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    
    -- Schedule definition
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Slot configuration
    slot_duration INTEGER DEFAULT 30 CHECK (slot_duration > 0), -- in minutes
    buffer_time INTEGER DEFAULT 0 CHECK (buffer_time >= 0), -- break between appointments
    
    -- Schedule validity
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_until DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Special schedule types
    schedule_type VARCHAR(20) DEFAULT 'regular' CHECK (schedule_type IN ('regular', 'holiday', 'vacation', 'emergency')),
    notes TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT valid_date_range CHECK (effective_from <= COALESCE(effective_until, effective_from))
);

-- Add comprehensive comments
COMMENT ON TABLE doctor_schedules IS 'Doctor availability schedules and time slot definitions';
COMMENT ON COLUMN doctor_schedules.day_of_week IS 'Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)';
COMMENT ON COLUMN doctor_schedules.slot_duration IS 'Duration of each appointment slot in minutes';
COMMENT ON COLUMN doctor_schedules.buffer_time IS 'Buffer time between appointments in minutes';
COMMENT ON COLUMN doctor_schedules.schedule_type IS 'Type of schedule: regular, holiday, vacation, emergency';

-- DOCTOR_SCHEDULE_EXCEPTIONS TABLE: Handle special dates and exceptions
-- For holidays, vacations, or special availability changes
CREATE TABLE doctor_schedule_exceptions (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key to doctors table
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    
    -- Exception details
    exception_date DATE NOT NULL,
    exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('unavailable', 'modified_hours', 'holiday')),
    
    -- Modified schedule (if applicable)
    start_time TIME,
    end_time TIME,
    slot_duration INTEGER,
    
    -- Description
    reason VARCHAR(200),
    notes TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    
    -- Unique constraint to prevent duplicate exceptions for same doctor/date
    UNIQUE(doctor_id, exception_date)
);

COMMENT ON TABLE doctor_schedule_exceptions IS 'Special dates when doctor schedule differs from regular pattern';

-- =====================================================================================
-- SECTION 6: APPOINTMENT MANAGEMENT TABLES
-- =====================================================================================

-- APPOINTMENTS TABLE: Core appointment booking and management
-- Central table for all appointment data
CREATE TABLE appointments (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign keys
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    
    -- Appointment scheduling
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30 CHECK (duration > 0), -- in minutes
    
    -- Appointment status workflow
    status VARCHAR(20) DEFAULT 'scheduled' NOT NULL 
        CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    
    -- Appointment details
    appointment_type VARCHAR(50) DEFAULT 'consultation' 
        CHECK (appointment_type IN ('consultation', 'follow_up', 'emergency', 'routine_checkup', 'procedure')),
    reason_for_visit TEXT,
    chief_complaint TEXT,
    
    -- Clinical notes and outcomes
    doctor_notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescriptions TEXT,
    follow_up_instructions TEXT,
    
    -- Billing and payment
    consultation_fee DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'waived')),
    payment_method VARCHAR(20),
    
    -- Cancellation and rescheduling
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('patient', 'doctor', 'system', 'admin')),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Rescheduling tracking
    original_appointment_id UUID REFERENCES appointments(id),
    reschedule_count INTEGER DEFAULT 0 CHECK (reschedule_count >= 0),
    
    -- Communication tracking
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Quality metrics
    patient_satisfaction_rating INTEGER CHECK (patient_satisfaction_rating BETWEEN 1 AND 5),
    patient_feedback TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Constraints to prevent double booking
    UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Add comprehensive comments
COMMENT ON TABLE appointments IS 'Core appointment booking, management, and clinical data';
COMMENT ON COLUMN appointments.status IS 'Appointment workflow status';
COMMENT ON COLUMN appointments.appointment_type IS 'Type of medical appointment';
COMMENT ON COLUMN appointments.reschedule_count IS 'Number of times appointment has been rescheduled';
COMMENT ON COLUMN appointments.patient_satisfaction_rating IS 'Patient satisfaction rating (1-5)';

-- =====================================================================================
-- SECTION 7: COMMUNICATION AND NOTIFICATION TABLES
-- =====================================================================================

-- EMAIL_NOTIFICATIONS TABLE: Track all email communications
-- Comprehensive email audit trail for debugging and compliance
CREATE TABLE email_notifications (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Related appointment (optional - some emails may not be appointment-specific)
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Recipient information
    recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_email email_address NOT NULL,
    recipient_name VARCHAR(200),
    
    -- Email content
    email_type VARCHAR(50) NOT NULL 
        CHECK (email_type IN ('booking_confirmation', 'cancellation', 'reschedule', 'reminder', 'follow_up', 'welcome', 'password_reset')),
    subject VARCHAR(255) NOT NULL,
    body_text TEXT,
    body_html TEXT,
    
    -- Email service details
    email_provider VARCHAR(50), -- 'smtp', 'sendgrid', 'mailgun', etc.
    message_id VARCHAR(255), -- Provider's message ID
    
    -- Delivery tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and error handling
    status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced', 'spam')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 CHECK (retry_count >= 0),
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id)
);

COMMENT ON TABLE email_notifications IS 'Email communication tracking and audit trail';
COMMENT ON COLUMN email_notifications.email_type IS 'Type of email notification sent';
COMMENT ON COLUMN email_notifications.message_id IS 'Email provider message ID for tracking';

-- SMS_NOTIFICATIONS TABLE: Track SMS communications (future feature)
CREATE TABLE sms_notifications (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Related appointment
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Recipient information
    recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_phone phone_number NOT NULL,
    
    -- SMS content
    sms_type VARCHAR(50) NOT NULL 
        CHECK (sms_type IN ('reminder', 'confirmation', 'cancellation', 'verification')),
    message_text TEXT NOT NULL,
    
    -- SMS service details
    sms_provider VARCHAR(50), -- 'twilio', 'aws_sns', etc.
    message_id VARCHAR(255),
    
    -- Delivery tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and error handling
    status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    error_message TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id)
);

COMMENT ON TABLE sms_notifications IS 'SMS communication tracking (future feature)';

-- =====================================================================================
-- SECTION 8: SYSTEM CONFIGURATION AND LOOKUP TABLES
-- =====================================================================================

-- SPECIALIZATIONS TABLE: Master list of medical specializations
-- Normalized lookup table for doctor specializations
CREATE TABLE specializations (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Specialization details
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'primary_care', 'specialty', 'sub_specialty'
    
    -- Display and sorting
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE specializations IS 'Master list of medical specializations';

-- Insert common specializations
INSERT INTO specializations (name, description, category, display_order) VALUES
('General Practice', 'Primary care and family medicine', 'primary_care', 1),
('Internal Medicine', 'Adult internal medicine and primary care', 'primary_care', 2),
('Pediatrics', 'Medical care for infants, children, and adolescents', 'primary_care', 3),
('Cardiology', 'Heart and cardiovascular system disorders', 'specialty', 10),
('Dermatology', 'Skin, hair, and nail conditions', 'specialty', 11),
('Orthopedics', 'Musculoskeletal system disorders', 'specialty', 12),
('Neurology', 'Nervous system disorders', 'specialty', 13),
('Psychiatry', 'Mental health and psychiatric disorders', 'specialty', 14),
('Obstetrics and Gynecology', 'Women''s reproductive health', 'specialty', 15),
('Ophthalmology', 'Eye and vision disorders', 'specialty', 16);

-- SYSTEM_SETTINGS TABLE: Application configuration
-- Centralized system configuration management
CREATE TABLE system_settings (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Setting identification
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' 
        CHECK (setting_type IN ('string', 'integer', 'boolean', 'json', 'decimal')),
    
    -- Setting metadata
    category VARCHAR(50),
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false, -- For passwords, API keys, etc.
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by UUID REFERENCES users(id)
);

COMMENT ON TABLE system_settings IS 'System configuration and settings management';

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES
('appointment_reminder_hours', '24', 'integer', 'notifications', 'Hours before appointment to send reminder'),
('max_appointments_per_day', '20', 'integer', 'scheduling', 'Maximum appointments per doctor per day'),
('cancellation_window_hours', '24', 'integer', 'scheduling', 'Minimum hours before appointment for cancellation'),
('system_timezone', 'America/New_York', 'string', 'general', 'System default timezone'),
('maintenance_mode', 'false', 'boolean', 'general', 'System maintenance mode flag');

-- =====================================================================================
-- SECTION 9: INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================================================

-- USERS TABLE INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- PATIENTS TABLE INDEXES
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);

-- DOCTORS TABLE INDEXES
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_available ON doctors(is_available);
CREATE INDEX idx_doctors_accepting_patients ON doctors(is_accepting_new_patients);
CREATE INDEX idx_doctors_rating ON doctors(average_rating DESC);

-- DOCTOR_SCHEDULES TABLE INDEXES
CREATE INDEX idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX idx_doctor_schedules_day ON doctor_schedules(day_of_week);
CREATE INDEX idx_doctor_schedules_active ON doctor_schedules(is_active);
CREATE INDEX idx_doctor_schedules_effective ON doctor_schedules(effective_from, effective_until);

-- APPOINTMENTS TABLE INDEXES (CRITICAL FOR PERFORMANCE)
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_doctor_datetime ON appointments(doctor_id, appointment_date, appointment_time);
CREATE INDEX idx_appointments_created_at ON appointments(created_at);

-- COMPOSITE INDEXES for common queries
CREATE INDEX idx_appointments_doctor_date_status ON appointments(doctor_id, appointment_date, status);
CREATE INDEX idx_appointments_patient_status ON appointments(patient_id, status);

-- EMAIL_NOTIFICATIONS TABLE INDEXES
CREATE INDEX idx_email_notifications_appointment_id ON email_notifications(appointment_id);
CREATE INDEX idx_email_notifications_recipient ON email_notifications(recipient_user_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_type ON email_notifications(email_type);
CREATE INDEX idx_email_notifications_created_at ON email_notifications(created_at);

-- =====================================================================================
-- SECTION 10: TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to automatically update updated_at timestamp';

-- Create triggers for all tables with updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at 
    BEFORE UPDATE ON doctors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at 
    BEFORE UPDATE ON doctor_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specializations_updated_at 
    BEFORE UPDATE ON specializations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- SECTION 11: VIEWS FOR COMMON QUERIES
-- =====================================================================================

-- VIEW: Complete user information with role-specific data
CREATE VIEW v_user_profiles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.role,
    u.is_active,
    u.created_at,
    -- Patient-specific fields
    p.date_of_birth,
    p.gender,
    p.address,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    -- Doctor-specific fields
    d.specialization,
    d.license_number,
    d.years_of_experience,
    d.consultation_fee,
    d.is_available,
    d.average_rating,
    d.total_reviews
FROM users u
LEFT JOIN patients p ON u.id = p.user_id
LEFT JOIN doctors d ON u.id = d.user_id;

COMMENT ON VIEW v_user_profiles IS 'Complete user profiles with role-specific information';

-- VIEW: Doctor availability with schedule information
CREATE VIEW v_doctor_availability AS
SELECT 
    d.id as doctor_id,
    u.first_name,
    u.last_name,
    d.specialization,
    d.is_available,
    d.is_accepting_new_patients,
    ds.day_of_week,
    ds.start_time,
    ds.end_time,
    ds.slot_duration,
    ds.is_active as schedule_active
FROM doctors d
JOIN users u ON d.user_id = u.id
LEFT JOIN doctor_schedules ds ON d.id = ds.doctor_id
WHERE u.is_active = true;

COMMENT ON VIEW v_doctor_availability IS 'Doctor availability with schedule details';

-- VIEW: Appointment summary with patient and doctor information
CREATE VIEW v_appointment_summary AS
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.appointment_type,
    a.reason_for_visit,
    -- Patient information
    pu.first_name as patient_first_name,
    pu.last_name as patient_last_name,
    pu.email as patient_email,
    pu.phone as patient_phone,
    -- Doctor information
    du.first_name as doctor_first_name,
    du.last_name as doctor_last_name,
    d.specialization,
    d.consultation_fee,
    a.created_at,
    a.updated_at
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users pu ON p.user_id = pu.id
JOIN doctors d ON a.doctor_id = d.id
JOIN users du ON d.user_id = du.id;

COMMENT ON VIEW v_appointment_summary IS 'Comprehensive appointment information with patient and doctor details';

-- =====================================================================================
-- SECTION 12: STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================================================

-- Function to check doctor availability for a specific time slot
CREATE OR REPLACE FUNCTION check_doctor_availability(
    p_doctor_id UUID,
    p_appointment_date DATE,
    p_appointment_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_day_of_week INTEGER;
    v_schedule_exists BOOLEAN := FALSE;
    v_appointment_exists BOOLEAN := FALSE;
    v_exception_exists BOOLEAN := FALSE;
BEGIN
    -- Get day of week (0=Sunday, 1=Monday, etc.)
    v_day_of_week := EXTRACT(DOW FROM p_appointment_date);
    
    -- Check if doctor has a schedule for this day and time
    SELECT EXISTS(
        SELECT 1 FROM doctor_schedules 
        WHERE doctor_id = p_doctor_id 
        AND day_of_week = v_day_of_week
        AND start_time <= p_appointment_time 
        AND end_time > p_appointment_time
        AND is_active = true
        AND (effective_from <= p_appointment_date)
        AND (effective_until IS NULL OR effective_until >= p_appointment_date)
    ) INTO v_schedule_exists;
    
    -- Check for schedule exceptions
    SELECT EXISTS(
        SELECT 1 FROM doctor_schedule_exceptions
        WHERE doctor_id = p_doctor_id
        AND exception_date = p_appointment_date
        AND exception_type = 'unavailable'
    ) INTO v_exception_exists;
    
    -- Check if time slot is already booked
    SELECT EXISTS(
        SELECT 1 FROM appointments
        WHERE doctor_id = p_doctor_id
        AND appointment_date = p_appointment_date
        AND appointment_time = p_appointment_time
        AND status NOT IN ('cancelled', 'no_show')
    ) INTO v_appointment_exists;
    
    -- Return availability status
    RETURN v_schedule_exists AND NOT v_exception_exists AND NOT v_appointment_exists;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_doctor_availability IS 'Check if doctor is available for specific date/time slot';

-- Function to get available time slots for a doctor on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
    p_doctor_id UUID,
    p_appointment_date DATE
)
RETURNS TABLE(time_slot TIME, is_available BOOLEAN) AS $$
DECLARE
    v_day_of_week INTEGER;
    v_start_time TIME;
    v_end_time TIME;
    v_slot_duration INTEGER;
    v_current_time TIME;
BEGIN
    -- Get day of week
    v_day_of_week := EXTRACT(DOW FROM p_appointment_date);
    
    -- Get doctor's schedule for this day
    SELECT ds.start_time, ds.end_time, ds.slot_duration
    INTO v_start_time, v_end_time, v_slot_duration
    FROM doctor_schedules ds
    WHERE ds.doctor_id = p_doctor_id
    AND ds.day_of_week = v_day_of_week
    AND ds.is_active = true
    AND (ds.effective_from <= p_appointment_date)
    AND (ds.effective_until IS NULL OR ds.effective_until >= p_appointment_date)
    LIMIT 1;
    
    -- If no schedule found, return empty
    IF v_start_time IS NULL THEN
        RETURN;
    END IF;
    
    -- Generate time slots
    v_current_time := v_start_time;
    WHILE v_current_time < v_end_time LOOP
        RETURN QUERY SELECT 
            v_current_time,
            check_doctor_availability(p_doctor_id, p_appointment_date, v_current_time);
        
        v_current_time := v_current_time + (v_slot_duration || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_available_slots IS 'Get all available time slots for doctor on specific date';

-- =====================================================================================
-- SECTION 13: SAMPLE DATA FOR TESTING
-- =====================================================================================

-- Insert sample admin user (password: 'admin123' - change in production!)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) VALUES
('admin@healthcare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'System', 'Administrator', 'admin', true);

-- Insert sample doctors
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified) VALUES
('dr.smith@healthcare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'John', 'Smith', '+1-555-0101', 'doctor', true),
('dr.johnson@healthcare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sarah', 'Johnson', '+1-555-0102', 'doctor', true),
('dr.williams@healthcare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Michael', 'Williams', '+1-555-0103', 'doctor', true);

-- Insert doctor profiles
INSERT INTO doctors (user_id, specialization, license_number, years_of_experience, consultation_fee, bio, practice_name, practice_phone) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@healthcare.com'), 'Cardiology', 'MD001234', 15, 200.00, 'Experienced cardiologist specializing in heart disease prevention and treatment.', 'Heart Care Center', '+1-555-0201'),
((SELECT id FROM users WHERE email = 'dr.johnson@healthcare.com'), 'Dermatology', 'MD001235', 10, 150.00, 'Board-certified dermatologist with expertise in skin conditions and cosmetic procedures.', 'Skin Health Clinic', '+1-555-0202'),
((SELECT id FROM users WHERE email = 'dr.williams@healthcare.com'), 'General Practice', 'MD001236', 8, 100.00, 'Family medicine physician providing comprehensive primary care services.', 'Family Health Center', '+1-555-0203');

-- Insert sample schedules for doctors (Monday to Friday, 9 AM to 5 PM)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration) 
SELECT d.id, generate_series(1, 5), '09:00:00', '17:00:00', 30
FROM doctors d;

-- Insert sample patient
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified) VALUES
('patient@healthcare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Jane', 'Doe', '+1-555-0301', 'patient', true);

INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone) VALUES
((SELECT id FROM users WHERE email = 'patient@healthcare.com'), '1990-05-15', 'female', '123 Main St, Anytown, ST 12345', 'John Doe', '+1-555-0302');

-- =====================================================================================
-- SECTION 14: SECURITY AND PERMISSIONS
-- =====================================================================================

-- Create roles for different access levels
CREATE ROLE healthcare_admin;
CREATE ROLE healthcare_doctor;
CREATE ROLE healthcare_patient;
CREATE ROLE healthcare_readonly;

-- Grant permissions to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO healthcare_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO healthcare_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO healthcare_admin;

-- Grant permissions to doctor role
GRANT SELECT, INSERT, UPDATE ON users, doctors, appointments, doctor_schedules, doctor_schedule_exceptions TO healthcare_doctor;
GRANT SELECT ON patients, specializations, system_settings TO healthcare_doctor;
GRANT INSERT ON email_notifications, sms_notifications TO healthcare_doctor;

-- Grant permissions to patient role
GRANT SELECT, UPDATE ON users, patients TO healthcare_patient;
GRANT SELECT ON doctors, specializations, doctor_schedules TO healthcare_patient;
GRANT SELECT, INSERT, UPDATE ON appointments TO healthcare_patient;

-- Grant read-only permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO healthcare_readonly;

-- =====================================================================================
-- SECTION 15: MAINTENANCE AND MONITORING QUERIES
-- =====================================================================================

-- Query to check database health and statistics
CREATE VIEW v_database_health AS
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_records,
    MAX(created_at) as last_created
FROM users
UNION ALL
SELECT 
    'appointments' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status NOT IN ('cancelled', 'no_show') THEN 1 END) as active_records,
    MAX(created_at) as last_created
FROM appointments
UNION ALL
SELECT 
    'email_notifications' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as active_records,
    MAX(created_at) as last_created
FROM email_notifications;

COMMENT ON VIEW v_database_health IS 'Database health and statistics monitoring';

-- =====================================================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================================================

-- Final verification query
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'HEALTHCARE BOOKING SYSTEM DATABASE SCHEMA CREATED SUCCESSFULLY!';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables created: %, Views: %, Functions: %', 
        (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public'),
        (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public'),
        (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'));
    RAISE NOTICE 'Schema is ready for production use with sample data included.';
    RAISE NOTICE 'Remember to update default passwords and configure proper security.';
    RAISE NOTICE '=================================================================';
END $$;