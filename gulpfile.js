const gulp = require('gulp');
const babel = require('gulp-babel');
var browserify = require('gulp-browserify');
 
gulp.task('transpile', () =>
    gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        /*.pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))*/
        .pipe(gulp.dest('bin'))
);

// Gulp watch syntax
gulp.task('watch', function(){
  gulp.watch('src/**/*.js', ['transpile']); 
  // Other watchers
})
