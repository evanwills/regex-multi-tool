const { src, dest, series, watch, gulp } = require('gulp')
const browserSync = require('browser-sync').create()
// const sass = require('gulp-sass')
const ts = require("gulp-typescript");

const origin = './'
// const destination = './'

// sass.compiler = require('node-sass')

// function scss (cb) {
//   src('scss/*.scss')
//     .pipe(sass({
//       outputStyle: 'expanded',
//       eyeglass: {
//         enableImportOnce: false
//       },
//       precision: 3,
//       sourceComments: true,
//       sourceMap: true,
//       sourceMapContents: true
//     }))
//     .pipe(dest('css'))
// }

function watcher (cb) {
  // watch(origin + 'scss/**/*.scss').on(
  //   'change', series(scss)
  // )
  watch(origin + '**/*.html').on(
    'change', series(browserSync.reload)
  )
  watch(origin + '**/*.css').on(
    'change', series(browserSync.reload)
  )
  watch(origin + '**/*.js').on(
    'change', series(browserSync.reload)
  )
  watch(origin + '**/*.mjs').on(
    'change', series(browserSync.reload)
  )
  cb()
}

function server (cb) {
  browserSync.init({
    // more info on browser-sync options:
    // https://browsersync.io/docs/options
    server: {
      notify: true,
      open: true,
      baseDir: './',
      index: 'index.html'
    },
    // ui: {
    //   port: 56017
    // },
    // The following is adapted from
    // https://github.com/BrowserSync/browser-sync/issues/1503
    callbacks: {
      ready: function (err, bs) {
        if (err) {
          console.log(err)
        }
        bs.utils.serveStatic.mime.define({
          'text/javascript': ['mjs', 'js'],
          'text/css': ['css'],
          'text/svg': ['svg'],
          'image/jpeg': ['jpg', 'jpeg'],
          'image/png': ['png']
        })
      }
    }
  })
  cb()
}

exports.default = series(server, watcher)
