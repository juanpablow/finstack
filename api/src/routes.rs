use actix_web::web;
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::handlers::{auth, budget, categories, expenses, goals, income};
use crate::middleware::auth::validator;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    let bearer_auth = HttpAuthentication::bearer(validator);

    cfg
        // Public routes
        .service(
            web::scope("/api/auth")
                .route("/register", web::post().to(auth::register))
                .route("/login", web::post().to(auth::login)),
        )
        // Protected routes
        .service(
            web::scope("/api")
                .wrap(bearer_auth)
                .route("/me", web::get().to(auth::get_me))
                .service(
                    web::scope("/categories")
                        .route("", web::get().to(categories::get_categories)),
                )
                .service(
                    web::scope("/expenses")
                        .route("", web::get().to(expenses::get_expenses))
                        .route("", web::post().to(expenses::create_expense))
                        .route("/{id}", web::get().to(expenses::get_expense))
                        .route("/{id}", web::put().to(expenses::update_expense))
                        .route("/{id}", web::delete().to(expenses::delete_expense)),
                )
                .service(
                    web::scope("/income")
                        .route("", web::get().to(income::get_income))
                        .route("", web::post().to(income::set_income)),
                )
                .service(
                    web::scope("/goals")
                        .route("", web::get().to(goals::get_goals))
                        .route("", web::post().to(goals::set_goal))
                        .route("/batch", web::post().to(goals::set_multiple_goals)),
                )
                .service(
                    web::scope("/budget")
                        .route("/summary", web::get().to(budget::get_budget_summary)),
                ),
        );
}
