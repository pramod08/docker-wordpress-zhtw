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
