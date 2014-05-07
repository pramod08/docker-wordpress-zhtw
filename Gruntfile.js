module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		// Before generating any new files, remove any previously-created files.
		clean : {
			main : ['Dockerfile']
		},

		exec : {
			grunt_help : 'grunt --help',
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
			dk_ps : {
				cmd : 'sudo docker.io ps',
				exitCodes : [0, 1, 2]
			},
			dk_ip : {
				cmd : 'sudo docker.io ps -q | xargs -n 1 sudo docker.io inspect --format "{{ .Name }} {{ .NetworkSettings.IPAddress }}"',
				exitCodes : [0, 1, 2, 123]
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
			dk_run_ssl : {
				cmd : function (img) {
					//var name = 'basic-' + img.replace('/', '-');
					return 'sudo docker.io run -d -p 443:443 -p 80:80 -p 8022:22 ' + img;
				},
				exitCodes : [0]
			},
			dk_run : {
				cmd : function (img) {
					//var name = 'ssl-' + img.replace('/', '-');
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
			ssl : {
				src : [
					'dockerfiles/Dockerfile.header',
					'dockerfiles/Dockerfile.config',
					'dockerfiles/Dockerfile.user',
					'dockerfiles/Dockerfile.grunt',
					'dockerfiles/Dockerfile.ssl',
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

	grunt.registerTask('dk-build-basic', 'build docker basic image', function (img) {
		grunt.task.run('default', 'exec:dk_build:' + img);
	});

	grunt.registerTask('dk-build-ssl', 'build docker ssl image', function (img) {
		grunt.task.run('df-ssl', 'exec:dk_build:' + img);
	});

	grunt.registerTask('dk-run-basic', 'run docker basic image', function (img) {
		grunt.task.run('exec:dk_run:' + img, 'dk-psip');
	});

	grunt.registerTask('dk-run-ssl', 'run docker ssl image', function (img) {
		grunt.task.run('exec:dk_run_ssl:' + img, 'dk-psip');
	});

	grunt.registerTask('dk-brun-basic', 'stop, build and run basic docker image', function (img) {
		grunt.task.run('dk-stop-all', 'dk-build-basic:' + img, 'dk-run-basic:' + img);
	});

	grunt.registerTask('dk-brun-ssl', 'stop, build and run ssl docker image', function (img) {
		grunt.task.run('dk-stop-all', 'dk-build-ssl:' + img, 'dk-run-ssl:' + img);
	});

	grunt.registerTask('dk-stop-all', 'Stop all docker container', ['exec:dk_stop_all']);

	grunt.registerTask('dk-psip', 'docker ps and ip', ['exec:dk_ps', 'exec:dk_ip']);
	grunt.registerTask('dk-clean', ['exec:dk_rm', 'exec:dk_rmi']);
	grunt.registerTask('df-ssl', 'build Dockerfile for ssl.', ['clean', 'concat:ssl']);
	grunt.registerTask('df-jsonapi', 'build Dockerfile for wordpress json-api.', ['clean', 'concat:jsonapi']);
	grunt.registerTask('df-basic', 'build basic Dockerfile', ['clean', 'concat:basic']);
	// Default task(s).
	grunt.registerTask('default', ['exec:grunt_help']);

};
