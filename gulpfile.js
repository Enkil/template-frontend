'use strict';

/************/
/* Settings */
/************/

/* Gulp plugins */
var gulp = require('gulp'), // Task runner
    watch = require('gulp-watch'), // Watch, that actually is an endless stream
    rename = require("gulp-rename"), // Rename files
    del = require('del'), // Delete something
    rigger = require('gulp-rigger'), // // Include content of one file to another
    size = require('gulp-size'), // Display the size of something
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'), // Write source maps
    less = require('gulp-less'), // Compile Less to CSS
    lessReporter = require('gulp-less-reporter'), // Error reporter for gulp-less
    autoprefixer = require('gulp-autoprefixer'), // Prefix CSS
    csscomb = require('gulp-csscomb'), // Coding style formatter for CSS
    minifycss = require('gulp-minify-css'), // Minify CSS
    uglify = require('gulp-uglify'), // Minify JS
    imagemin = require('gulp-imagemin'), // Optimize images
    pngquant = require('imagemin-pngquant'), // PNG plugin for ImageMin
    spritesmith = require('gulp.spritesmith'), // Convert a set of images into a spritesheet and CSS variables
    svg2png = require('gulp-svg2png'), // Convert SVGs to PNGs
    svgspritesheet = require('gulp-svg-spritesheet'), // Convert a set of SVGs into a spritesheet and CSS variables
    browserSync = require("browser-sync"), // Synchronised browser testing
    reload = browserSync.reload,
    ghPages = require('gulp-gh-pages'); // Publish contents to Github pages

/* Path settings */
var projectPath = {
    build: { // Set build paths
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/images/',
        svg: 'build/img/svg/',
        pngSprite: 'build/img/sprites/png/',
        pngSpriteCSS: 'src/styles/common/_png-sprite.less',
        svgSprite: 'build/img/sprites/svg/',
        svgSpriteCSS: 'src/styles/common/_svg-sprite.less',
        fonts: 'build/css/fonts/'
    },
    src: { // Set source paths
        html: 'src/**/*.html',
        js: 'src/js/main.js',
        style: 'src/styles/style.less',
        img: 'src/img/images/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        pngSprite: 'src/img/sprites/png/**/*.png',
        svgSprite: 'src/img/sprites/svg/**/*.svg',
        fonts: 'src/styles/fonts/**/*.*'
    },
    watch: { // Set watch paths
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.less',
        img: 'src/img/images/**/*.{png,jpg,jpeg,gif}',
        svg: 'src/img/svg/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    clean: ['build/**/*', '!build/.gitignore']
};

/* BrowserSync local web server settings */
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    injectChanges: true,
    logPrefix: "App Front-End"
};

/*********/
/* Tasks */
/*********/

/* BrowserSync local web server*/
gulp.task('webserver', function () {
    browserSync(config);
});

/* HTML */
gulp.task('html', function () {
    gulp.src(projectPath.src.html)
        .pipe(rigger())
        .pipe(size({
            title: 'HTML'
        }))
        .pipe(gulp.dest(projectPath.build.html))
        .pipe(reload({stream: true}));
});

/* JavaScript */
gulp.task('js', function () {
    gulp.src(projectPath.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(projectPath.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size({
            title: 'JavaScript'
        }))
        .pipe(gulp.dest(projectPath.build.js))
        .pipe(reload({stream: true}));
});

/* Less */
gulp.task('less', function() {
    return gulp.src(projectPath.src.style)
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .on('error', lessReporter)
        .pipe(autoprefixer('> 2%'))
        .pipe(csscomb())
        .pipe(gulp.dest(projectPath.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(size({
            title: 'CSS'
        }))
        .pipe(gulp.dest(projectPath.build.css))
        .pipe(reload({stream: true}));
});

/* Images */
gulp.task('images', function () {
    gulp.src(projectPath.src.img)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(size({
            title: 'Images'
        }))
        .pipe(gulp.dest(projectPath.build.img))
        .pipe(reload({stream: true}));
});

/* SVG */
gulp.task('svg', function () {
    gulp.src(projectPath.src.svg)
        .pipe(imagemin({
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(size({
            title: 'SVG'
        }))
        .pipe(gulp.dest(projectPath.build.svg))
        .pipe(reload({stream: true}));
});

/* Fonts */
gulp.task('fonts', function() {
    gulp.src(projectPath.src.fonts)
        .pipe(size({
            title: 'Fonts'
        }))
        .pipe(gulp.dest(projectPath.build.fonts))
        .pipe(reload({stream: true}));
});

/* Build */
gulp.task('build', [
    'html',
    'js',
    'less',
    'images',
    'svg',
    'fonts',
]);

/* Clean build directory */
gulp.task('clean', function (cb) {
    del(projectPath.clean, cb);
});

/* Watching */
gulp.task('watch',['webserver'], function(){
    watch([projectPath.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([projectPath.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([projectPath.watch.style], function(event, cb) {
        gulp.start('less');
    });
    watch([projectPath.watch.img], function(event, cb) {
        gulp.start('images');
    });
    watch([projectPath.watch.svg], function(event, cb) {
        gulp.start('svg');
    });
    watch([projectPath.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});


/* Github Pages */
gulp.task('gh-pages', function() {
    return gulp.src(projectPath.build.html)
        .pipe(ghPages());
});