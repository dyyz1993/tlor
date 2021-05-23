/** @format */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: path.join(__dirname, "example/index.ts"),
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|index\.js/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                ["import", { libraryName: "antd-mobile", style: true }],
              ],
            },
          },
        ],
      },
      {
        test: /\.tsx?/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      // },
      {
        test: /\.css$/,
        use: [{ loader: "css-loader" }],
      },
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.less$/,
        use: ["css-loader", { loader: "less-loader" }],
        include: /node_modules/,
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
    ],
  },
  //映射工具
  devtool: "source-map",
  //处理路径解析
  resolve: {
    //extensions 拓展名
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".scss", ".less"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./example/index.html"),
      filename: "./index.html",
      //   inject: false,
      name: "[name]",
    }),
    // new MiniCssExtractPlugin({
    //   // 这里的配置和webpackOptions.output中的配置相似
    //   // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
    //   filename: "css/[name].[hash].css",
    //   chunkFilename: "css/[id].[hash].css",
    // }),

    new webpack.DefinePlugin({
      ENV: '"development"',
      VERSION: '"' + 1.1 + '"',
    }),

    // new webpack.ProvidePlugin({
    //     'window.System': 'System',
    // }),
  ],
  devServer: {
    port: 3005,
    open: true,
    publicPath: "/",
    hot: true,
    liveReload: true,
  },
};
