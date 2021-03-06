'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		paths: {
			dist: 'dist',
			app: 'app',
			scripts: 'src',
			specs: 'test/specs',
			statics: 'public',
			styles: 'styles',
			bowerComponents: 'bower_components',
			scriptBundle: '<%= paths.dist %>/assets/bundle.js',
			workerBundle: '<%= paths.dist %>/assets/worker.js',
			polyfillBundle: '<%= paths.dist %>/assets/polyfill.js',
			testBundle: '<%= paths.dist %>/assets/test.js',
			styleBundle: '<%= paths.dist %>/assets/style.css'
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
				transform: [["babelify", {"stage": 0}], [ "browserify-handlebars"]],
				browserifyOptions: {
					debug: true // generates source maps
				}
			},
			main: {
				files: {
					"<%= paths.scriptBundle %>": "<%= paths.scripts %>/main.js"
				}
			},
			worker: {
				files: {
					"<%= paths.workerBundle %>":  "<%= paths.scripts %>/SimilarityProviderWorker.js"
				}
			},
			polyfill: {
				files: {
					"<%= paths.polyfillBundle %>": require.resolve('babel/polyfill')
				}
			},
			test: {
				files: {
					"<%= paths.testBundle %>": "<%= paths.specs %>/**.js"
				}
			}
		},

		less: {
			styles: {
				files: {
					'<%= paths.styleBundle %>': '<%= paths.styles %>/app.less'
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

		jasmine: {
			src: ['<%= paths.polyfillBundle %>', '<%= paths.scriptBundle %>'],
			options: {
				specs: '<%= paths.testBundle %>'
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
				tasks: ['browserify:main', 'browserify:worker']
			},
			styles: {
				files: ['<%= paths.styles %>/**'],
				tasks: ['less'],
				options: {
					livereload: false // would cause complete page reload
				}
			},
			stylesreload: {
				files: ['<%= paths.styleBundle %>'],
				options: {
					livereload: true
				}
			},
			statics: {
				files: ['<%= paths.statics %>/**'],
				tasks: ['copy']
			},
			testbuild: {
				files: ['<%= paths.specs %>/**'],
				tasks: ['browserify:test']
			},
			test: {
				files: ['<%= paths.testBundle %>', '<%= paths.scriptBundle %>'],
				tasks: ['jasmine']
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
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('install', ['bower', 'build']);
	grunt.registerTask('build', ['clean', 'browserify', 'less', 'copy', 'symlink']);
	grunt.registerTask('webserver', ['build', 'connect', 'watch']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('test', ['build', 'jasmine', 'watch']);
};
