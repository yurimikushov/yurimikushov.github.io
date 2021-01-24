const { src, dest, series, watch } = require('gulp')
const cleanDir = require('gulp-clean-dir')
const concatCss = require('gulp-concat-css')
const autoprefixerCss = require('gulp-autoprefixer')
const minifyCss = require('gulp-clean-css')
const concatJs = require('gulp-concat')
const babelJs = require('gulp-babel')
const minifyJs = require('gulp-terser')
const imagemin = require('gulp-imagemin')
const server = require('browser-sync').create()

const buildCss = () => {
  return src('src/css/index.css')
    .pipe(cleanDir('dist/css'))
    .pipe(concatCss('bundle.min.css'))
    .pipe(autoprefixerCss())
    .pipe(minifyCss())
    .pipe(dest('dist/css'))
}

const buildJs = () => {
  return src('src/js/**/*.js')
    .pipe(cleanDir('dist/js'))
    .pipe(concatJs('bundle.min.js'))
    .pipe(
      babelJs({
        presets: ['@babel/env'],
      })
    )
    .pipe(minifyJs())
    .pipe(dest('dist/js'))
}

const minifyImage = () => {
  return src('src/img/**/*.{ico,png,jpg,svg,webp}')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
}

const build = series(buildCss, buildJs, minifyImage)

const start = () => {
  server.init({
    server: '',
    notify: false,
    open: true,
  })

  watch(
    'index.html',
    series((callback) =>
      src('index.html').pipe(server.stream()).on('end', callback)
    )
  )

  watch(
    'src/css/**/*.css',
    series(buildCss, (callback) =>
      src('dist/css').pipe(server.stream()).on('end', callback)
    )
  )

  watch(
    'src/js/**/*.js',
    series(buildJs, (callback) =>
      src('dist/js').pipe(server.stream()).on('end', callback)
    )
  )

  watch(
    'src/img/**/*.{ico,png,jpg,svg,webp}',
    series(minifyImage, (callback) =>
      src('dist/img').pipe(server.stream()).on('end', callback)
    )
  )
}

module.exports.build = build
module.exports.start = start
