/*global module*/
(function babelConfiguration(module) {
  'use strict';

  module.exports = ['/*!',
    ' * Angular Tooltips v<%= pkg.version %>',
    ' *',
    ' * Released under the MIT license',
    ' * www.opensource.org/licenses/MIT',
    ' *',
    ' * Brought to you by 720kb.net',
    ' *',
    ' * <%= grunt.template.today("yyyy-mm-dd") %>',
    ' */\n'
  ].join('\n');
}(module));
