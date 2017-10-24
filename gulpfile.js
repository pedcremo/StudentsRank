var fs = require('fs');
var browserify = require('browserify');
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var $ = require('gulp-load-plugins')({ lazy: true });
var jsdoc = require('gulp-jsdoc3');
//var jshint = require('gulp-jshint');

if (!fs.existsSync('dist')){
  fs.mkdirSync('dist');
}

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  //log('Analyzing source with JSHint and JSCS');
  return gulp
    .src('./src/*')
    //.pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs())
    .pipe($.jscs.reporter());
});

/**
 * $ gulp
 * description: Generate automatically all development documentation using jsdoc
 */

gulp.task('doc', function (cb) {
  var config = require('./jsdoc.json');
  gulp.src(['README.md','./src/**/*.js'], {read: false})
    .pipe(jsdoc(config, cb));
});

///babelify, es6 to es5
gulp.task('browserify', function() {
  browserify('./src/main.js')
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(fs.createWriteStream('dist/main.js'));
});

///http server live reload (html changes)
gulp.task('webserver', function() {
  gulp.src('./')
  .pipe(webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }));
});

// watch any change
gulp.task('watch', ['browserify'], function () {
  gulp.watch('./src/**/*.js', ['browserify']);
});
gulp.task('default', ['browserify', 'webserver', 'watch']);
