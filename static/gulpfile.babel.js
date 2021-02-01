'use strict'

// Switches Each Mode.
const switches = {
  ecma: true,
  json: true,
  styles: true,
  compressionImages: true,
  favicon: true,
  siteMap: false,
  htaccess: false,
  copy: false,
  rename: false
}

// Import Gulp API.
import { src, dest, lastRun, series, parallel, watch } from 'gulp'

// For ECMA.
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackDev from './webpack/webpack.dev.babel'
import webpackPro from './webpack/webpack.pro.babel'
// For Style.
import sass from 'gulp-sass'
import sassCompiler from 'sass'
import stylelint from 'gulp-stylelint'
import sassGlob from 'gulp-sass-glob'
import fibers from 'fibers'
import postCSS from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import fixFlexBugs from 'postcss-flexbugs-fixes'
import cacheBustingBackgroundImage from 'postcss-cachebuster'
import cssmin from 'gulp-cssmin'
// For Images.
import imagemin from 'gulp-imagemin'
import mozjpeg from 'imagemin-mozjpeg'
import pngquant from 'imagemin-pngquant'
// Utilities.
import utility from 'gulp-util'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import rename from 'gulp-rename'
import del from 'del'
import replace from 'gulp-replace'
import crypto from 'crypto'
import gulpIf from 'gulp-if'
import { exec } from 'child_process'

// Settings.
sass.compiler = sassCompiler
const settings = {
  postCSSLayoutFix: [autoprefixer({ grid: true }), fixFlexBugs],
  postCSSCacheBusting: [cacheBustingBackgroundImage({ imagesPath: '/resource/materials' })],
  styleEntryPointIgnore: [],
  styleGlobIgnore: [],
  inCompressionImages: ['./resource/materials/images/*'],
  outCompressionImages: '../delivery/assets/images/'
}

// Development Mode of ECMA by Webpack.
export const onWebpackDev = () => {
  return webpackStream(webpackDev, webpack)
    .on('error', function () {
      this.emit('end')
    })
    .pipe(dest('../delivery/assets/js/'))
}

// Production Mode of ECMA by Webpack.
export const onWebpackPro = () => {
  return webpackStream(webpackPro, webpack)
    .on('error', function () {
      this.emit('end')
    })
    .pipe(dest('../delivery/assets/js/'))
}

// When Add JSON.
export const onJson = () => {
  return src('./resource/materials/json/*').pipe(dest('../delivery/assets/json/'))
}

// Compile Sass.
export const onSass = () => {
  return src(['./resource/styles/**/*.scss', ...settings.styleEntryPointIgnore], { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError({ message: 'SCSS Compile Error: <%= error.message %>', onLast: true }) }))
    .pipe(stylelint({ reporters: [{ formatter: 'string', console: true }] }))
    .pipe(sassGlob({ ignorePaths: settings.styleGlobIgnore }))
    .pipe(sass({ fiber: fibers, outputStyle: 'expanded' }))
    .pipe(postCSS(settings.postCSSLayoutFix))
    .pipe(dest('./resource/materials/css/', { sourcemaps: '../maps' }))
}

// Minify CSS.
export const onCssmin = () => {
  return src('./resource/materials/css/**/*.css')
    .pipe(postCSS(settings.postCSSCacheBusting))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../delivery/assets/css/'))
}

// Images Minify.
export const onCompressionImages = () => {
  return src(settings.inCompressionImages)
    .pipe(plumber())
    .pipe(
      imagemin([
        pngquant({ quality: [0.65, 0.8], speed: 1 }),
        mozjpeg({ quality: 80 }),
        imagemin.gifsicle({ interlaced: false }),
        imagemin.svgo({ plugins: [{ removeViewBox: true }, { cleanupIDs: false }] })
      ])
    )
    .pipe(dest(settings.outCompressionImages))
}

// When Add site.webmanifest && browserconfig.xml. ( for Favicon. )
export const onManifest = () => {
  const cmd = 'cp resource/materials/favicons/site.webmanifest resource/materials/favicons/browserconfig.xml ../delivery'
  return exec(cmd)
}

// When Add Favicon.
export const onFavicon = () => {
  return src(['./resource/materials/favicons/*', '!./resource/materials/favicons/site.webmanifest', '!./resource/materials/favicons/browserconfig.xml']).pipe(
    dest('../delivery/assets/favicons/')
  )
}

// When Add Basic Auth.
export const onHtaccess = () => {
  const cmd = 'cp resource/materials/htaccess/.htaccess resource/materials/htaccess/.htpasswd ../delivery'
  return exec(cmd)
}

// Delete Unnecessary Files.
export const onDelete = (cb) => {
  return del(['**/.DS_Store', '!node_modules/**/*'], cb)
}

// For When Building Manually, Delete Compiled Files Before Building. ( When Switching Working Branches. )
export const onClean = () => {
  const cmd =
    'npx rimraf ../delivery/assets ../delivery/site.webmanifest ../delivery/browserconfig.xml ../delivery/.htaccess ../delivery/.htpasswd resource/materials/css resource/materials/maps'
  return exec(cmd)
}

// When Renaming Files.
export const onRename = () => {
  return src('addFile.name')
    .pipe(rename({ extname: '.extension' }))
    .pipe(dest('.'))
}

// When File Copy / Move.
export const onCopy = () => {
  return src('Add Source Dir/').pipe('Add Destination Dir/')
}

// Build　Manually.
// ECMA / Style / All.
export const onEcma = onWebpackDev
export const onStyles = series(onSass, onCssmin)
export const onBuild = series(
  onClean,
  parallel(onWebpackPro, onStyles, onCompressionImages, (doneReport) => {
    switches.json && onJson()
    switches.favicon && onManifest()
    switches.favicon && onFavicon()
    switches.htaccess && onHtaccess()
    doneReport()
  })
)

// When Developing, Build Automatically.
exports.default = parallel(() => {
  switches.ecma && watch(['./resource/base/**/*', './resource/types/**/*'], onEcma)
  switches.json && watch('./resource/materials/json/*', onJson)
  switches.styles && watch('./resource/styles/**/*.scss', onStyles)
  switches.compressionImages && watch(settings.inCompressionImages, onCompressionImages)
  switches.favicon && watch('./resource/materials/favicons/*', onManifest)
  switches.favicon && watch('./resource/materials/favicons/*', onFavicon)
  switches.rename && watch('**/*', onRename)
  switches.copy && onCopy()
})
