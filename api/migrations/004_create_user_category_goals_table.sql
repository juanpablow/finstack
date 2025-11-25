CREATE TABLE IF NOT EXISTS user_category_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_user_category_goals_user_id ON user_category_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_category_goals_category_id ON user_category_goals(category_id);

DROP TRIGGER IF EXISTS update_user_category_goals_updated_at ON user_category_goals;
CREATE TRIGGER update_user_category_goals_updated_at
    BEFORE UPDATE ON user_category_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();