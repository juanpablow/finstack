use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::{ApiError, ApiResult};
use crate::models::goal::MonthlyBudgetSummary;

pub async fn get_budget_summary(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    query: web::Query<BudgetQuery>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let summary = sqlx::query_as::<_, MonthlyBudgetSummary>(
        r#"
        SELECT * FROM v_monthly_budget_summary 
        WHERE user_id = $1 AND month = $2 AND year = $3
        ORDER BY category_name
        "#,
    )
    .bind(user_id)
    .bind(query.month)
    .bind(query.year)
    .fetch_all(pool.get_ref())
    .await?;

    Ok(HttpResponse::Ok().json(summary))
}

#[derive(serde::Deserialize)]
pub struct BudgetQuery {
    pub month: i32,
    pub year: i32,
}
