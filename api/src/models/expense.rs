use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row, postgres::PgRow};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Expense {
    pub id: Uuid,
    pub user_id: Uuid,
    pub category_id: Uuid,
    pub name: String,
    pub amount: f64,
    pub month: i32,
    pub year: i32,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for Expense {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        use rust_decimal::Decimal;
        let amount_decimal: Decimal = row.try_get("amount")?;
        let amount = amount_decimal.to_string().parse::<f64>()
            .map_err(|e| sqlx::Error::Decode(Box::new(e)))?;
        
        Ok(Self {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            category_id: row.try_get("category_id")?,
            name: row.try_get("name")?,
            amount,
            month: row.try_get("month")?,
            year: row.try_get("year")?,
            description: row.try_get("description")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateExpenseRequest {
    pub category_id: Uuid,
    #[validate(length(min = 1, message = "Nome não pode estar vazio"))]
    pub name: String,
    pub amount: f64,
    pub month: i32,
    pub year: i32,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateExpenseRequest {
    #[validate(length(min = 1, message = "Nome não pode estar vazio"))]
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ExpenseDetail {
    pub id: Uuid,
    pub user_id: Uuid,
    pub user_email: String,
    pub user_name: Option<String>,
    pub category_id: Uuid,
    pub category_name: String,
    pub category_color: String,
    pub category_icon: String,
    pub expense_name: String,
    pub amount: f64,
    pub description: Option<String>,
    pub month: i32,
    pub year: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for ExpenseDetail {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        use rust_decimal::Decimal;
        let amount_decimal: Decimal = row.try_get("amount")?;
        let amount = amount_decimal.to_string().parse::<f64>()
            .map_err(|e| sqlx::Error::Decode(Box::new(e)))?;
        
        Ok(Self {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            user_email: row.try_get("user_email")?,
            user_name: row.try_get("user_name")?,
            category_id: row.try_get("category_id")?,
            category_name: row.try_get("category_name")?,
            category_color: row.try_get("category_color")?,
            category_icon: row.try_get("category_icon")?,
            expense_name: row.try_get("expense_name")?,
            amount,
            description: row.try_get("description")?,
            month: row.try_get("month")?,
            year: row.try_get("year")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }
}
