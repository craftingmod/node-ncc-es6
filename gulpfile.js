var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
require('babel-core/register');

// TODO: Add code coverage tool

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('mocha', function() {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }));
});

gulp.task('test', ['lint', 'mocha']);

gulp.task('watch', function() {
  return gulp.watch(['src/**/*.js', 'test/**/*.js'], ['test']);
});

gulp.task('babelsrc', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});
gulp.task('babelbin', function() {
  return gulp.src(['test/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('bin'));
});

gulp.task('default', ['babelsrc','babelbin']);
