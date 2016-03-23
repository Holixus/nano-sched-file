[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


# nano-sched-file
File operations nano-sched plugin

## data object

* options
  * sources_folder <String>
  * dist_folder <String>
* name <String>
* dest <String> (Optional)
* encoding <String>
* content


## file.load (log, data)

Load file from <options.sources_folder>/<data.name> to the data.content with <data.encoding>='utf8'.

## file.load-bin (log, data)

Load file from <options.sources_folder>/<data.name> to the data.content with <data.encoding>=null.

## file.dont-overwrite (log, data)

Will cancels job if destination file exists.

## file.rename (log, data)

Generate destination file name by <data.dest> template. The template can contains of shortcuts for
sources file name parts:
* \1 -- path to source name
* \2 -- name of file
* \3 -- extension of file

For example, for `data.name = 'blah/foo.bar'` and `data.dest = 'folder/\2\3'` will generated a new
`data.dest` value `'folder/foo.bar'`.


## file.save (log, data)

Save data.content to <options.dist_folder>/<data.dest || data.name> with encoding <data.encoding>.

## file.copy (log, data)

Copy file from <options.sources_folder>/<data.name> to <options.dist_folder>/<data.dest || data.name>.



[bithound-image]: https://www.bithound.io/github/Holixus/nano-sched-file/badges/score.svg
[bithound-url]: https://www.bithound.io/github/Holixus/nano-sched-file

[gitter-image]: https://badges.gitter.im/Holixus/nano-sched-file.svg
[gitter-url]: https://gitter.im/Holixus/nano-sched-file

[npm-image]: https://badge.fury.io/js/nano-sched-file.svg
[npm-url]: https://badge.fury.io/js/nano-sched-file

[github-tag]: http://img.shields.io/github/tag/Holixus/nano-sched-file.svg
[github-url]: https://github.com/Holixus/nano-sched-file/tags

[travis-image]: https://travis-ci.org/Holixus/nano-sched-file.svg?branch=master
[travis-url]: https://travis-ci.org/Holixus/nano-sched-file

[coveralls-image]: https://coveralls.io/repos/github/Holixus/nano-sched-file/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Holixus/nano-sched-file?branch=master

[david-image]: https://david-dm.org/Holixus/nano-sched-file.svg
[david-url]: https://david-dm.org/Holixus/nano-sched-file

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[downloads-image]: http://img.shields.io/npm/dt/nano-sched-file.svg
[downloads-url]: https://npmjs.org/package/nano-sched-file
