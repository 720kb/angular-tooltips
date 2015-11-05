/*global module*/
(function pathConfiguration(module) {
  'use strict';

  var paths = {
      'sourcemapLib': '/lib',
      'output': 'dist/',
      'source': 'lib/**/*.js',
      'html': 'lib/**/*.html',
      'scss': {
        'file': 'lib/**/*.scss',
        'options': {}
      },
      'assets': [
        'lib/**/*.json',
        'lib/**/*.svg',
        'lib/**/*.woff',
        'lib/**/*.ttf',
        'lib/**/*.png',
        'lib/**/*.ico',
        'lib/**/*.jpg',
        'lib/**/*.gif',
        'lib/**/*.eot'
      ]
    };

  module.exports = paths;
}(module));
