const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin"); // برای کپی کردن مدل‌ها

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
    resolve: {
      fallback: {
        // شبیه‌سازی ماژول‌های Node.js برای face-api.js
        fs: false,
        path: false,
        util: false,
        crypto: false,
      },
    },
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      static: [
        {
          directory: path.join(__dirname, "dist"),
        },
        {
          directory: path.join(__dirname, "public"),
          publicPath: "/",
        },
      ],
      compress: true,
      port: 3000,
      host: "0.0.0.0",
      hot: true,
      open: true,
      historyApiFallback: true,
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
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
          use: ["style-loader", "css-loader"],
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
      // کپی کردن مدل‌های face-api.js به پوشه dist
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: "",
          },
        ],
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
