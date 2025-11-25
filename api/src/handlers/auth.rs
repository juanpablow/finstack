use actix_web::{web, HttpResponse};
use chrono::Datelike;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::{ApiError, ApiResult};
use crate::middleware::auth::create_jwt;
use crate::models::user::{AuthResponse, CreateUserRequest, LoginRequest, User, UserResponse};

pub async fn register(
    pool: web::Data<PgPool>,
    req: web::Json<CreateUserRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    log::info!("Registration attempt for email: {}", req.email);

    // Check if user already exists
    let existing_user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(pool.get_ref())
        .await?;

    if existing_user.is_some() {
        log::warn!("Email already registered: {}", req.email);
        return Err(ApiError::Conflict("Email já cadastrado".to_string()));
    }

    // Hash password
    log::info!("Hashing password for email: {}", req.email);
    let password_hash = bcrypt::hash(&req.password, bcrypt::DEFAULT_COST)?;
    log::info!("Password hash length: {}", password_hash.len());

    // Start transaction
    let mut tx = pool.begin().await?;

    // Create user
    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (email, password_hash, name)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
    )
    .bind(&req.email)
    .bind(&password_hash)
    .bind(&req.name)
    .fetch_one(&mut *tx)
    .await?;

    log::info!("User created successfully: {}", user.email);

    // Get all categories
    let categories = sqlx::query!("SELECT id, name FROM categories")
        .fetch_all(&mut *tx)
        .await?;

    // Default goal percentages
    let default_percentages = [
        ("Gastos fixos", 40.0),
        ("Emergências", 10.0),
        ("Liberdade", 25.0),
        ("Conhecimento", 5.0),
        ("Conforto", 10.0),
        ("Prazeres", 10.0),
    ];

    // Insert default goals (fixed, not per month)
    for (category_name, percentage) in default_percentages.iter() {
        if let Some(category) = categories.iter().find(|c| c.name == *category_name) {
            sqlx::query(
                r#"
                INSERT INTO user_category_goals (user_id, category_id, percentage)
                VALUES ($1, $2, $3)
                "#,
            )
            .bind(user.id)
            .bind(category.id)
            .bind(*percentage)
            .execute(&mut *tx)
            .await?;
        }
    }

    log::info!("Default goals created for user: {}", user.email);

    // Commit transaction
    tx.commit().await?;

    // Generate JWT
    let token = create_jwt(user.id, user.email.clone())?;

    log::info!("Registration complete for user: {}", user.email);

    Ok(HttpResponse::Created().json(AuthResponse {
        token,
        user: user.into(),
    }))
}

pub async fn login(
    pool: web::Data<PgPool>,
    req: web::Json<LoginRequest>,
) -> ApiResult<HttpResponse> {
    req.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))?;

    log::info!("Login attempt for email: {}", req.email);

    // Find user by email
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(pool.get_ref())
        .await?
        .ok_or_else(|| {
            log::warn!("User not found for email: {}", req.email);
            ApiError::Unauthorized("Email ou senha inválidos".to_string())
        })?;

    log::info!("User found: {}", user.email);

    // Verify password
    let is_valid = bcrypt::verify(&req.password, &user.password_hash)?;
    log::info!("Password verification result: {}", is_valid);
    
    if !is_valid {
        log::warn!("Invalid password for email: {}", req.email);
        return Err(ApiError::Unauthorized("Email ou senha inválidos".to_string()));
    }

    // Generate JWT
    let token = create_jwt(user.id, user.email.clone())?;

    log::info!("Login successful for user: {}", user.email);

    Ok(HttpResponse::Ok().json(AuthResponse {
        token,
        user: user.into(),
    }))
}

pub async fn get_me(
    pool: web::Data<PgPool>,
    claims: web::ReqData<crate::middleware::auth::Claims>,
) -> ApiResult<HttpResponse> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| ApiError::Unauthorized("Token inválido".to_string()))?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_optional(pool.get_ref())
        .await?
        .ok_or_else(|| ApiError::NotFound("Usuário não encontrado".to_string()))?;

    Ok(HttpResponse::Ok().json(UserResponse::from(user)))
}
