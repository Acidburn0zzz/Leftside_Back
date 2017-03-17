module.exports = function (grunt) {
    "use strict";

    let path = {
        src: "src/",
        dist: "dist/"
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            src: {
                options: {
                    update: true,
                    sourcemap: 'auto',
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: path.src + 'scss',
                    src: ['*.scss'],
                    dest: path.src + 'css/',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: path.src + 'scss',
                    src: ['*.scss'],
                    dest: path.dist + 'css/',
                    ext: '.css'
                }]
            }
        },
        concat: {
            dist: {
                options: {},
                src: [path.src + 'js/extension.js', path.src + 'js/init.js'],
                dest: 'tmp/extension-merged.js'
            }
        },
        babel: {
            dist: {
                options: {
                    presets: ['babel-preset-es2015']
                },
                files: {
                    ['tmp/extension-es5.js']: 'tmp/extension-merged.js',
                    ['tmp/jsu-es5.js']: path.src + 'js/lib/jsu.js',
                    ['tmp/settings-es5.js']: path.src + 'js/settings.js',
                    ['tmp/model-es5.js']: path.src + 'js/model.js'
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: '/*! (c) <%= pkg.author %> under <%= pkg.license %> */\n',
                    mangle: {
                        except: ['jsu']
                    }
                },
                files: {
                    ['tmp/js/extension.js']: 'tmp/extension-es5.js',
                    ['tmp/js/lib/jsu.js']: 'tmp/jsu-es5.js',
                    ['tmp/js/settings.js']: 'tmp/settings-es5.js',
                    ['tmp/js/model.js']: 'tmp/model-es5.js',
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: path.src + "html",
                    src: '*.html',
                    dest: path.dist + "html/"
                }]
            }
        },
        'string-replace': {
            dist: {
                options: {
                    replacements: [{
                        pattern: /("content_scripts":[\s\S]*?"js":\s?\[)([\s\S]*?)(\])/mig,
                        replacement: '$1"js/extension.js"$3'
                    }, {
                        pattern: /("version":[\s]*")[^"]*("[\s]*,)/ig,
                        replacement: '$1<%= pkg.version %>$2'
                    }, {
                        pattern: /"version_name":[^,]*,/ig,
                        replacement: ''
                    }, {
                        pattern: /(img\/icon\/)dev\//ig,
                        replacement: '$1'
                    }]
                },
                files: {
                    ['tmp/manifest-parsed.json']: path.src + 'manifest.json'
                }
            }
        },
        minjson: {
            dist: {
                files: {
                    [path.dist + 'manifest.json']: 'tmp/manifest-parsed.json'
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: path.src, src: ['_locales/**'], dest: path.dist},
                    {
                        expand: true,
                        cwd: path.src,
                        src: ['img/**', '!**/*.xcf', '!img/icon/dev/**', '!img/icon/icon.png', '!img/demo/**'],
                        dest: path.dist
                    },
                    {expand: true, cwd: "tmp/", src: ['js/**'], dest: path.dist},
                    {expand: true, src: ['license.txt'], dest: path.dist}
                ]
            }
        },
        clean: {
            sass: {
                src: ['.sass-cache/**']
            },
            distPre: {
                src: ['dist/*']
            },
            distPost: {
                src: ['tmp/**']
            }
        }
    });


    [
        'grunt-contrib-sass',
        'grunt-contrib-concat',
        'grunt-babel',
        'grunt-contrib-uglify',
        'grunt-contrib-htmlmin',
        'grunt-string-replace',
        'grunt-minjson',
        'grunt-contrib-copy',
        'grunt-contrib-clean'
    ].forEach((task) => {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('scss', ['sass:src', 'clean:sass']);
    grunt.registerTask('release', [
        'clean:distPre',
        'concat:dist',
        'babel:dist',
        'uglify:dist',
        'htmlmin:dist',
        'string-replace:dist',
        'minjson:dist',
        'sass:dist',
        'copy:dist',
        'clean:sass',
        'clean:distPost'
    ]);

};