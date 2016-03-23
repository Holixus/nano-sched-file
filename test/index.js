"use strict";

var assert = require('core-assert'),
    json = require('nano-json'),
    timer = require('nano-timer'),
    Promise = require('nano-promise'),
    util = require('util'),
    fs = require('nano-fs');


/* ------------------------------------------------------------------------ */
function Logger(stage, job) {

	var context = job.sched.name + ':' + job.name + '#' + stage;

	this.stage = stage;
	this.job = job;
	this.acc = [];
	this.dumps = [];

	this.log = function (code, format, a, b, etc) {
		acc.push(util.format('  %s: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.trace = function () {
		this.log.apply(this, Array.prototype.concat.apply(['trace'], arguments));
	};

	this.warn = function (code, format, a, b, etc) {
		acc.push(util.format('W.%s: warning: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.error = function (format, a, b, etc) {
		acc.push(util.format('E.%s: error: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.fail = function (format, a, b, etc) {
		acc.push(util.format('F.%s: FAIL: %s', context, util.format.apply(util.format, arguments)));
	};

	this.writeListing = function (name, data) {
		this.dumps.push({
			name: name, 
			data: data
		});

		return Promise.resolve();
	};
}

Logger.prototype = {
};



var file = require('../index.js'),
	opts = {
			dist_folder: __dirname+'/dist',
			sources_folder: __dirname+'/src'
		},
    job = {
		name: 'test',
		sched: {
			name: 'test',
			opts: opts
		}
	};

suite('file.load', function () {
	test('1 - load', function (done) {

		var log = new Logger('load', job),
		    data = {
					name: '1.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.load)
			.then(function () {
				return fs.readFile(job.sched.opts.sources_folder+'/'+data.name, 'utf8').then(function (text) {
					assert.strictEqual(data.content, text);
					done();
				});
			}).catch(done);
	});

	test('2 - load of apsent file', function (done) {

		var log = new Logger('load', job),
		    data = {
					name: '2.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.load)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				assert.strictEqual(err.code, 'ENOENT');
				done();
			}).catch(done);
	});

});

suite('file.load-bin', function () {
	test('1 - load', function (done) {

		var log = new Logger('load-bin', job),
		    data = {
					name: '1.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file['load-bin'])
			.then(function () {
				return fs.readFile(job.sched.opts.sources_folder+'/'+data.name).then(function (bin) {
					assert.deepStrictEqual(data.content, bin);
					done();
				});
			}).catch(done);
	});

	test('2 - load of apsent file', function (done) {

		var log = new Logger('load', job),
		    data = {
					name: '2.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.load)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				assert.strictEqual(err.code, 'ENOENT');
				done();
			}).catch(done);
	});

});

suite('file.copy', function () {
	test('1 - copy', function (done) {

		var log = new Logger('copy', job),
		    data = {
					name: '1.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.copy)
			.then(function () {
				return Promise.all([
						fs.readFile(opts.sources_folder+'/'+data.name, 'utf8'),
						fs.readFile(opts.dist_folder+'/'+data.name, 'utf8')]);
			})
			.spread(function (src, dst) {
				assert.strictEqual(src, dst);
				done();
			}).catch(done);
	});

	test('2 - copy of apsent file', function (done) {

		var log = new Logger('copy', job),
		    data = {
					name: '2.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.copy)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				assert.strictEqual(err.code, 'ENOENT');
				done();
			}).catch(done);
	});

});

suite('file.save', function () {
	test('1.1 - save', function (done) {
		var log = new Logger('save', job),
		    data = {
					name: 'saved.txt',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file.save)
			.then(function () {
				return Promise.all([
						fs.readFile(opts.dist_folder+'/'+data.name, 'utf8')]);
			})
			.spread(function (dst) {
				assert.strictEqual(data.content, dst);
				done();
			}).catch(done);
	});

	test('1.2 - save to another name', function (done) {
		var log = new Logger('save', job),
		    data = {
					name: 'saved.txt',
					dest: 'another.txt',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file.save)
			.then(function () {
				return Promise.all([
						fs.readFile(opts.dist_folder+'/'+data.dest, 'utf8')]);
			})
			.spread(function (dst) {
				assert.strictEqual(data.content, dst);
				done();
			}).catch(done);
	});

	test('1.3 - save binary data', function (done) {
		var log = new Logger('save', job),
		    data = {
					name: 'saved.txt',
					opts: opts,
					encoding: null,
					content: new Buffer('1234567890')
				};

		Promise.resolve(log, data)
			.then(file.save)
			.then(function () {
				return Promise.all([
						fs.readFile(opts.dist_folder+'/'+data.name, null)]);
			})
			.spread(function (dst) {
				assert.deepStrictEqual(data.content, dst);
				done();
			}).catch(done);
	});

	test('2.1 - save to folder (not to file)', function (done) {
		var log = new Logger('save', job),
		    data = {
					name: 'folder',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file.save)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				assert.strictEqual(err.code, 'EISDIR');
				done();
			}).catch(done);
	});

	test('2.2 - save binary to text file', function (done) {
		var log = new Logger('save', job),
		    data = {
					name: 'folder',
					opts: opts,
					encoding: 'utf8',
					content: new Buffer('ogogo!')
				};

		Promise.resolve(log, data)
			.then(file.save)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				done();
			}).catch(done);
	});
});

suite('file.dont-overwrite', function () {
	test('1 - save', function (done) {
		var log = new Logger('dont-overwrite', job),
		    data = {
					name: '444.txt',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file['dont-overwrite'])
			.then(function () {
				done()
			}).catch(done);
	});

	test('2 - save to folder (not to file)', function (done) {
		var log = new Logger('dont-overwrite', job),
		    data = {
					name: 'folder',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file['dont-overwrite'])
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				//assert.strictEqual(err.code, 'EISDIR');
				assert.strictEqual(err, Promise.CANCEL_REASON);
				done();
			}).catch(done);
	});

	test('3 - save to exists file', function (done) {
		var log = new Logger('dont-overwrite', job),
		    data = {
					name: '1.txt',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file['dont-overwrite'])
			.then(function () {
				throw Error('not cancelled');
			}, function (err) {
				assert.strictEqual(err, Promise.CANCEL_REASON);
				done();
			}).catch(done);
	});
});

suite('file.load-dist', function () {
	test('1 - load', function (done) {

		var log = new Logger('load-dist', job),
		    data = {
					name: '1.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file['load-dist'])
			.then(function () {
				return fs.readFile(job.sched.opts.sources_folder+'/'+data.name, 'utf8').then(function (text) {
					assert.strictEqual(data.content, text);
					done();
				});
			}).catch(done);
	});

	test('2 - load of apsent file', function (done) {

		var log = new Logger('load', job),
		    data = {
					name: '2.txt',
					opts: opts
				};

		Promise.resolve(log, data)
			.then(file.load)
			.then(function () {
				throw Error('not failed');
			}, function (err) {
				assert.strictEqual(err.code, 'ENOENT');
				done();
			}).catch(done);
	});

});

suite('file.rename', function () {
	test('1.1 - rename', function (done) {
		var log = new Logger('rename', job),
		    data = {
					name: 'saved.txt',
					opts: opts,
					content: 'ogogo!',
					dest: '\\1not-\\2\\3'
				};

		Promise.resolve(log, data)
			.then(file.rename)
			.then(function () {
				assert.strictEqual(data.dest, 'not-saved.txt');
				done();
			}).catch(done);
	});

	test('1.2 - rename', function (done) {
		var log = new Logger('rename', job),
		    data = {
					name: 'folder/saved.txt',
					opts: opts,
					content: 'ogogo!',
					dest: '\\1\\2.bak'
				};

		Promise.resolve(log, data)
			.then(file.rename)
			.then(function () {
				assert.strictEqual(data.dest, 'folder/saved.bak');
				done();
			}).catch(done);
	});

	test('1.3 - rename', function (done) {
		var log = new Logger('rename', job),
		    data = {
					name: 'folder/saved.txt',
					opts: opts,
					content: 'ogogo!',
					dest: 'oo/\\2.bak'
				};

		Promise.resolve(log, data)
			.then(file.rename)
			.then(function () {
				assert.strictEqual(data.dest, 'oo/saved.bak');
				done();
			}).catch(done);
	});

	test('1.4 - rename', function (done) {
		var log = new Logger('rename', job),
		    data = {
					name: 'folder/saved.txt',
					opts: opts,
					content: 'ogogo!',
					dest: 'file.txt'
				};

		Promise.resolve(log, data)
			.then(file.rename)
			.then(function () {
				assert.strictEqual(data.dest, 'file.txt');
				done();
			}).catch(done);
	});

	test('1.5 - rename', function (done) {
		var log = new Logger('rename', job),
		    data = {
					name: 'folder/saved.txt',
					opts: opts,
					content: 'ogogo!'
				};

		Promise.resolve(log, data)
			.then(file.rename)
			.then(function () {
				assert.strictEqual(data.dest, 'folder/saved.txt');
				done();
			}).catch(done);
	});
});
