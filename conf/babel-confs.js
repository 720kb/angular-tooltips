/*global module*/
(function babelConfiguration(module) {
  'use strict';

  module.exports = {
    'presets': [
      'es2015'
    ],
    'plugins': [
      'transform-es2015-modules-umd'
    ],
    'moduleIds': true,
    'comments': true
  };
}(module));
