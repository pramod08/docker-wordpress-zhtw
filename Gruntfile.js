module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		// Before generating any new files, remove any previously-created files.
		clean : {
			main : ['Dockerfile']
		},

		exec : {
			echo_test : {
				cmd : function (name) {
					return 'echo ' + name + ' ...';
				}
			},
			// dk = docker / ubuntu 14.04 version
			// http://jimhoskins.com/2013/07/27/remove-untagged-docker-images.html
			dk_rm : {
				cmd : 'sudo docker.io rm $(sudo docker.io ps -a -q)',
				exitCodes : [0, 1, 2]
			},
			dk_rmi : {
				cmd : 'sudo docker.io rmi $(sudo docker.io images | grep "^<none>" | awk "{print $3}")',
				exitCodes : [0, 1, 2]
			},
			dk_stop_all : {
				cmd : 'sudo docker.io stop $(sudo docker.io ps -q)',
				exitCodes : [0, 1, 2]
			},
			dk_build : {
				cmd : function (img) {
					return 'sudo docker.io build -t="' + img + '" .';
				},
				exitCodes : [0]
			},
			dk_run : {
				cmd : function (img) {
					return 'sudo docker.io run -d -p 80:80 -p 8022:22 ' + img;
				},
				exitCodes : [0]
			}
		},

		concat : {
			basic : {
				src : [
					'dockerfiles/Dockerfile.header',
					'dockerfiles/Dockerfile.config',
					'dockerfiles/Dockerfile.user',
					'dockerfiles/Dockerfile.grunt',
					'dockerfiles/Dockerfile.footer',
				],
				dest : 'Dockerfile',
			},
			jsonapi : {
				src : [
					'dockerfiles/Dockerfile.header',
					'dockerfiles/Dockerfile.config',
					'dockerfiles/Dockerfile.user',
					'dockerfiles/Dockerfile.grunt',
					'dockerfiles/Dockerfile.wp-json-api',
					'dockerfiles/Dockerfile.footer',
				],
				dest : 'dist/with_extras.js',
			},
		},

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('dk-build-basic', 'build docker image', function (img) {
		grunt.task.run('default', 'exec:dk_build:' + img);
	});

	grunt.registerTask('dk-run', 'run docker image', function (img) {
		grunt.task.run('exec:dk_run:' + img);
	});

	grunt.registerTask('dk-brun-basic', 'stop, build and run basic docker image', function (img) {
		grunt.task.run('dk-stop-all', 'dk-build-basic:' + img, 'dk-run:' + img);
	});

	grunt.registerTask('dk-stop-all', ['exec:dk_stop_all']);

	grunt.registerTask('dk-clean', ['exec:dk_rm', 'exec:dk_rmi']);
	// Default task(s).
	grunt.registerTask('wp-jsonapi', ['clean', 'concat:jsonapi']);
	// Default task(s).
	grunt.registerTask('default', ['clean', 'concat:basic']);

};
