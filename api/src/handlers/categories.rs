use actix_web::{web, HttpResponse};
use sqlx::PgPool;

use crate::error::ApiResult;
use crate::models::category::Category;

pub async fn get_categories(pool: web::Data<PgPool>) -> ApiResult<HttpResponse> {
    let categories = sqlx::query_as::<_, Category>("SELECT * FROM categories ORDER BY name")
        .fetch_all(pool.get_ref())
        .await?;

    Ok(HttpResponse::Ok().json(categories))
}
