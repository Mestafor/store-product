'use strict';

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const glob = require('gulp-sass-glob-import');
// const clean = require('gulp-clean');
// const purgecss = require('gulp-purgecss');

const plumber = require('gulp-plumber');
const rigger = require('gulp-rigger');

// const csscss = require('gulp-csscss');
const postcssPresetEnv = require('postcss-preset-env');

const cssnano = require('gulp-cssnano');

const watchPath = '../../src/client/**/*.scss';
const scssPath = '../../src/client/scss/**/*.scss';
const cssPath = '../../dist/assets/css';

// HTML path
const workingDir = path.resolve(__dirname, '../../src/client/');
const PATH_TO_FILES = {
    build: {
        html: path.join(workingDir, '/../../dist'),
    },
    src: {
        html: path.join(workingDir, '/html/src/pages/**/*.html'),
    },
    watch: {
        html: path.join(workingDir, '/html/src/**/*.html'),
    },
};

gulp.task('html', function (resolve) {
    return gulp.src(PATH_TO_FILES.src.html)
        //pipe(clean())
        //.pipe(plumber()) 
        .pipe(rigger()) 
        .pipe(gulp.dest(PATH_TO_FILES.build.html)) 
        .on("error", function (err) {
            console.log(err);
            resolve();
        })
        .on("end", function () {
            // ...stuff
            resolve();
        });
});

gulp.task('html:watch', function () {
    return gulp.watch(PATH_TO_FILES.watch.html, ['html']);
});

gulp.task('sass', function (resolve) {
    return gulp.src(scssPath)
        // .pipe(sourcemaps.init())
        .pipe(glob())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([ /* autoprefixer(), */ postcssPresetEnv({
            stage: 0,
            autoprefixer: {
                grid: true,
            },
        })]))
        .pipe(cssnano({
            discardComments: {
                removeAll: true,
            },
            autoprefixer: false,
            discardDuplicates: true,
            discardOverridden: true,
            styleCache: false,
            discardEmpty: true,
            discardUnused: true,
            filterPlugins: true,
            mergeRules: true,
            reduceIdents: false,
            reduceTransforms: false,
            zindex: false,
        }))
        // .pipe(csscss())
        // .pipe(sourcemaps.write())
        //.pipe(lec({ verbose: true, eolc: 'LF', encoding: 'utf8' }))
        .pipe(gulp.dest(cssPath))

        .on("end", function () {
            // ...stuff
            resolve();
        })
    //.pipe(livereload());
});

gulp.task('sass-watcher', function (resolve) {
    return gulp.src(scssPath)
        .pipe(sourcemaps.init())
        .pipe(glob())
        .pipe(sass.sync({
            // outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        // .pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest(cssPath))

        .on("end", function () {
            // ...stuff
            resolve();
        });
    // .pipe(livereload());
});

gulp.task('sass:watch', function () {
    // livereload.listen();
    return gulp.watch(watchPath, gulp.series('sass-watcher'));
});
