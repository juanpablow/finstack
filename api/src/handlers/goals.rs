use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::{ApiError, ApiResult};
use crate::models::goal::{SetGoalRequest, SetMultipleGoalsRequest, UserCategoryGoal};

pub async fn set_goal(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    req: web::Json<SetGoalRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let goal = sqlx::query_as::<_, UserCategoryGoal>(
        r#"
        INSERT INTO user_category_goals (user_id, category_id, percentage)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, category_id) 
        DO UPDATE SET percentage = $3, updated_at = CURRENT_TIMESTAMP
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(req.category_id)
    .bind(req.percentage)
    .fetch_one(pool.get_ref())
    .await?;

    Ok(HttpResponse::Ok().json(goal))
}

pub async fn set_multiple_goals(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
    req: web::Json<SetMultipleGoalsRequest>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let mut tx = pool.begin().await?;

    for goal_input in &req.goals {
        sqlx::query(
            r#"
            INSERT INTO user_category_goals (user_id, category_id, percentage)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, category_id) 
            DO UPDATE SET percentage = $3, updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(user_id)
        .bind(goal_input.category_id)
        .bind(goal_input.percentage)
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Metas salvas com sucesso"
    })))
}

pub async fn get_goals(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let goals = sqlx::query_as::<_, UserCategoryGoal>(
        r#"
        SELECT * FROM user_category_goals 
        WHERE user_id = $1
        ORDER BY created_at
        "#,
    )
    .bind(user_id)
    .fetch_all(pool.get_ref())
    .await?;

    Ok(HttpResponse::Ok().json(goals))
}
