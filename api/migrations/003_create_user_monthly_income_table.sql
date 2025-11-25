CREATE TABLE IF NOT EXISTS user_monthly_income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_user_monthly_income_user_id ON user_monthly_income(user_id);
CREATE INDEX IF NOT EXISTS idx_user_monthly_income_month_year ON user_monthly_income(month, year);

DROP TRIGGER IF EXISTS update_user_monthly_income_updated_at ON user_monthly_income;
CREATE TRIGGER update_user_monthly_income_updated_at
    BEFORE UPDATE ON user_monthly_income
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
