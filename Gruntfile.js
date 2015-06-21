'use strict';
module.exports = function (grunt) {

  grunt.initConfig({
    recess: {
      dist: {
        options: {
          compile: true,
          compress: false
        },
        files: {
          'dist/css/bootstrap-colorpicker.css': [
            'src/less/colorpicker.less'
          ]
        }
      },
      distMin: {
        options: {
          compile: true,
          compress: true
        },
        files: {
          'dist/css/bootstrap-colorpicker.min.css': [
            'src/less/colorpicker.less'
          ]
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'src/js/docs.js',
        'dist/js/bootstrap-colorpicker.js'
      ]
    },
    jsbeautifier: {
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0,
          endWithNewline: true
        }
      },
      srcFiles: ['src/js/*.js'],
      distFiles: ['dist/js/bootstrap-colorpicker.js']
    },
    combine: {
      dist: {
        input: 'src/js/colorpicker.js',
        output: 'dist/js/bootstrap-colorpicker.js',
        tokens: [{
          token: "'{{color}}';",
          file: 'src/js/colorpicker-color.js'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/bootstrap-colorpicker.min.js': [
            'dist/js/bootstrap-colorpicker.js'
          ]
        }
      }
    },
    watch: {
      less: {
        files: [
          'src/less/*.less'
        ],
        tasks: ['recess']
      },
      js: {
        files: [
          'src/js/*.js'
        ],
        tasks: ['jsbeautifier:srcFiles', 'combine', 'jsbeautifier:distFiles', 'uglify', 'jshint']
      }
    },
    clean: {
      dist: [
        'dist/css',
        'dist/js/*.js'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-combine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'recess',
    'jsbeautifier:srcFiles',
    'combine',
    'jsbeautifier:distFiles',
    'uglify',
    'jshint'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);

};
