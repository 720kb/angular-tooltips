/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, banner, cssFolders) {

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    return {
      'options': {
        'report': 'gzip',
        'banner': banner
      },
      'minifyTarget': {
        'files': {
          '<%= confs.dist %>/angular-tooltips.min.css': cssFolders
        }
      }
    };
  };
}(module));
