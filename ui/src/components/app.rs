use gloo_net::http::Request;
use leptos::prelude::*;
use thaw::*;

use crate::log;

#[component]
pub fn App() -> impl IntoView {
    Effect::new(|| {
        log!("loaded");
    });

    let name = LocalResource::new(move || async {
        #[allow(clippy::unwrap_used)]
        Request::get("/api")
            .send()
            .await
            .unwrap()
            .text()
            .await
            .unwrap()
    });

    view! {
        <main>
            <ConfigProvider>
                <p>{move || { format!("hello from {}", name.get().unwrap_or("(loading)".to_string())) }}</p>
            </ConfigProvider>
        </main>
    }
}
