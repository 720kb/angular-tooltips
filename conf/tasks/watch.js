/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, jsFolders, cssFolders) {

    var watchingFile = [];
    watchingFile.concat(jsFolders);
    watchingFile.concat(cssFolders);
    grunt.loadNpmTasks('grunt-contrib-watch');
    return {
      'dev': {
        'files': watchingFile,
        'tasks': [
          'csslint',
          'eslint'
        ],
        'options': {
          'spawn': false
        }
      }
    };
  };
}(module));
