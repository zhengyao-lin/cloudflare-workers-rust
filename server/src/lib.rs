//! Server code running on Cloudflare Workers.

#![deny(unsafe_code)]
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]
#![deny(clippy::indexing_slicing)]
#![deny(clippy::panic)]

use std::sync::Arc;

use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::response::Response;
use axum::routing::any;
use axum::Router;
use thiserror::Error;
use tower_service::Service;
use worker::IntoResponse;

/// Server-side error types.
#[derive(Debug, Error)]
enum ApiError {
    #[error("worker error: {0}")]
    WorkerError(#[from] worker::Error),
}

impl axum::response::IntoResponse for ApiError {
    #[allow(clippy::unwrap_used)]
    fn into_response(self) -> axum::response::Response {
        axum::response::Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(self.to_string().into())
            .unwrap()
    }
}

#[derive(Clone, Debug)]
#[allow(unused)]
struct WorkerState {
    env: Arc<worker::Env>,
    ctx: Arc<worker::Context>,
    cf: Arc<Option<worker::Cf>>,
}

/// Starts a WebSocket-TCP proxy.
#[worker::send]
#[allow(unused)]
async fn root(State(state): State<WorkerState>, req: Request) -> Result<Response, ApiError> {
    Ok(worker::Response::from_html("worker")?.into())
}

/// Worker entry point.
#[worker::event(fetch)]
async fn fetch(
    req: worker::Request,
    env: worker::Env,
    ctx: worker::Context,
) -> worker::Result<web_sys::Response> {
    let state = WorkerState {
        env: Arc::new(env),
        ctx: Arc::new(ctx),
        cf: Arc::new(req.cf().cloned()),
    };
    let mut router: Router<()> = Router::new().route("/api", any(root)).with_state(state);
    let resp = router
        .call(req.try_into()?)
        .await?
        .into_raw()
        .map_err(|e| worker::Error::RustError(e.into().to_string()))?;
    Ok(resp)
}
