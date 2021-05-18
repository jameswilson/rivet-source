const { dest, series, src, watch } = require('gulp')
const babel = require('rollup-plugin-babel')
const bannerText = require('./bannerText')
const header = require('gulp-header')
const minify = require('gulp-terser')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const pkg = require('../package.json')
const rename = require('gulp-rename')
const rollup = require('rollup')
const strip = require('gulp-strip-comments')

async function compileIIFE() {
  try {
    const bundle = await rollup.rollup({
      input: './src/js/index.js',
      plugins: [nodeResolve(), babel({ runtimeHelpers: true })]
    });

    await bundle.write({
      file: './static/js/rivet-iife.js',
      format: 'iife',
      name: 'Rivet'
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function compileESM() {
  try {
    const bundle = await rollup.rollup({
      input: './src/js/index.js',
      plugins: [nodeResolve()]
    });

    await bundle.write({
      file: './static/js/rivet-esm.js',
      format: 'es',
      name: 'Rivet'
    });
  } catch (error) {
    throw new Error(error);
  }
}

// Copy JS files from 'static' to 'js'
function distJS() {
  return src(['./static/js/rivet-esm.js', './static/js/rivet-iife.js'], {
    base: './static/js'
  }).pipe(dest('./js'));
}

// Strip out comments from JS files
function stripIIFE() {
  return src('./js/rivet-iife.js')
    .pipe(strip())
    .pipe(dest('./js'));
}

function stripESM() {
  return src('./js/rivet-esm.js')
    .pipe(strip())
    .pipe(dest('./js'));
}

function minifyJS() {
  return src('./js/rivet-iife.js')
    .pipe(minify())
    .pipe(rename({ basename: 'rivet', suffix: '.min' }))
    .pipe(dest('./js'));
}

function headerJS(callback) {
  src('./js/rivet-iife.js')
    .pipe(header(bannerText, { package: pkg }))
    .pipe(dest('./js/'));

  src('./js/rivet-esm.js')
    .pipe(header(bannerText, { package: pkg }))
    .pipe(dest('./js/'));

  src('./js/rivet.min.js')
    .pipe(header(bannerText, { package: pkg }))
    .pipe(dest('./js/'));

  callback();
}

// Copy vendor.js from 'src/js' to 'static/js' for Fractal to use
function vendorJS() {
  return src('src/js/vendor.js').pipe(dest('./static/js'));
}

function watchJS(callback) {
  watch(
    'src/js/**/*.js',
    { ignoreInitial: false },
    series(compileIIFE, compileESM, vendorJS)
  );
  callback();
}

module.exports = { compileIIFE, compileESM, distJS, stripIIFE, stripESM, minifyJS, headerJS, vendorJS, watchJS }