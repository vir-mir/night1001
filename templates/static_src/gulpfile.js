var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    react = require('gulp-react'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('default', function () {
    gulp.start('styles', 'scripts', 'jsx', 'scripts_react');
});
require('es6-promise').polyfill();
gulp.task('styles', function () {
    return gulp.src('sass/main.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('../static/night1001/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('../static/night1001/css'))
        .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function () {
    return gulp
        .src('js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('../static/night1001/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../static/night1001/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('scripts_react', function () {
    return gulp
        .src('reactjs/**/*.js')
        .pipe(concat('reactjs.js'))
        .pipe(gulp.dest('../static/night1001/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../static/night1001/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('jsx', function () {
    return gulp
        .src('reactjs_src/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('reactjs'))
        .pipe(notify({message: 'Scripts task complete'}));
});


gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);
    gulp.watch('reactjs_src/**/*.jsx', ['jsx']);
    gulp.watch('reactjs/**/*.js', ['scripts_react']);

    livereload.listen();

    //gulp.watch(['static/**']).on('change', livereload.changed);
});