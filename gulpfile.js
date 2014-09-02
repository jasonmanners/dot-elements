var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('compress', function() {
  gulp.src('./js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});


gulp.task('test', function() {
  gulp.src('./poc/fluid.js')
    .pipe(concat('fluid.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});