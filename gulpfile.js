const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const less = require("gulp-less");
const del = require("del");
const obfuscate = require("gulp-obfuscate");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const pug = require("gulp-pug");
const ghPages = require('gulp-gh-pages');

function browsersync() {
  browserSync.init({
    server: { baseDir: "app/" },
    notify: false,
    online: true,
  });
}

function deploy() {
  return src('./dist/**/*')
    .pipe(ghPages());
}

function pug2html() {
  return src("app/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("app/js/app.js")
    .pipe(concat("app.min.js"))
    .pipe(obfuscate())
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/less/*.less")
    .pipe(less())
    .pipe(concat("app.min.css"))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("app/css/"))
    .pipe(browserSync.stream());
}

function cleandist() {
  return del("dist/**/*", { force: true });
}

function buildcopy() {
  return src(["app/css/**/*.min.css", "app/js/**/*.min.js", "app/*.html"], {
    base: "app",
  }).pipe(dest("dist"));
}

function startwatch() {
  watch("app/**/*.less", styles);
  watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
  watch("app/*.pug").on("change", browserSync.reload, pug2html);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.pug2html = pug2html;
exports.deploy = deploy;
exports.build = series(cleandist, pug2html, styles, scripts, buildcopy, deploy);

exports.default = parallel(pug2html, styles, scripts, browsersync, startwatch);
