# Mesh Frontend

This is the frontend implementation of Mesh.
The core UI components and the SSH client are implemented in Rust using Leptos/Thaw UI/Russh.
We also import `xterm.js` to render the terminal.

The Rust code is bundled using `wasm-pack` and `webpack`,
and you can find the HTML and JS entrypoints in `entry`.
