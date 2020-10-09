'use strict';

const gulp = require('gulp');
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const server = require('browser-sync');


gulp.task('css', function () { // сборка и оптимизация css
  return gulp.src('source/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))

});

gulp.task('copy', function() { // копирование всех не отпимизированных файлов
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/*.ico',
    'source/css/normalize-min.css',
    'source/*.html',
    'source/js/*.js'
  ], {
    base: 'source' //путь
  })
  .pipe(gulp.dest('build'))
});

gulp.task('clean', function() { // очистка папки build
  return del('build')
});

gulp.task('server', function() {
  server.init({
    server: 'build/', //server смотрит файлы в папке build
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', gulp.series('css','refresh'));
  gulp.watch('source/*.html', gulp.series('copy','refresh'));
});

gulp.task('refresh', function(done) { //задача для перезагрузки страницы
  server.reload();
  done();
});

gulp.task('build', gulp.series( // последовательный запуск задач run build
  "clean",
  "copy",
  "css"
));

gulp.task('start', gulp.series('build', 'server'));
