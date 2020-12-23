const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')

const origin = './';
const destination = './'

sass.compiler = require('node-sass')


function scss (cb) {
  src('scss/*.scss').
  pipe(sass({
    outputStyle: 'expanded',
    eyeglass: {
      enableImportOnce: false
    },
    precision: 3,
    sourceComments: true,
    sourceMap: true,
    sourceMapContents: true,
  })).
  pipe(dest('.css'))
}

function watcher (cb) {
  watch(origin + 'scss/**/*.scss').on(
    'change', series(scss)
  )
  watch(origin + '**/*.html').on(
    'change', series(html, browserSync.reload)
  )
  watch(origin + '**/*.css').on(
    'change', series(css, browserSync.reload)
  )
  watch(origin + '**/*.js').on(
    'change', series(js, browserSync.reload)
  )
  cb()
}

function server (cb) {
  browserSync.init({
    server: {
      notify: false,
      open: true,
      baseDir: destination,
      index: origin + 'index.html',
      serveStaticOptions: {
        extensions: ['html', 'js', 'css']
      }
    },
    callbacks: {
      ready: function(err, bs) {
        bs.utils.serveStatic.mime.define({
          'text/javascript': ['js', 'mjs']
        });

        console.log("---> " + bs.utils.serveStatic.mime.lookup('.wasm'));
      }
    }
  })
  cb()
}


exports.default = series(server);
