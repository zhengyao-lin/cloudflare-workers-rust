const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const DIST_PATH = path.resolve(__dirname, "dist");

// A custom plugin to add a preload tag for the main WASM module.
class WasmPreloadPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("WasmPreloadPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        "WasmPreloadPlugin",
        (data) => {
          const asset = Object.keys(compilation.assets).find((f) =>
            f.endsWith(".wasm")
          );

          if (!asset) return data;

          data.assetTags.meta.unshift({
            tagName: "link",
            voidTag: true,
            attributes: {
              rel: "preload",
              as: "fetch",
              href: data.publicPath + asset,
              fetchpriority: "high",
            },
          });

          return data;
        }
      );
    });
  }
}

module.exports = {
  mode: "production",
  entry: { index: "./entry/index.ts" },
  resolve: { extensions: [".ts", ".js"] },
  output: {
    publicPath: "",
    path: DIST_PATH,
    clean: true,
    filename: "[name].js",
  },
  experiments: { asyncWebAssembly: true },
  devServer: { static: { directory: DIST_PATH } },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: { compilerOptions: { noEmit: false } },
        },
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
    ],
  },
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
    splitChunks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./entry/index.html",
      scriptLoading: "defer",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlInlineScriptPlugin({
      scriptMatchPattern: [/^index\.js$/],
    }),
    new WasmPackPlugin({
      crateDirectory: __dirname,
      extraArgs: "--target web",
    }),
    new WasmPreloadPlugin(),
    new PreloadWebpackPlugin({
      rel: "preload",
      fileWhitelist: [/\.js$/],
      fileBlacklist: [/^index\.js$/],
    }),
  ],
};
