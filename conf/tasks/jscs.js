/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, jsFolders) {

    grunt.loadNpmTasks('grunt-jscs');
    return {
      'options': {
        'config': '.jscsrc'
      },
      'files': {
        'src': jsFolders
      }
    };
  };
}(module));
