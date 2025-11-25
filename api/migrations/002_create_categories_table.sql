CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL, -- Hex color code (#1B4965)
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, color, icon, description) VALUES
    ('Gastos fixos', '#1B4965', 'Home', 'Despesas essenciais e recorrentes'),
    ('Emergências', '#E23B1D', 'AlertCircle', 'Fundo de emergência e imprevistos'),
    ('Liberdade', '#1DE2C4', 'Check', 'Investimentos e independência financeira'),
    ('Conhecimento', '#F1F11F', 'Layers', 'Educação e desenvolvimento pessoal'),
    ('Conforto', '#8B5CF6', 'Car', 'Melhorias de qualidade de vida'),
    ('Prazeres', '#EC4899', 'Heart', 'Lazer e entretenimento')
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
