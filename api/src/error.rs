use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("Erro de banco de dados: {0}")]
    DatabaseError(#[from] sqlx::Error),
    
    #[error("Erro de validação: {0}")]
    ValidationError(String),
    
    #[error("Não encontrado: {0}")]
    NotFound(String),
    
    #[error("Não autorizado: {0}")]
    Unauthorized(String),
    
    #[error("Conflito: {0}")]
    Conflict(String),
    
    #[error("Erro interno do servidor")]
    InternalServerError,
    
    #[error("Erro de JWT: {0}")]
    JwtError(#[from] jsonwebtoken::errors::Error),
    
    #[error("Erro de bcrypt: {0}")]
    BcryptError(#[from] bcrypt::BcryptError),
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
    message: String,
}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        match self {
            ApiError::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::ValidationError(_) => StatusCode::BAD_REQUEST,
            ApiError::NotFound(_) => StatusCode::NOT_FOUND,
            ApiError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            ApiError::Conflict(_) => StatusCode::CONFLICT,
            ApiError::InternalServerError => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::JwtError(_) => StatusCode::UNAUTHORIZED,
            ApiError::BcryptError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let status = self.status_code();
        let error_response = ErrorResponse {
            error: status.to_string(),
            message: self.to_string(),
        };
        HttpResponse::build(status).json(error_response)
    }
}

pub type ApiResult<T> = Result<T, ApiError>;
