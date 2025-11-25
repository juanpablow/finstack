use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::{ApiError, ApiResult};
use crate::models::income::{SetIncomeRequest, UserMonthlyIncome};

pub async fn set_income(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    req: web::Json<SetIncomeRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let income = sqlx::query_as::<_, UserMonthlyIncome>(
        r#"
        INSERT INTO user_monthly_income (user_id, amount, month, year)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, month, year) 
        DO UPDATE SET amount = $2, updated_at = CURRENT_TIMESTAMP
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(req.amount)
    .bind(req.month)
    .bind(req.year)
    .fetch_one(pool.get_ref())
    .await?;

    Ok(HttpResponse::Ok().json(income))
}

pub async fn get_income(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    query: web::Query<IncomeQuery>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let income = sqlx::query_as::<_, UserMonthlyIncome>(
        "SELECT * FROM user_monthly_income WHERE user_id = $1 AND month = $2 AND year = $3",
    )
    .bind(user_id)
    .bind(query.month)
    .bind(query.year)
    .fetch_optional(pool.get_ref())
    .await?;

    match income {
        Some(income) => Ok(HttpResponse::Ok().json(income)),
        None => Ok(HttpResponse::Ok().json(serde_json::json!({
            "amount": 0.0,
            "month": query.month,
            "year": query.year
        }))),
    }
}

#[derive(serde::Deserialize)]
pub struct IncomeQuery {
    pub month: i32,
    pub year: i32,
}
