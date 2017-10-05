const gulp = require('gulp');
const babel = require('gulp-babel');
var browserify = require('gulp-browserify');
 
gulp.task('default', () =>
    gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('bin'))
);
