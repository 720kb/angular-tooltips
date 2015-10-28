/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, cssFolders) {

    grunt.loadNpmTasks('grunt-contrib-csslint');
    return {
      'options': {
        'csslintrc': '.csslintrc'
      },
      'strict': {
        'src': cssFolders
      }
    };
  };
}(module));
