/*global module*/
(function withNode(module) {
  'use strict';

  module.exports = function exportingFunction(grunt, connectionInfo) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    return {
      'server': {
        'options': {
          'port': connectionInfo.port,
          'base': connectionInfo.base,
          'keepalive': true
        }
      }
    };
  };
}(module));
