'use strict';

const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const clearnCss = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");

const files = {
  styleSrc: "app/src/scss/**/*.scss",
  styleDist: "app/dist/css/",
  htmlSrc: "./**/*.html",
  jsSrc : "app/src/js/**/*.js",
  jsDist: "app/dist/js/"

};


function browserSyncTask()
{

    return browserSync.init({
        open: false,
        injectChanges: true,
        server: {
            baseDir: './'
        }
    });

}

function styleTask() {
  return src(files.styleSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 3 versions"],
        cascade: false,
      })
    )
    .pipe(clearnCss({compatibility: 'ie8'}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(files.styleDist))
    .pipe(browserSync.stream());
}

function jsTask(){
    return src(files.jsSrc)
           .pipe(uglify())
           .pipe(rename( {suffix: '.min'} ))
           .pipe(dest( files.jsDist ))
           .pipe(browserSync.stream());;
}

function watchTask() {
  watch(files.htmlSrc).on('change', reload);
  watch([files.styleSrc, files.jsSrc], parallel(styleTask, jsTask), reload);
}

exports.default = parallel(styleTask, watchTask, browserSyncTask);
