/*global require*/
(function buildTask(require) {
  'use strict';

  var gulp = require('gulp')
    , changed = require('gulp-changed')
    , plumber = require('gulp-plumber')
    , sourcemaps = require('gulp-sourcemaps')
    , sass = require('gulp-sass')
    , browserSync = require('browser-sync')
    , paths = require('../paths')
    , header = require('gulp-header');

  gulp.task('scss', function onScss() {

    return gulp.src(paths.scss.files)
      .pipe(plumber())
      .pipe(changed(paths.output, {
        'extension': '.css'
      }))
      .pipe(sass(paths.scss.options))
      .pipe(header(paths.banner))
      .pipe(gulp.dest(paths.output))
      .pipe(browserSync.reload({
        'stream': true
      }));
  });
}(require));
