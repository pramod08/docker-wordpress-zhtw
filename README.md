base on [elsonrodriguez/docker-wordpress](https://github.com/elsonrodriguez/docker-wordpress)

only support the zh_TW language.

```
// Dockerfile basic version(zh_TW/grunt/user/sshd)
$ grunt
// json-api plugin enable version
$ grunt wp-jsonapi
// build the basic image version
// img name =  test/wp39
$ grunt dk-build-basic:"test/wp39"
// run docker image
$ grunt dk-run:"test/wp39"
// stop, build and run (basic version)
$ grunt dk-brun-basic:"test/wp39"
```

grunt help

```
$ grunt --help
Grunt: The JavaScript Task Runner (v0.4.4)
Available tasks
          clean  Clean files and folders. *
           exec  Execute shell commands. *
          watch  Run predefined tasks whenever watched files change.
            zip  Zip files together *
          unzip  Unzip files into a folder *
         concat  Concatenate files. *
 dk-build-basic  build docker basic image
   dk-build-ssl  build docker ssl image
   dk-run-basic  run docker basic image
     dk-run-ssl  run docker ssl image
  dk-brun-basic  stop, build and run basic docker image
    dk-brun-ssl  stop, build and run ssl docker image
    dk-stop-all  Stop all docker container
        dk-psip  docker ps and ip
       dk-clean  Alias for "exec:dk_rm", "exec:dk_rmi" tasks.
         df-ssl  build Dockerfile for ssl.
     df-jsonapi  build Dockerfile for wordpress json-api.
       df-basic  build basic Dockerfile
        default  Alias for "exec:grunt_help" task.



```