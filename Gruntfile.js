'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/js/*.js'
            ]
        },
        recess: {
            cssDistMin: {
                options: {
                    compile: true,
                    compress: true
                },
                files: {
                    'dist/css/bootstrap-colorpicker.min.css': [
                        'src/less/colorpicker.less'
                    ]
                }
            },
            cssDist: {
                options: {
                    compile: true,
                    compress: false
                },
                files: {
                    'dist/css/bootstrap-colorpicker.css': [
                        'src/less/colorpicker.less'
                    ]
                }
            }
        },
        uglify: {
            jsDistMin: {
                files: {
                    'dist/js/bootstrap-colorpicker.min.js': [
                        'src/js/colorpicker.js'
                    ]
                }
            }
        },
        jsbeautifier:{
            files:['src/js/*.js']
        },
        concat: {
            options: {
                separator: '\n\n'
            },
            jsDist: {
                src: ['src/js/colorpicker.js'],
                dest: 'dist/js/bootstrap-colorpicker.js'
            }
        },
        bake: {
            options: {
                condense: true,
                indent: 4
            },
            dist: {
                files: {
                    'index.html': ['src/docs.html']
                }
            }
        },
        prettify: {
            options: {
                condense: true,
                indent: 4
            },
            dist: {
                files: {
                    'index.html': ['index.html']
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
                tasks: ['jshint', 'jsbeautifier', 'uglify', 'concat:jsDist']
            },
            html: {
                files: [
                    'src/*.html'
                ],
                tasks: ['bake', 'prettify']
            }
        },
        clean: {
            dist: [
                'index.html',
                'dist/css',
                'dist/js'
            ]
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'recess',
        'uglify',
        'concat',
        'bake',
        'jsbeautifier',
        'prettify'
    ]);
    grunt.registerTask('dev', [
        'watch'
    ]);

};