
var path = require('path');

// copy images to build
gulp.task('images:copy', function() {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.src, gulp.config.srcRoots.imgs);
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.imgs);
    var source = srcDir + '/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)';
    return gulp.src(source).pipe(gulp.dest(dstDir));
});


// Optimize Images files in build dir
gulp.task('images:compress', async function() {
    const imagemin = (await import('gulp-imagemin')).default;
    var buildDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.imgs);
    var source = buildDir + '/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)';

    return gulp.src(source)
        .pipe(imagemin(gulp.config.images.min))
        .pipe(gulp.dest(buildDir));
});

// finds all small images in css in build dir, then replaces them into base64 and overwrites css
gulp.task('images:base64', function() {
    var cssDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles);

    gulp.config.images.base64.options.baseDir = path.join(gulp.config.projectDir, gulp.config.roots.build);

    return gulp.src(cssDir + '/**/*.css')
        .pipe(gulp.plugins.base64(gulp.config.images.base64.options))
        .pipe(gulp.dest(cssDir));
});


gulp.task('images', gulp.series('images:copy'));
gulp.task('images:min', gulp.series('images:copy', 'images:compress', 'images:base64'));
