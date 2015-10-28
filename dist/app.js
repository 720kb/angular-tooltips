(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Gruntfile = mod.exports;
  }
})(this, function (exports) {
  /*global module,require*/
  'use strict';

  (function setUp(module, require) {
    'use strict';

    var banner = require('./conf/banner'),
        babelConfs = require('./conf/babel-confs'),
        configuration = {
      'dist': 'dist',
      'css': 'src/css',
      'js': 'src/js',
      'demo': 'demo',
      'serverPort': 8000
    },
        connectionInfo = {
      'port': '<%= confs.serverPort %>',
      'base': '<%= confs.demo %>'
    },
        cssFolders = ['<%= confs.css %>/**/*.css'],
        jsFolders = ['Gruntfile.js', '<%= confs.js %>/**/*.js'];

    module.exports = function doGrunt(grunt) {

      var packageInformations = grunt.file.readJSON('package.json'),
          babel = require('./conf/tasks/babel')(grunt, babelConfs, jsFolders),
          csslint = require('./conf/tasks/csslint')(grunt, cssFolders),
          eslint = require('./conf/tasks/eslint')(grunt, jsFolders),
          jshint = require('./conf/tasks/jshint')(grunt, jsFolders),
          jscs = require('./conf/tasks/jscs')(grunt, jsFolders),
          cssmin = require('./conf/tasks/cssmin')(grunt, banner, cssFolders),
          uglify = require('./conf/tasks/uglify')(grunt, banner, jsFolders),
          connect = require('./conf/tasks/connect')(grunt, connectionInfo),
          watch = require('./conf/tasks/watch')(grunt, jsFolders, cssFolders),
          concurrent = require('./conf/tasks/concurrent')(grunt);

      grunt.initConfig({
        'pkg': packageInformations,
        'confs': configuration,
        'babel': babel,
        'csslint': csslint,
        'eslint': eslint,
        'jshint': jshint,
        'jscs': jscs,
        'cssmin': cssmin,
        'uglify': uglify,
        'connect': connect,
        'watch': watch,
        'concurrent': concurrent
      });

      grunt.registerTask('lint', ['csslint', 'eslint', 'jshint', 'jscs']);

      grunt.registerTask('prod', ['lint', 'babel', 'uglify']);

      grunt.registerTask('default', ['lint', 'babel', 'concurrent:dev']);
    };
  })(module, require);
});
