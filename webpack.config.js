/** @format */

const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const prefixer = require("postcss-prefixer");
const clean = require("postcss-clean");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeModDir = path.resolve("./node_modules/") + "/";

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    plugins: [
      prefixer({
        prefix: "_",
        ignore: [/luna-object-viewer/, /luna-notification/],
      }),
      autoprefixer,
      clean(),
    ],
  },
};

const cssMinifierLoader = {
  loader: path.resolve(__dirname, "./loaders/css-minifier-loader"),
  // options: {},
};

module.exports = {
  mode: "development",
  entry: {
    index: path.join(__dirname, "example/index.tsx"),
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "system",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|index\.js/,
        use: [
          {
            loader: "babel-loader",
            // options: {
            //   presets: ["@babel/preset-env"],
            //   plugins: [
            //     "@babel/plugin-transform-runtime",
            //     "@babel/plugin-proposal-class-properties",
            //   ],
            // },
          },
          // "eslint-loader",
        ],
      },
      {
        test: /\.tsx?/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        // pre/nomal/post - loader的执行顺序 - 前/中/后
        enforce: "pre",
        test: /\.tsx?/,
        loader: "source-map-loader",
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     cssMinifierLoader,
      //     {
      //       loader: "css-loader",
      //     },
      //     postcssLoader,
      //     {
      //       loader: "sass-loader",
      //     },
      //   ],
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     cssMinifierLoader,
      //     {
      //       loader: "css-loader",
      //     },
      //     postcssLoader,
      //   ],
      // },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },

      {
        test: /\.(png|jpg|gif|mp4|)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 20,
          },
        },
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              "./loaders/handlebars-minifier-loader.js"
            ),
            options: {},
          },
          {
            loader: nodeModDir + "handlebars-loader/index.js",
            options: {
              runtime:
                path.resolve(__dirname, "./example/lib") + "/handlebars.js",
              knownHelpers: ["class", "repeat", "concat"],
              precompileOptions: {
                knownHelpersOnly: true,
              },
            },
          },
          {
            loader: "html-minifier-loader",
            options: {
              ignoreCustomFragments: [/\{\{\{[^}]+\}\}\}/, /\{\{[^}]+\}\}/],
            },
          },
        ],
      },
    ],
  },
  // optimization: {
  //     splitChunks: {
  //         name: '[name].js',
  //     },
  // },
  //映射工具
  // devtool: 'source-map',
  //处理路径解析
  resolve: {
    //extensions 拓展名
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".scss"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./example/index.ejs"),
      filename: "./index.html",
      //   inject: false,
      name: "[name]",
      // scriptLoading: "blocking",
    }),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[id].[hash].css",
    }),

    new webpack.DefinePlugin({
      ENV: '"development"',
      VERSION: '"' + 1.1 + '"',
    }),
    // new webpack.ProvidePlugin({
    //     'window.System': 'System',
    // }),
  ],
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
  devServer: {
    port: 3005,
    open: true,
    publicPath: "/",
    hot: true,
    liveReload: true,
  },
};
