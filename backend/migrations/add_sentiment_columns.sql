-- Migration: Add sentiment analysis columns to daily_reports
-- Run this once against your PostgreSQL database
-- psql -U postgres -d standup_ai -f migrations/add_sentiment_columns.sql

ALTER TABLE daily_reports
  ADD COLUMN IF NOT EXISTS sentiment_score FLOAT,
  ADD COLUMN IF NOT EXISTS sentiment_label VARCHAR,
  ADD COLUMN IF NOT EXISTS sentiment_confidence FLOAT,
  ADD COLUMN IF NOT EXISTS sentiment_signals TEXT;

-- Optional: index for faster admin analytics queries
CREATE INDEX IF NOT EXISTS idx_daily_reports_sentiment
  ON daily_reports (emp_id, date DESC, sentiment_score);
