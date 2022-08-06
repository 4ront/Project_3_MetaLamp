const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const devServer = require("./webpack/devServer")
// const styles = require("./webpack/styles")
// const pug = require("./webpack/pug")
// const images = require(".webpack/images")
// const fonts = require("./webpack/fonts")
// const javaScript = require("./webpack/javaScript")
// const sourceMap = require("./webpack/sourceMap")

const PAGES_DIR = path.resolve(__dirname, "src/pages")
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .map((item) => item.replace(/\.[^/.]+$/, ""))
const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./dist"),
}

const devMode = process.env.NODE_ENV === "development"
const productionMode = !devMode
const filename = (ext) =>
  devMode ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`
const entryPoints = PAGES.map((page) => ({
  [page]: `${PAGES_DIR}/${page}/index.js`,
}))
const entryPointsCorrect = Object.assign({}, ...entryPoints)

module.exports = {
  devServer: {
    static: "./dist",
    port: 4327,
    open: "/demo.html",
    hot: false,
  },
  entry: entryPointsCorrect,
  output: {
    filename: filename("js"),
    path: PATHS.dist,
    clean: true,
  },
  resolve: {
    alias: {
      "@variables": path.resolve(
        __dirname,
        `${PATHS.src}/styles/variables.scss`
      ),
      "@mixins": path.resolve(__dirname, `${PATHS.src}/styles/mixins.scss`),
      src: path.resolve(__dirname, `${PATHS.src}`),
      components: path.resolve(__dirname, `${PATHS.src}/components`),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: `${PAGES_DIR}/${page}/${page}.pug`,
          chunks: [page],
        })
    ),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: {
          pretty: devMode,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: [/fonts/],
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.(ttf|woff|woff2|svg|eot)$/,
        exclude: [/images/],
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
    ],
  },
}

// module.exports = function () {
//   if (productionMode) {
//     return merge([common, postcss()])
//   }
//   if (devMode) {
//     return merge([common, styles(), devServer(), sourceMap()])
//   }
// }
