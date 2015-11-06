/*global module*/
(function pathConfiguration(module) {
  'use strict';

  var paths = {
      'sourcemapRoot': '/lib',
      'output': 'dist/',
      'source': [
        'lib/tooltip.linking.func.js',
        'lib/tooltip.controller.js',
        'lib/tooltip.directive.js',
        'lib/tooltip.module.js'
      ],
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
