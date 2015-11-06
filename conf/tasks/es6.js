/*global require*/
(function buildTask(require) {
  'use strict';

  var gulp = require('gulp')
    , changed = require('gulp-changed')
    , plumber = require('gulp-plumber')
    , babel = require('gulp-babel')
    , sourcemaps = require('gulp-sourcemaps')
    , ngAnnotate = require('gulp-ng-annotate')
    , paths = require('../paths')
    , concat = require('gulp-concat')
    , compilerOptions = require('../babel-confs');

  gulp.task('es6', function onEs6() {

    return gulp.src(paths.source)
      .pipe(plumber())
      .pipe(changed(paths.output, {
        'extension': '.js'
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(compilerOptions))
      .pipe(ngAnnotate({
        'sourceMap': true,
        'gulpWarnings': false
      }))
      .pipe(concat('angular-tooltips.js'))
      .pipe(sourcemaps.write('.', {
        'sourceRoot': paths.sourcemapRoot
      }))
      .pipe(gulp.dest(paths.output));
  });
}(require));
