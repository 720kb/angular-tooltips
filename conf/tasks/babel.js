/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, babelConfs, jsFolders) {

    grunt.loadNpmTasks('grunt-babel');
    return {
      'options': babelConfs,
      'dist': {
        'files': {
          'dist/app.js': jsFolders
        }
      }
    };
  };
}(module));
