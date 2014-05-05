module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		// Before generating any new files, remove any previously-created files.
		clean : {
			main : ['build']
		},

		exec : {
			echo_test : 'echo "This is something"',
			dk_rm : {
				cmd : 'sudo docker.io rm $(sudo docker.io ps -a -q)',
				exitCodes : [1]
			},
			pgup : {
				// grunt ssh upload to /home/docker/tmp/your_plugin.zip
				cmd : function (pid) {
					var cmds = [
						'sudo rm -rf /tmp/' + pid,
						'unzip /home/docker/tmp/' + pid + '.zip -d /tmp',
						'sudo rm -rf /var/www/wp-content/plugins/' + pid,
						'sudo mv /tmp/' + pid + ' /var/www/wp-content/plugins/',
						'cd /var/www/wp-content/plugins/',
						'sudo chown -R www-data:www-data ' + pid,
						'ls -al ' + pid,
					].join('&& \ ');
					return cmds;
				},
				exitCodes : [0, 1]
			}
		},

		'phplint' : {
			options : {
				// sudo apt-get install php5-cli
				// which php

				phpCmd : "/usr/bin/php",
				phpArgs : {
					'-lf' : null
				},
				spawnLimit : 10
			},
			all : {
				src : ['*.php', '**/*.php', '!node_modules/**/*.php']
			}
		},

		po2mo : {
			files : {
				src : 'lang/*.po',
				expand : true,
			},
		},

		watch : {
			files : ['tmp/*.txt'],
			tasks : ['exec:echo_test']
		},

		'unzip' : {
			// Long syntax
			plugin : {
				src : 'tmp/plugin.zip',
				dest : 'tmp/unzip'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-po2mo');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks("grunt-phplint");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('plugin_update', ['unzip:plugin']);

	// Default task(s).
	grunt.registerTask('default', ['clean']);

};
