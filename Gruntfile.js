'use strict';

module.exports = function(grunt) {
	//setup grunt configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		karma: {
			unit: {
				configFile: 'test/karma.config.js',
				singleRun: true
			}
		}
	});

	//load grunt plugins
	grunt.loadNpmTasks('grunt-karma');

	//define grunt tasks
	grunt.registerTask('test', [
		'karma'
	]);
	grunt.registerTask('default', []);
};