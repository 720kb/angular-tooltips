/*global module*/
(function babelConfiguration(module) {
  'use strict';

  module.exports = {
    'modules': 'umd',
    'moduleIds': false,
    'comments': true,
    'compact': false,
    'stage': 2,
    'externalHelpers': false,
    'optional': [
      'es7.decorators',
      'es7.classProperties'
    ]
  };
}(module));
