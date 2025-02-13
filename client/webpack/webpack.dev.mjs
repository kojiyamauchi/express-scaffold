/*
   Setting webpack for Development.
*/

import { merge } from 'webpack-merge'

import webpackBase from './webpack.base.mjs'
const __filename = import.meta.filename

// Base Setting by webpack.gulp.base.babel.js
export default merge(webpackBase, {
  // Setting webpack Mode.
  mode: 'development',
  /*
    Persistent Caching.
    See -> https://webpack.js.org/configuration/other-options/#cache
    See -> https://blog.hiroppy.me/entry/webpack-persistent-caching
  */
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins: [],
  devtool: 'inline-source-map',
})
