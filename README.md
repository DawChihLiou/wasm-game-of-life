# Game of Life with Rust and Wasm

This is a sample code from the book [Rust๐ฆ and WebAssembly๐ธ](https://rustwasm.github.io/docs/book/introduction.html).

This demo is bootstraped with [cargo-generate](https://github.com/ashleygwilliams/cargo-generate), [wasm-pack-template](https://github.com/rustwasm/wasm-pack-template), and [create-wasm-app](https://github.com/rustwasm/create-wasm-app).

![Game of Life screen recording](./gol.gif)

## About `wasm-pack`

[**๐ Read this template tutorial! ๐**][template-docs]

This template is designed for compiling Rust libraries into WebAssembly and
publishing the resulting package to NPM.

Be sure to check out [other `wasm-pack` tutorials online][tutorials] for other
templates and usages of `wasm-pack`.

[tutorials]: https://rustwasm.github.io/docs/wasm-pack/tutorials/index.html
[template-docs]: https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html

## ๐ด Usage

### ๐ Use `cargo generate` to Clone this Template

[Learn more about `cargo generate` here.](https://github.com/ashleygwilliams/cargo-generate)

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
cd my-project
```

### ๐ ๏ธ Build with `wasm-pack build`

```
wasm-pack build
```

### ๐ฌ Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --firefox
```

### ๐ Publish to NPM with `wasm-pack publish`

```
wasm-pack publish
```

### ๐ See the `wasm-game-of-life` in Action

Make sure you build first, and then run

```
cd www && npm i && npm run start
```

The dev server will be available at `localhost:8080` by default.

## ๐ Batteries Included

- [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
- [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
- [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
