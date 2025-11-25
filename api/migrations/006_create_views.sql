-- Migration: Create useful views
-- Description: Creates views for common queries and reports

-- View: Monthly budget summary per user and category
CREATE OR REPLACE VIEW v_monthly_budget_summary AS
SELECT 
    u.id AS user_id,
    u.email,
    u.name AS user_name,
    c.id AS category_id,
    c.name AS category_name,
    c.color AS category_color,
    c.icon AS category_icon,
    umi.month,
    umi.year,
    ucg.percentage AS goal_percentage,
    umi.amount AS monthly_income,
    ROUND((umi.amount * ucg.percentage / 100), 2) AS budget_amount,
    COALESCE(SUM(e.amount), 0) AS spent_amount,
    ROUND((umi.amount * ucg.percentage / 100) - COALESCE(SUM(e.amount), 0), 2) AS remaining_amount,
    CASE 
        WHEN (umi.amount * ucg.percentage / 100) > 0 
        THEN ROUND((COALESCE(SUM(e.amount), 0) / (umi.amount * ucg.percentage / 100) * 100), 2)
        ELSE 0 
    END AS used_percentage
FROM users u
CROSS JOIN categories c
LEFT JOIN user_category_goals ucg 
    ON u.id = ucg.user_id 
    AND c.id = ucg.category_id
LEFT JOIN user_monthly_income umi 
    ON u.id = umi.user_id
LEFT JOIN expenses e 
    ON u.id = e.user_id 
    AND c.id = e.category_id 
    AND umi.month = e.month 
    AND umi.year = e.year
GROUP BY 
    u.id, u.email, u.name, c.id, c.name, c.color, c.icon,
    umi.month, umi.year, ucg.percentage, umi.amount;

-- View: Total expenses by user and month
CREATE OR REPLACE VIEW v_user_monthly_totals AS
SELECT 
    u.id AS user_id,
    u.email,
    u.name AS user_name,
    e.month,
    e.year,
    umi.amount AS monthly_income,
    COALESCE(SUM(e.amount), 0) AS total_spent,
    umi.amount - COALESCE(SUM(e.amount), 0) AS remaining,
    CASE 
        WHEN umi.amount > 0 
        THEN ROUND((COALESCE(SUM(e.amount), 0) / umi.amount * 100), 2)
        ELSE 0 
    END AS spent_percentage
FROM users u
LEFT JOIN expenses e ON u.id = e.user_id
LEFT JOIN user_monthly_income umi 
    ON u.id = umi.user_id 
    AND e.month = umi.month 
    AND e.year = umi.year
GROUP BY 
    u.id, u.email, u.name, e.month, e.year, umi.amount;

-- View: Expense details with category information
CREATE OR REPLACE VIEW v_expense_details AS
SELECT 
    e.id,
    e.user_id,
    u.email AS user_email,
    u.name AS user_name,
    e.category_id,
    c.name AS category_name,
    c.color AS category_color,
    c.icon AS category_icon,
    e.name AS expense_name,
    e.amount,
    e.description,
    e.month,
    e.year,
    e.created_at,
    e.updated_at
FROM expenses e
JOIN users u ON e.user_id = u.id
JOIN categories c ON e.category_id = c.id;
