/*
   Setting webpack for Production.
*/

import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { merge } from 'webpack-merge'

import webpackBase from './webpack.base.mjs'

// Base Setting by webpack.gulp.base.babel.js.
export default merge(webpackBase, {
  mode: 'production',
  // Setting for Plugins.
  plugins: [
    /* Even when it is already sufficiently compressed,
    the code can be analyzed in detail and the parts
    that are likely to be commonly compressed are compressed more positively */
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  // Advanced Setting for Plugins.
  optimization: {
    // 'optimization.minimize' is true by default in production mode.
    minimizer: [
      // For Terser webpack Plugin.
      new TerserPlugin({
        terserOptions: {
          compress: {
            // Delete console.***(), When Minify of JS File.
            drop_console: true,
          },
        },
      }),
    ],
  },
})
