var fs = require("fs");
var browserify = require("browserify");
var gulp = require('gulp');
var webserver = require('gulp-webserver');

if (!fs.existsSync("dist")){
  fs.mkdirSync("dist");
}

///babelify, es6 to es5
gulp.task('browserify', function() {
browserify("./src/main.js")
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(fs.createWriteStream("dist/main.js"));
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