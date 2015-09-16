/*global module, require*/
(function setUp(module, require) {
  'use strict';

  var banner = ['/*!',
      ' * Angular Tooltips v<%= pkg.version %>',
      ' *',
      ' * Released under the MIT license',
      ' * www.opensource.org/licenses/MIT',
      ' *',
      ' * Brought to you by 720kb.net',
      ' *',
      ' * <%= grunt.template.today("yyyy-mm-dd") %>',
      ' */\n\n'].join('\n')
    , modRewrite = require('connect-modrewrite');

  module.exports = function doGrunt(grunt) {

    grunt.initConfig({
      'pkg': grunt.file.readJSON('package.json'),
      'confs': {
        'dist': 'dist',
        'css': 'src/css',
        'js': 'src/js',
        'serverPort': 8000
      },
      'jscs': {
        'src': '<%= confs.js %>/**/*.js',
        'options': {
          'config': '.jscsrc'
        }
      },
      'csslint': {
        'options': {
          'csslintrc': '.csslintrc'
        },
        'strict': {
          'src': [
            '<%= confs.css %>/**/*.css'
          ]
        }
      },
      'eslint': {
        'options': {
          'config': '.eslintrc'
        },
        'target': [
          'Gruntfile.js',
          '<%= confs.js %>/**/*.js'
        ]
      },
      'uglify': {
        'options': {
          'sourceMap': true,
          'sourceMapName': '<%= confs.dist %>/angular-tooltips.sourcemap.map',
          'preserveComments': false,
          'report': 'gzip',
          'banner': banner
        },
        'minifyTarget': {
          'files': {
            '<%= confs.dist %>/angular-tooltips.min.js': [
              '<%= confs.js %>/angular-tooltips.js'
            ]
          }
        }
      },
      'cssmin': {
        'options': {
          'report': 'gzip',
          'banner': banner
        },
        'minifyTarget': {
          'files': {
            '<%= confs.dist %>/angular-tooltips.min.css': [
              '<%= confs.css %>/angular-tooltips.css'
            ]
          }
        }
      },
      'connect': {
        'server': {
          'options': {
            'port': '<%= confs.serverPort %>',
            'base': '.',
            'keepalive': true,
            'middleware': function manageMiddlewares(connect, options, middlewares) {
              // enable Angular's HTML5 mode
              middlewares.push(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.gif$ /index.html [L]']));
              return middlewares;
            }
          }
        }
      },
      'watch': {
        'dev': {
          'files': [
            'Gruntfile.js',
            '<%= confs.css %>/**/*.css',
            '<%= confs.js %>/**/*.js'
          ],
          'tasks': [
            'csslint',
            'eslint'
          ],
          'options': {
            'spawn': false
          }
        }
      },
      'concurrent': {
        'dev': {
          'tasks': [
            'connect:server',
            'watch:dev'
          ],
          'options': {
            'limit': '<%= concurrent.dev.tasks.length %>',
            'logConcurrentOutput': true
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('lint', [
      'jscs',
      'csslint',
      'eslint'
    ]);

    grunt.registerTask('default', [
      'lint',
      'concurrent:dev'
    ]);

    grunt.registerTask('prod', [
      'lint',
      'cssmin',
      'uglify'
    ]);
  };
}(module, require));
