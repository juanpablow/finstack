use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row, postgres::PgRow};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserMonthlyIncome {
    pub id: Uuid,
    pub user_id: Uuid,
    pub amount: f64,
    pub month: i32,
    pub year: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for UserMonthlyIncome {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        use rust_decimal::Decimal;
        let amount_decimal: Decimal = row.try_get("amount")?;
        let amount = amount_decimal.to_string().parse::<f64>()
            .map_err(|e| sqlx::Error::Decode(Box::new(e)))?;
        
        Ok(Self {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            amount,
            month: row.try_get("month")?,
            year: row.try_get("year")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct SetIncomeRequest {
    pub amount: f64,
    pub month: i32,
    pub year: i32,
}
