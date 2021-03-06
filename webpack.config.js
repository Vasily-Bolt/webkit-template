const path = require('path')
const ASSET_PATH = process.env.ASSET_PATH || '';
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log ("iS DEV ", isDev)

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin (),
      new TerserWebpackPlugin ()
    ]
  }
  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    // main: './index.js',
    // just: './indexnot.js'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      // '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
    hot: isDev,
  },
  plugins: [
    // new HTMLWebpackPlugin( {
    //   template: './pages/1/index.pug',
    //   filename: 'index.html',
    //   inject: true,
    //   chunks: ['main'],
    //   minify: {
    //     collapseWhitespace: isProd 
    //   }
    // }),
    // new HTMLWebpackPlugin( {
    //   template: './pages/2/indexnot.pug',
    //   filename: 'indexnot.html',
    //   inject: true,
    //   chunks: ['just'],
    //   minify: {
    //     collapseWhitespace: isProd 
    //   }
    // }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          // from: path.resolve(__dirname, 'src/favicon.ico'),
          // to: path.resolve(__dirname, 'dist')
        },
    ]}),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ]
  }
}