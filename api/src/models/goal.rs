use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row, postgres::PgRow};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserCategoryGoal {
    pub id: Uuid,
    pub user_id: Uuid,
    pub category_id: Uuid,
    pub percentage: f64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for UserCategoryGoal {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        use rust_decimal::Decimal;
        let percentage_decimal: Decimal = row.try_get("percentage")?;
        let percentage = percentage_decimal.to_string().parse::<f64>()
            .map_err(|e| sqlx::Error::Decode(Box::new(e)))?;
        
        Ok(Self {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            category_id: row.try_get("category_id")?,
            percentage,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct SetGoalRequest {
    pub category_id: Uuid,
    pub percentage: f64,
}

#[derive(Debug, Deserialize)]
pub struct SetMultipleGoalsRequest {
    pub goals: Vec<GoalInput>,
}

#[derive(Debug, Deserialize)]
pub struct GoalInput {
    pub category_id: Uuid,
    pub percentage: f64,
}

#[derive(Debug, Serialize)]
pub struct MonthlyBudgetSummary {
    pub user_id: Uuid,
    pub email: String,
    pub user_name: Option<String>,
    pub category_id: Uuid,
    pub category_name: String,
    pub category_color: String,
    pub category_icon: String,
    pub month: Option<i32>,
    pub year: Option<i32>,
    pub goal_percentage: Option<f64>,
    pub monthly_income: Option<f64>,
    pub budget_amount: Option<f64>,
    pub spent_amount: Option<f64>,
    pub remaining_amount: Option<f64>,
    pub used_percentage: Option<f64>,
}

impl FromRow<'_, PgRow> for MonthlyBudgetSummary {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        use rust_decimal::Decimal;
        
        let parse_optional_decimal = |row: &PgRow, col: &str| -> Result<Option<f64>, sqlx::Error> {
            match row.try_get::<Option<Decimal>, _>(col)? {
                Some(decimal) => {
                    let f = decimal.to_string().parse::<f64>()
                        .map_err(|e| sqlx::Error::Decode(Box::new(e)))?;
                    Ok(Some(f))
                },
                None => Ok(None),
            }
        };
        
        Ok(Self {
            user_id: row.try_get("user_id")?,
            email: row.try_get("email")?,
            user_name: row.try_get("user_name")?,
            category_id: row.try_get("category_id")?,
            category_name: row.try_get("category_name")?,
            category_color: row.try_get("category_color")?,
            category_icon: row.try_get("category_icon")?,
            month: row.try_get("month")?,
            year: row.try_get("year")?,
            goal_percentage: parse_optional_decimal(row, "goal_percentage")?,
            monthly_income: parse_optional_decimal(row, "monthly_income")?,
            budget_amount: parse_optional_decimal(row, "budget_amount")?,
            spent_amount: parse_optional_decimal(row, "spent_amount")?,
            remaining_amount: parse_optional_decimal(row, "remaining_amount")?,
            used_percentage: parse_optional_decimal(row, "used_percentage")?,
        })
    }
}
