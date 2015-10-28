/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, jsFolders) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    return {
      'options': {
        'jshintrc': true
      },
      'files': {
        'src': jsFolders
      }
    };
  };
}(module));
