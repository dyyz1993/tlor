/** @format */

const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    record: path.join(__dirname, "src/record/index.tsx"),
    replay: path.join(__dirname, "src/replay/index.tsx"),
  },
  output: {
    path: path.join(__dirname, "build"),
    libraryTarget: "umd",
    library: "Tlor",
    filename: "[name].js",
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: ["css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|mp4)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 20,
          },
        },
      },
    ],
  },
  // externals: {
  //     react: 'react',
  //     'react-dom': 'react-dom',
  // },
  //映射工具
  // devtool: 'source-map',
  //处理路径解析
  resolve: {
    //extensions 拓展名
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
  },
};
