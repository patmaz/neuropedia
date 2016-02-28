var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');

gulp.task('styles', function () {
    return gulp.src('public-work/style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(gulp.dest('public/style'))
});

gulp.task('js', function(){
    return gulp.src('public-work/js/*.js')
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});

gulp.task('default', ['styles'], function () {
    gulp.watch('public-work/style/**/*', ['styles']);
    gulp.watch('public-work/js/*.js', ['js']);
});