/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, banner, jsFolders) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    return {
      'options': {
        'sourceMap': true,
        'sourceMapName': '<%= confs.dist %>/angular-tooltips.sourcemap.map',
        'preserveComments': false,
        'report': 'gzip',
        'banner': banner
      },
      'minifyTarget': {
        'files': {
          '<%= confs.dist %>/angular-tooltips.min.js': jsFolders
        }
      }
    };
  };
}(module));
