import autoprefixer from 'autoprefixer'
import { exec } from 'child_process'
import dayjs from 'dayjs'
import { deleteAsync } from 'del'
import { dest, parallel, series, src, watch } from 'gulp'
import cssmin from 'gulp-clean-css'
import sass from 'gulp-dart-sass'
import plumber from 'gulp-plumber'
import postCss from 'gulp-postcss'
import rename from 'gulp-rename'
import sassGlob from 'gulp-sass-glob-use-forward'
import webp from 'gulp-webp'
import cacheBustingBackgroundImage from 'postcss-cachebuster'
import fixFlexBugs from 'postcss-flexbugs-fixes'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'

import webpackDev from './webpack/webpack.dev.mjs'
import webpackPro from './webpack/webpack.pro.mjs'

const date = dayjs()

// Switches Each Mode.
const switches = {
  ecma: true,
  json: true,
  styles: true,
  webps: true,
  minifyImages: true,
  favicon: true,
  siteMap: false,
  htaccess: false,
  copy: false,
  rename: false,
}

const logFonts = {
  bold: '\x1b[1m',
  bright: '\x1b[1m',
  colorGreen: '\x1b[32m',
  colorCyan: '\u001b[36m',
  colorYellow: '\x1b[33m',
  colorRed: '\x1b[31m',
  colorMagenta: '\u001b[35m',
  reset: '\x1b[0m',
}

// Setup.
const setup = {
  ecmas: {
    in: './resource/base/**/*',
    out: '../delivery/assets/js/',
    inTypes: './resource/types/**/*',
    inJson: './resource/materials/json/*',
    outJson: '../delivery/assets/json/',
  },
  styles: {
    inScss: './resource/styles/**/*.scss',
    outScss: './resource/materials/css/',
    inCss: './resource/materials/css/**/*.css',
    outCss: '../delivery/assets/css/',
    entryPointIgnore: [],
    globIgnore: [],
    postCssSassOptions: [autoprefixer({ grid: true }), fixFlexBugs],
    postCssCssOptions: [cacheBustingBackgroundImage({ imagesPath: '/resource/materials' })],
  },
  images: {
    in: './resource/materials/images/*.{svg,png,jpg,jpeg,gif}',
    out: '../delivery/assets/images/',
    inWebps: './resource/materials/toWebps/*.{svg,png,jpg,jpeg,gif}',
    outWebps: './resource/materials/images/',
  },
  favicons: {
    in: './resource/materials/favicons/*',
    out: '../delivery/assets/favicons/',
  },
}

// Development Mode of ECMA by Webpack.
export const onWebpackDev = () => {
  return webpackStream(webpackDev, webpack)
    .on('error', function () {
      this.emit('end')
    })
    .pipe(dest(setup.ecmas.out))
}

// Production Mode of ECMA by Webpack.
export const onWebpackPro = () => {
  return webpackStream(webpackPro, webpack)
    .on('error', function () {
      this.emit('end')
    })
    .pipe(dest(setup.ecmas.out))
}

// When Add JSON.
export const onJson = () => {
  return src(setup.ecmas.inJson).pipe(dest(setup.ecmas.outJson))
}

export const onStylelint = (done) => {
  exec("yarn stylelint './resource/styles/**/*.scss'", (err, _stdout, stderr) => {
    if (err) {
      console.error(`${logFonts.bold}${logFonts.colorYellow}${stderr}${logFonts.reset}`)
      done(new Error(`${logFonts.colorRed}Stylelint Failed.${logFonts.reset}`))
    } else {
      console.info(`[${logFonts.colorMagenta}${date.format('HH:mm:ss')}${logFonts.reset}] ${logFonts.colorCyan}Stylelint Pass.${logFonts.reset}`)
      done()
    }
  })
}

// Compile Sass.
export const onSassCompile = (done) => {
  return src([setup.styles.inScss, ...setup.styles.entryPointIgnore], { sourcemaps: true })
    .pipe(sassGlob({ ignorePaths: setup.styles.globIgnore }))
    .pipe(
      sass.sync({ silenceDeprecations: ['legacy-js-api'], outputStyle: 'expanded' }).on('error', () => {
        sass.logError
        done(new Error(`${logFonts.colorRed}Sass Compile Failed.${logFonts.reset}`))
      }),
    )
    .pipe(postCss(setup.styles.postCssSassOptions))
    .pipe(dest(setup.styles.outScss, { sourcemaps: '../maps' }))
}

export const onSass = series(onStylelint, onSassCompile)

// Minify CSS.
export const onCssmin = () => {
  return src(setup.styles.inCss)
    .pipe(postCss(setup.styles.postCssCssOptions))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(setup.styles.outCss))
}

// Convert to Webp.
export const onWebps = () => {
  return src(setup.images.inWebps).pipe(webp()).pipe(dest(setup.images.outWebps)).pipe(dest(setup.images.out))
}

// Minify Images.
export const onMinifyImages = async () => {
  const imagemin = await import('gulp-imagemin')
  return src(setup.images.in)
    .pipe(plumber())
    .pipe(
      imagemin.default([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: true,
            },
            {
              name: 'cleanupIDs',
              active: false,
            },
          ],
        }),
      ]),
    )
    .pipe(dest(setup.images.out))
}

// When Add site.webmanifest && browserconfig.xml. ( for Favicon. )
export const onManifest = () => {
  const cmd = 'cp resource/materials/favicons/site.webmanifest resource/materials/favicons/browserconfig.xml ../delivery'
  return exec(cmd)
}

// When Add Favicon.
export const onFavicon = () => {
  return src(['./resource/materials/favicons/*', '!./resource/materials/favicons/site.webmanifest', '!./resource/materials/favicons/browserconfig.xml']).pipe(
    dest(setup.favicons.out),
  )
}

// When Add Basic Auth.
export const onHtaccess = () => {
  const cmd = 'cp resource/materials/htaccess/.htaccess resource/materials/htaccess/.htpasswd ../delivery'
  return exec(cmd)
}

// Delete Unnecessary Files.
export const onDelete = async (cb) => {
  return await deleteAsync(['**/.DS_Store', '!node_modules/**/*'], cb)
}

// For When Building Manually, Delete Compiled Files Before Building. ( When Switching Working Branches. )
export const onClean = () => {
  const cmd =
    'npx rimraf ../delivery/assets ../delivery/site.webmanifest ../delivery/browserconfig.xml ../delivery/.htaccess ../delivery/.htpasswd resource/materials/css resource/materials/maps resource/materials/images/*.webp'
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

// Build Manually.
// ECMA / Style / All.
export const onEcma = onWebpackDev
export const onStyles = series(onSass, onCssmin)
export const onBuild = series(
  onClean,
  parallel(onWebpackPro, onStyles, onWebps, onMinifyImages, (doneReport) => {
    switches.json && onJson()
    switches.favicon && onManifest()
    switches.favicon && onFavicon()
    switches.htaccess && onHtaccess()
    doneReport()
  }),
)

// When Developing, Build Automatically.
export default parallel(() => {
  switches.ecma && watch([setup.ecmas.in, setup.ecmas.inTypes], onEcma)
  switches.json && watch(setup.ecmas.inJson, onJson)
  switches.styles && watch(setup.styles.inScss, onStyles)
  switches.webps && watch(setup.images.inWebps, onWebps)
  switches.minifyImages && watch(setup.images.in, onMinifyImages)
  switches.favicon && watch(setup.favicons.in, onManifest)
  switches.favicon && watch(setup.favicons.in, onFavicon)
  switches.rename && watch('**/*', onRename)
  switches.copy && onCopy()
})
