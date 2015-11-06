/*global require*/
(function buildTask(require) {
  'use strict';

  var gulp = require('gulp')
    , changed = require('gulp-changed')
    , plumber = require('gulp-plumber')
    , sourcemaps = require('gulp-sourcemaps')
    , sass = require('gulp-sass')
    , browserSync = require('browser-sync')
    , cssmin = require('gulp-cssmin')
    , paths = require('../paths');

  gulp.task('scss', function onScss() {

    return gulp.src(paths.scss.file)
      .pipe(plumber())
      .pipe(changed(paths.output, {
        'extension': '.css'
      }))
      .pipe(sourcemaps.init())
      .pipe(sass(paths.scss.options))
      .pipe(cssmin())
      .pipe(sourcemaps.write('.'), {
        'sourceRoot': paths.sourcemapRoot
      })
      .pipe(gulp.dest(paths.output))
      .pipe(browserSync.reload({
        'stream': true
      }));
  });
}(require));
