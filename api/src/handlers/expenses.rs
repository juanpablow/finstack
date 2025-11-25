use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::{ApiError, ApiResult};
use crate::models::expense::{CreateExpenseRequest, Expense, ExpenseDetail, UpdateExpenseRequest};

pub async fn create_expense(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    req: web::Json<CreateExpenseRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let expense = sqlx::query_as::<_, Expense>(
        r#"
        INSERT INTO expenses (user_id, category_id, name, amount, month, year, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(req.category_id)
    .bind(&req.name)
    .bind(req.amount)
    .bind(req.month)
    .bind(req.year)
    .bind(&req.description)
    .fetch_one(pool.get_ref())
    .await?;

    Ok(HttpResponse::Created().json(expense))
}

pub async fn get_expenses(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    query: web::Query<ExpenseQuery>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let mut sql = String::from("SELECT * FROM v_expense_details WHERE user_id = $1");
    let mut params_count = 1;

    if query.month.is_some() {
        params_count += 1;
        sql.push_str(&format!(" AND month = ${}", params_count));
    }

    if query.year.is_some() {
        params_count += 1;
        sql.push_str(&format!(" AND year = ${}", params_count));
    }

    if query.category_id.is_some() {
        params_count += 1;
        sql.push_str(&format!(" AND category_id = ${}", params_count));
    }

    sql.push_str(" ORDER BY created_at DESC");

    let mut query_builder = sqlx::query_as::<_, ExpenseDetail>(&sql).bind(user_id);

    if let Some(month) = query.month {
        query_builder = query_builder.bind(month);
    }

    if let Some(year) = query.year {
        query_builder = query_builder.bind(year);
    }

    if let Some(category_id) = query.category_id {
        query_builder = query_builder.bind(category_id);
    }

    let expenses = query_builder.fetch_all(pool.get_ref()).await?;

    Ok(HttpResponse::Ok().json(expenses))
}

pub async fn get_expense(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    expense_id: web::Path<Uuid>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let expense = sqlx::query_as::<_, ExpenseDetail>(
        "SELECT * FROM v_expense_details WHERE id = $1 AND user_id = $2",
    )
    .bind(expense_id.into_inner())
    .bind(user_id)
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| ApiError::NotFound("Despesa não encontrada".to_string()))?;

    Ok(HttpResponse::Ok().json(expense))
}

pub async fn update_expense(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    expense_id: web::Path<Uuid>,
    req: web::Json<UpdateExpenseRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    // Check if expense exists and belongs to user
    let existing = sqlx::query_as::<_, Expense>("SELECT * FROM expenses WHERE id = $1 AND user_id = $2")
        .bind(expense_id.into_inner())
        .bind(user_id)
        .fetch_optional(pool.get_ref())
        .await?
        .ok_or_else(|| ApiError::NotFound("Despesa não encontrada".to_string()))?;

    let expense = sqlx::query_as::<_, Expense>(
        r#"
        UPDATE expenses
        SET name = COALESCE($1, name),
            amount = COALESCE($2, amount),
            description = COALESCE($3, description)
        WHERE id = $4 AND user_id = $5
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(req.amount)
    .bind(&req.description)
    .bind(existing.id)
    .bind(user_id)
    .fetch_one(pool.get_ref())
    .await?;

    Ok(HttpResponse::Ok().json(expense))
}

pub async fn delete_expense(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    expense_id: web::Path<Uuid>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let result = sqlx::query("DELETE FROM expenses WHERE id = $1 AND user_id = $2")
        .bind(expense_id.into_inner())
        .bind(user_id)
        .execute(pool.get_ref())
        .await?;

    if result.rows_affected() == 0 {
        return Err(ApiError::NotFound("Despesa não encontrada".to_string()));
    }

    Ok(HttpResponse::NoContent().finish())
}

#[derive(serde::Deserialize)]
pub struct ExpenseQuery {
    pub month: Option<i32>,
    pub year: Option<i32>,
    pub category_id: Option<Uuid>,
}
