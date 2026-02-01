//! Frontend of Mesh.

#![deny(unsafe_code)]
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]
#![deny(clippy::indexing_slicing)]
#![deny(clippy::panic)]

mod components;
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
fn start() {
    leptos::mount::mount_to_body(components::App);
}
