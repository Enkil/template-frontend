'use strict';

/************/
/* Settings */
/************/

/* Gulp plugins */
var gulp = require('gulp'), // Task runner
    watch = require('gulp-watch'), // Watch, that actually is an endless stream
    rename = require("gulp-rename"), // Rename files
    del = require('del'), // Delete something
    //rigger = require('rigger'), // // Include content of one file to another
    rigger = require('gulp-rigger'), // // Include content of one file to another
    size = require('gulp-size'), // Display the size of something
    path = require('path'),
    concat = require('gulp-concat'), // Concatenates files
    streamqueue = require('streamqueue'), // Pipe queued streams progressively, keeping datas order.
    sourcemaps = require('gulp-sourcemaps'), // Write source maps
    less = require('gulp-less'), // Compile Less to CSS
    lessReporter = require('gulp-less-reporter'), // Error reporter for gulp-less
    autoprefixer = require('gulp-autoprefixer'), // Prefix CSS
    csscomb = require('gulp-csscomb'), // Coding style formatter for CSS
    minifycss = require('gulp-minify-css'), // Minify CSS
    uglify = require('gulp-uglify'), // Minify JS
    jshint = require('gulp-jshint'), // JS code linter
    stylish = require('jshint-stylish'), // Reporter for JSHint
    imagemin = require('gulp-imagemin'), // Optimize images
    pngquant = require('imagemin-pngquant'), // PNG plugin for ImageMin
    spritesmith = require('gulp.spritesmith'), // Convert a set of images into a spritesheet and CSS variables
    svg2png = require('gulp-svg2png'), // Convert SVGs to PNGs
    svgmin = require('gulp-svgmin'), // Minify SVG with SVGO
    svgspritesheet = require('gulp-svg-spritesheet'), // Convert a set of SVGs into a spritesheet and CSS variables
    browserSync = require("browser-sync"), // Synchronised browser testing
    reload = browserSync.reload,
    ghPages = require('gulp-gh-pages'), // Publish contents to Github pages
    runSequence = require('run-sequence').use(gulp); // Run a series of dependent gulp tasks in order

/* Path settings */
var projectPath = {
    build: { // Set build paths
        html: 'build/',
        js: 'build/js/',
        jsMainFile: 'main.js',
        css: 'build/css/',
        img: 'build/img/images/',
        svg: 'build/img/svg/',
        pngSprite: 'build/img/sprites/png/',
        pngSpriteCSS: 'src/styles/common/',
        svgSprite: 'build/img/sprites/svg/svg-sprite.svg',
        svgSpriteNoSvg: 'build/img/sprites/svg/svg-sprite.png',
        svgSpriteCSS: 'src/styles/common/_svg-sprite.less',
        fonts: 'build/css/fonts/'
    },
    src: { // Set source paths
        html: 'src/**/*.html',
        jsCustom: 'src/js/custom.js',
        jsVendor: 'src/js/vendor.js',
        style: 'src/styles/style.less',
        img: 'src/img/images/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        pngSprite: 'src/img/sprites/png/**/*.png',
        pngRetinaSprite: 'src/img/sprites/png/**/*-2x.png',
        svgSprite: 'src/img/sprites/svg/**/*.svg',
        svgSpriteTpl: 'src/styles/common/_svg-sprite-less.tpl',
        fonts: 'src/styles/fonts/**/*.*'
    },
    watch: { // Set watch paths
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.less',
        img: 'src/img/images/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        pngSprite: 'src/img/sprites/png/**/*.png',
        svgSprite: 'src/img/sprites/svg/**/*.svg',
        fonts: 'src/styles/fonts/**/*.*'
    },
    clean: ['build/**/*', '!build/.gitignore'], // Set paths and exludes for cleaning build dir
    ghPages: 'build/**/*' // Set dir that will be uploaded to GitHub Pages
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
    return gulp.src(projectPath.src.html)
        .pipe(rigger())
        .pipe(size({
            title: 'HTML'
        }))
        .pipe(gulp.dest(projectPath.build.html))
        .pipe(reload({stream: true}));
});

/* JavaScript */
gulp.task('js', function () {
    return streamqueue(
        { objectMode: true },
        gulp.src(projectPath.src.jsVendor).pipe(rigger()).pipe(size({title: 'Vendor JavaScript'})),
        gulp.src(projectPath.src.jsCustom).pipe(rigger()).pipe(jshint()).pipe(jshint.reporter(stylish)).pipe(size({title: 'Custom JavaScript'}))
    )
        .pipe(concat(projectPath.build.jsMainFile))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(projectPath.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size({
            title: 'Total JavaScript'
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
    return gulp.src(projectPath.src.img)
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
    return gulp.src(projectPath.src.svg)
        .pipe(svgmin())
        .pipe(size({
            title: 'SVG'
        }))
        .pipe(gulp.dest(projectPath.build.svg))
        .pipe(reload({stream: true}));
});

/* PNG Sprite */
gulp.task('png-sprite', function () {
    // Generate spritesheet
    var spriteData = gulp.src(projectPath.src.pngSprite).pipe(spritesmith({
        imgName: 'png-sprite.png',
        imgPath: '../img/sprites/png/png-sprite.png',
        retinaSrcFilter: projectPath.src.pngRetinaSprite,
        retinaImgName: 'png-sprite-2x.png',
        retinaImgPath: '../img/sprites/png/png-sprite-2x.png',
        padding: 0,
        cssName: '_png-sprite.less',
        cssVarMap: function (sprite) {
            sprite.name = 'sprite__' + sprite.name;
        }
    }));

    // Pipe image stream through image optimizer and onto disk
    spriteData.img
        .pipe(imagemin())
        .pipe(gulp.dest(projectPath.build.pngSprite));

    // Pipe CSS stream onto disk
    spriteData.css
        .pipe(gulp.dest(projectPath.build.pngSpriteCSS))
        .pipe(reload({stream:true}));
});

/* SVG sprite */
gulp.task('svg-sprite', function () {
    gulp.src(projectPath.src.svgSprite)
        .pipe(svgspritesheet({
            cssPathNoSvg: '../img/sprites/svg/svg-sprite.png',
            cssPathSvg: '../img/sprites/svg/svg-sprite.svg',
            padding: 0,
            pixelBase: 16,
            positioning: 'packed',
            templateSrc: projectPath.src.svgSpriteTpl,
            templateDest: projectPath.build.svgSpriteCSS,
            units: 'px'
        }))
        .pipe(svgmin())
        .pipe(gulp.dest(projectPath.build.svgSprite))
        .pipe(svg2png())
        .pipe(gulp.dest(projectPath.build.svgSpriteNoSvg));
});

/* Fonts */
gulp.task('fonts', function() {
    return gulp.src(projectPath.src.fonts)
        .pipe(size({
            title: 'Fonts'
        }))
        .pipe(gulp.dest(projectPath.build.fonts))
        .pipe(reload({stream: true}));
});

/* Clean build directory */
gulp.task('clean', function (cb) {
    del(projectPath.clean, cb);
});

/* Build */
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'html',
        'js',
        'less',
        'images',
        'png-sprite',
        'svg-sprite',
        'svg',
        'fonts',
        'gh-pages',
        callback)
});

/* Github Pages */
gulp.task('gh-pages', function() {
    return gulp.src(projectPath.ghPages)
        .pipe(ghPages());
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
    watch([projectPath.watch.pngSprite], function(event, cb) {
        gulp.start('png-sprite');
    });
    watch([projectPath.watch.svgSprite], function(event, cb) {
        gulp.start('svg-sprite');
    });
    watch([projectPath.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});

/* Default */
gulp.task('default', ['watch'], function() {
});