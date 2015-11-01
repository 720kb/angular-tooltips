/*global console,__dirname,require*/
(function serveTask(console, __dirname, require) {
  'use strict';

  var gulp = require('gulp')
    , path = require('path')
    , runSequence = require('run-sequence')
    , browserSync = require('browser-sync')
    , nodemon = require('gulp-nodemon')
    , nodeInspector = require('gulp-node-inspector')
    , historyApiFallback = require('connect-history-api-fallback')
    , serverIndexFile = path.resolve(__dirname, '../..', 'server/index.js')
    , paths = require('../paths')
    , pathToSource = path.resolve(__dirname, '../..', paths.source)
    , pathToDist = path.resolve(__dirname, '../..', paths.output + '**/*.js');

  gulp.task('node-debug', function runNodeInspector() {

    gulp.src([])
      .pipe(nodeInspector({
        'debugPort': 5858,
        'webHost': '0.0.0.0',
        'webPort': 8080,
        'saveLiveEdit': false,
        'preload': true,
        'inject': true,
        'hidden': [],
        'stackTraceLimit': 50,
        'sslKey': '',
        'sslCert': ''
      }));
  });

  gulp.task('run-nodemon', function runNodemon(done) {

    nodemon({
      'nodeArgs': ['--debug'],
      'script': serverIndexFile,
      'ext': 'js',
      'ignore': [
        pathToSource,
        pathToDist
      ]
    })
    .on('start', function onStart() {

      done();
    })
    .on('restart', function onRestart(data) {

      /* eslint-disable no-console */
      console.log(data, 'restarted!');
      /* eslint-enable no-console */
    })
    .on('crash', function onCrash() {

      /* eslint-disable no-console */
      console.log('crashed');
      /* eslint-enable no-console */
      this.emit('restart');
    });
  });

  gulp.task('run-browser-sync', function runBrowserSync(done) {

    browserSync({
      'open': true,
      'ui': false,
      'port': 8100,
      'server': {
        'baseDir': ['./www'],
        'middleware': [
          historyApiFallback()
        ]
      }
    }, done);
  });

  gulp.task('serve', ['watch'], function onServe(done) {

    return runSequence(['run-nodemon', 'run-browser-sync'], done);
  });
}(console, __dirname, require));
