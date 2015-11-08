/*global module*/
(function pathConfiguration(module) {
  'use strict';

  var paths = {
      'lib': 'lib/',
      'output': 'dist/',
      'files': {
        'unminified': {
          'js': 'angular-tooltips.js',
          'css': 'angular-tooltips.css'
        },
        'minified': {
          'js': 'angular-tooltips.min.js',
          'css': 'angular-tooltips.min.css'
        }
      },
      'scss': {
        'files': [
          'lib/**/*.scss'
        ],
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
