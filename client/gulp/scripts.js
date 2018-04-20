'use strict';
//
// lints javascript files
//

var	path     = require('path'),
	buffer     = require('vinyl-buffer'),
	browserify = require('browserify'),
	source     = require('vinyl-source-stream'),
	webpack 	= require('webpack'),
	webpackStream = require('webpack-stream'),
	webpackConfig = require('../build/webpack.dev.conf.js');


module.exports = function(gulp) {
	var cfg = gulp.cfg;
	
	gulp.task('lint', function() {
		console.log('linting js files...');
		gulp.src(cfg.fileset.js)
			.pipe(gulp.plugins.jshint(cfg.jshint.rcfile))
			.pipe(gulp.plugins.jshint.reporter(cfg.jshint.reporter));
	});

	var appFile = '.' + path.sep + path.join(cfg.dir.src, cfg.dir.js, cfg.file.app);

	//
	// Uncomment to troubleshoot browserify-shim,
	// along with setting {debug:true} further below
	//
	// process.env.BROWSERIFYSHIM_DIAGNOSTICS=1;
	// 
	gulp.task('webpack', function() {
		console.log('bundling app...');
		// return browserify(appFile, {debug:false})
		// 	.bundle()
		// 	.pipe(source(cfg.file.app))
		// 	.pipe(gulp.dest(cfg.dir.dist));

		// return gulp.src(cfg.file.app)
		// 	.pipe(webpack(require('./webpack.config')))
		// 	.pipe(gulp.dest(cfg.dir.dist));

		return gulp.src(appFile)
			.pipe(webpackStream(webpackConfig), webpack)
			.pipe(gulp.dest(cfg.dir.dist));
	});

	gulp.task('minify', function() {
		console.log('minifying app...');
		return browserify(appFile, {debug:false})
			.bundle()
			.pipe(source(cfg.file.app))
			.pipe(buffer())
			.pipe(gulp.plugins.uglify())
			.pipe(gulp.dest(cfg.dir.dist));
	});
};
