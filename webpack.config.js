const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      filename: isProduction ? "eyeglass-widget.min.js" : "eyeglass-widget.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      library: "EyeglassWidget",
      libraryTarget: "umd",
      libraryExport: "default",
      umdNamedDefine: true,
      globalObject: "this",
    },
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      host: "0.0.0.0", // این خط را اضافه کنید
      hot: true,
      open: true, // Automatically open browser
      historyApiFallback: true,
      allowedHosts: "all", // این خط را اضافه کنید
      headers: {
        "Access-Control-Allow-Origin": "*", // این خط را اضافه کنید
      },
    },
    module: {
      rules: [
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
          test: /\.css$/,
          use: [
            "style-loader", // Always use style-loader to inject CSS into JS
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: "index.html",
        inject: "body",
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
  };
};
