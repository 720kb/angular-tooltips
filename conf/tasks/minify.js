/*global require*/
(function buildTask(require) {
  'use strict';

  var gulp = require('gulp')
    , plumber = require('gulp-plumber')
    , sourcemaps = require('gulp-sourcemaps')
    , paths = require('../paths')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , cssmin = require('gulp-cssmin')
    , runSequence = require('run-sequence');

  gulp.task('minify', ['build'], function onMinify(done) {

    return runSequence([
      'minify-js',
      'minify-css'
    ], done);
  });

  gulp.task('minify-js', function onMinifyJs() {

    return gulp.src(paths.toMinify.js)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('angular-tooltips.min.js'))
      .pipe(sourcemaps.write('.', {
        'sourceRoot': paths.sourcemapRoot
      }))
      .pipe(gulp.dest(paths.output));
  });

  gulp.task('minify-css', function onMinifyCss() {

    return gulp.src(paths.toMinify.css)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(cssmin())
      .pipe(concat('angular-tooltips.min.css'))
      .pipe(sourcemaps.write('.'), {
        'sourceRoot': paths.sourcemapRoot
      })
      .pipe(gulp.dest(paths.output));
  });

}(require));
