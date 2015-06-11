'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		paths: {
			dist: 'dist',
			app: 'app',
			scripts: '<%= paths.app %>/scripts',
			bowerComponents: 'bower_components'
		},

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			options: {
				force: true
			},
			dist: [ '<%= paths.dist %>/**' ]
		},

		browserify: {
			options: {
				transform: [["babelify", {"stage": 0}]],
				browserifyOptions: {
					debug: true // generates source maps
				}
			},
			dist: {
				files: {
					"dist/bundle.js": "./app/src/main.js"
				}
			}
		},

		copy: {
			statics: {
				expand: true,
				cwd: '<%= paths.app %>',
				src: ['**', '!scripts'],
				dest: '<%= paths.dist %>'
			}
		},

		symlink: {
			data: {
				src: 'data',
				dest: '<%= paths.dist %>/data'
			}
		},

		connect: {
			options: {
				base: '<%= paths.dist %>',
				directory: '<%= paths.dist %>'
			},
			server: {
				options: {
					livereload: true
				}
			}
		},

		watch: {
			options: {
				livereload: true
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['build']
			},
			statics: {
				files: ['<%= paths.app %>/**', '!<%= paths.scripts %>/**'],
				tasks: ['copy']
			},
			scripts: {
				files: ['<%= paths.scripts %>/**'],
				tasks: ['browserify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('install', ['bower', 'build']);
	grunt.registerTask('build', ['clean', 'browserify', 'copy', 'symlink']);
	grunt.registerTask('webserver', ['build', 'connect', 'watch']);
	grunt.registerTask('default', ['build']);
};
