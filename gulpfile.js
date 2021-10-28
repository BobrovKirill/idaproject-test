let projectFolder = 'build';
let sourceFolder = 'app';

let path = {
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/styles/',
    js: projectFolder + '/js/',
    img: projectFolder + '/images/',
    fonts: projectFolder + '/fonts/',
    json: projectFolder + '/json/',
  },
  src: {
    html: sourceFolder + '/*.html',
    scss: sourceFolder + '/scss/app.scss',
    js: sourceFolder + '/js/app.js',
    img: sourceFolder + '/images/**/*.{jpg,png,svg,gif,ico}',
    fonts: sourceFolder + '/fonts/*.ttf',
    json: sourceFolder + '/json/*.json',
  },
  watch: {
    html: sourceFolder + '/*.html',
    scss: sourceFolder + '/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/images/**/*.{jpg,png,svg,gif,ico}',
    json: sourceFolder + '/json/*.json',
  },
  clean: './' + projectFolder + '/',
};

const { src, dest } = require('gulp');
const gulp = require('gulp');
const gulpSass = require('gulp-sass')(require('node-sass'));
const fileInclude = require('gulp-file-include');
const gulpBable = require('gulp-babel');
const browsersync = require('browser-sync').create();
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

function img() {
  return src(path.src.img)
		.pipe(imagemin())
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

function toHtml() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function scss2css() {
  return src(path.src.scss)
    .pipe(gulpSass())
    .pipe(autoprefixer())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function json() {
  return src(path.src.json).pipe(dest(path.build.json));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: false,
  });

  gulp.watch([path.watch.html], toHtml);
  gulp.watch([path.watch.scss], scss2css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.json], json);
  gulp.watch([path.build.html]).on('change', browsersync.reload);
  gulp.watch([path.build.css]).on('change', browsersync.reload);
  gulp.watch([path.build.js]).on('change', browsersync.reload);
}

let build = gulp.series(
  clean,
  gulp.parallel(toHtml, scss2css, js, json, fonts, img)
);
let watch = gulp.parallel(build, watchFiles);


exports.js = js;
exports.json = json;
exports.img = img;
exports.toHtml = toHtml;
exports.scss2css = scss2css;
exports.build = build;
exports.watch = watch;
exports.default = watch;
