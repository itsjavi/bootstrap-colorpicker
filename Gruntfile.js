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
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'Gruntfile.js',
                'src/js/commits.js',
                'src/js/docs.js',
                'dist/js/*.js'
            ]
        },
        jsbeautifier: {
            htmlFiles: ['index.html'],
            srcFiles: ['src/js/*.js'],
            distFiles: ['dist/js/bootstrap-colorpicker.js']
        },
        combine: {
            dist: {
                input: 'src/js/colorpicker.js',
                output: 'dist/js/bootstrap-colorpicker.js',
                tokens: [{
                        token: "'{{color}}';",
                        file: 'src/js/colorpicker-color.js',
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
            },
            html: {
                files: [
                    'src/*.html'
                ],
                tasks: ['bake', 'jsbeautifier:htmlFiles']
            }
        },
        clean: {
            dist: [
                'index.html',
                'dist/css',
                'dist/js/*.js'
            ]
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-combine');

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'recess',
        'jsbeautifier:srcFiles',
        'combine',
        'jsbeautifier:distFiles',
        'uglify',
        'bake',
        'jsbeautifier:htmlFiles'
    ]);
    grunt.registerTask('dev', [
        'watch'
    ]);

};