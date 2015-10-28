/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, jsFolders) {

    grunt.loadNpmTasks('grunt-eslint');
    return {
      'options': {
        'config': '.eslintrc'
      },
      'target': jsFolders
    };
  };
}(module));
