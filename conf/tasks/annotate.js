/*global require*/
(function buildTask(require) {
  'use strict';

  var gulp = require('gulp')
    , changed = require('gulp-changed')
    , plumber = require('gulp-plumber')
    , ngAnnotate = require('gulp-ng-annotate')
    , paths = require('../paths');

  gulp.task('annotate', function onEs6() {

    return gulp.src(paths.lib + paths.files.unminified.js)
      .pipe(plumber())
      .pipe(changed(paths.output, {
        'extension': '.js'
      }))
      .pipe(ngAnnotate({
        'gulpWarnings': false
      }))
      .pipe(gulp.dest(paths.output));
  });
}(require));
