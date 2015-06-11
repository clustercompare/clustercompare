'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		paths: {
			dist: 'dist',
			app: 'app',
			scripts: 'src',
			statics: 'public',
			styles: 'styles',
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
					"<%= paths.dist %>/assets/bundle.js": "<%= paths.scripts %>/main.js"
				}
			}
		},

		less: {
			styles: {
				files: {
					'<%= paths.dist %>/assets/style.css': '<%= paths.styles %>/app.less'
				}
			}
		},

		copy: {
			statics: {
				expand: true,
				cwd: '<%= paths.statics %>',
				src: ['**'],
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
			scripts: {
				files: ['<%= paths.scripts %>/**'],
				tasks: ['browserify']
			},
			styles: {
				files: ['<%= paths.styles %>/**'],
				tasks: ['less']
			},
			statics: {
				files: ['<%= paths.statics %>/**'],
				tasks: ['copy']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('install', ['bower', 'build']);
	grunt.registerTask('build', ['clean', 'browserify', 'less', 'copy', 'symlink']);
	grunt.registerTask('webserver', ['build', 'connect', 'watch']);
	grunt.registerTask('default', ['build']);
};
