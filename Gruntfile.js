'use strict';
module.exports = function(grunt) {
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
        jsbeautifier: {
            files: ['Gruntfile.js', 'src/js/*.js']
        },
        uglify: {
            distMin: {
                options: {
                    compress: true,
                    beautify: false
                },
                files: {
                    'dist/js/bootstrap-colorpicker.min.js': [
                        'src/js/colorpicker.js'
                    ],
                    'dist/js/tinycolor.min.js': [
                        'src/vendor/tinycolor.js'
                    ]
                }
            },
            dist: {
                options: {
                    compress: false,
                    beautify: true
                },
                files: {
                    'dist/js/bootstrap-colorpicker.js': [
                        'src/js/colorpicker.js'
                    ],
                    'dist/js/tinycolor.js': [
                        'src/vendor/tinycolor.js'
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
                tasks: ['uglify']
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'recess',
        'jsbeautifier',
        'uglify'
    ]);
    grunt.registerTask('dev', [
        'watch'
    ]);

};
