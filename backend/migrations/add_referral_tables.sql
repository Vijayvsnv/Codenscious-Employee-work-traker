-- Migration: Referral program tables
-- Run once: psql -U postgres -d standup_ai -f migrations/add_referral_tables.sql
-- Note: SQLAlchemy's Base.metadata.create_all() will also create these on backend restart.

CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    owner_emp_id VARCHAR NOT NULL,
    owner_name VARCHAR,
    referral_code VARCHAR UNIQUE NOT NULL,
    total_signups INTEGER DEFAULT 0,
    total_paid_conversions INTEGER DEFAULT 0,
    free_months_earned INTEGER DEFAULT 0,
    free_months_applied INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_owner ON referrals (owner_emp_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

CREATE TABLE IF NOT EXISTS referral_signups (
    id SERIAL PRIMARY KEY,
    referral_code VARCHAR NOT NULL,
    referrer_emp_id VARCHAR,
    new_emp_id VARCHAR,
    new_email VARCHAR,
    new_name VARCHAR,
    signed_up_at TIMESTAMP DEFAULT NOW(),
    converted_paid_at TIMESTAMP,
    reward_credited BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_referral_signups_code ON referral_signups (referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_signups_referrer ON referral_signups (referrer_emp_id);
CREATE INDEX IF NOT EXISTS idx_referral_signups_new ON referral_signups (new_emp_id);
