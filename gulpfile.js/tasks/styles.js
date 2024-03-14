
var path = require('path');
const sass = require('gulp-sass')(require('sass'));


// finds all small images in css in build dir, then replaces them into base64 and overwrites css
gulp.task('styles:scss', function() {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.src, gulp.config.srcRoots.scss);
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles);

    var includes = gulp.config.styles.includes.slice();
    for (var i in includes) {
        includes[i] = gulp.config.projectDir + includes[i];
    }

    var processors = [];

    for (var processor in gulp.config.styles.processors) {
        if (gulp.config.styles.processors[processor]) {
            processors.push(require(processor)(gulp.config.styles.processors[processor]));
        }
    }

    return gulp.src('*.scss', {cwd: srcDir})
        .pipe(gulp.plugins.sassGlobImport())
        .pipe(gulp.plugins.sourcemaps.init())
        .pipe(sass({ // Use the initialized sass compiler here
            includePaths: includes,
            precision: 6
        }).on('error', sass.logError)) // Note: 'onError' is not a sass option. Use .on('error', sass.logError) instead.
        .pipe(gulp.plugins.postcss(processors))
        .pipe(gulp.plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(dstDir));
});



//
// Inject all style files
//

gulp.task('styles:inject', function() {
    var layoutsDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.layouts);
    var styles = path.join(gulp.config.projectsDir, gulp.config.projectDirName, gulp.config.roots.build, gulp.config.srcRoots.styles) + '/*.css';
    var ignorePath = path.join(gulp.config.projectsDir, gulp.config.projectDirName, gulp.config.roots.build);
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles);

    if (process.env.GULP_PROJECTS_DIR) {
        styles = path.join(gulp.config.projectDir,  gulp.config.roots.build, gulp.config.srcRoots.styles) + '/*.css';
        ignorePath = path.join(gulp.config.projectDir, gulp.config.roots.build);
    }

    var sources = gulp.src(styles, {read: false})
        .pipe(gulp.dest(dstDir, {cwd: ignorePath}));
        //.pipe(gulp.plugins.debug());

    // does nothing if there are no .jade files 
    return gulp.src(layoutsDir + '/**/*.jade')
        .pipe(gulp.plugins.inject(sources, {quiet: true}))
        //.pipe(gulp.plugins.debug())
        .pipe(gulp.dest(layoutsDir));
});

//
// CSS & SCSS Tests
//

gulp.task('styles:csslint', function() {
    var cssDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles);

    return gulp.src(cssDir + '/**/*.css')
        .pipe(gulp.plugins.csslint())
        .pipe(gulp.plugins.csslint.reporter());
});

gulp.task('styles:scsslint', function() {
    var scssDir = path.join(gulp.config.projectDir, gulp.config.roots.src, gulp.config.srcRoots.scss);

    return gulp.src(scssDir + '/**/*.scss')
        .pipe(gulp.plugins.sassLint())
        .pipe(gulp.plugins.sassLint.format());
        //.pipe(gulp.plugins.sassLint.failOnError());
});

gulp.task('styles', gulp.series('styles:scss', 'styles:inject', 'aigis'));
