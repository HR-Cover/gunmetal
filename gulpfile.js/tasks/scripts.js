
var path = require('path');
var ngAnnotate = require('gulp-ng-annotate-patched');
var plumber = require('gulp-plumber');

var sources = [].concat(gulp.config.scripts.vendors, gulp.config.scripts.plugins, gulp.config.scripts.components, gulp.config.scripts.project);

function copyScripts(chunkName, subDir) {
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build);

    return gulp.src(gulp.config.scripts[chunkName], {root: gulp.config.projectDir})
        .pipe(gulp.dest(path.join(dstDir, subDir)))
        .pipe(gulp.plugins.filenames("scripts"))
        //.pipe(gulp.plugins.debug());
}


gulp.task('scripts:copy-vendors', function() {
    return copyScripts('vendors', gulp.config.srcRoots.scriptsVendors);
});

gulp.task('scripts:copy-plugins', function() {
    return copyScripts('plugins', gulp.config.srcRoots.scriptsPlugins);
});

gulp.task('scripts:copy-project', function() {
    return copyScripts('project', gulp.config.srcRoots.scripts);
});

gulp.task('scripts:copy-components', function() {
    return copyScripts('components', gulp.config.srcRoots.scriptsComponents);
});


// Copy from source and minify-concat scripts
gulp.task('scripts:min', function() {
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts);

    return gulp.src(sources, {root: gulp.config.projectDir})
        //.pipe(gulp.plugins.debug())
        // .pipe(plumber())
        .pipe(ngAnnotate()) // Use the directly required ngAnnotate
        .pipe(gulp.plugins.sourcemaps.init())
        .pipe(gulp.plugins.concat(gulp.config.scripts.minify.dest))
        .pipe(gulp.plugins.uglify(gulp.config.scripts.minify.uglify))
        .pipe(gulp.plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(dstDir));
});

/*
* For gulp.plugins.filenames.get("scripts"... to work, filenames must have been used in previous steps (in fct 'copyScripts')
*/
function injectScripts () {
    var layoutsDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.layouts);
    var ignorePath = path.join(gulp.config.projectsDir, gulp.config.projectDirName, gulp.config.roots.build);

    if (process.env.GULP_PROJECTS_DIR) {
        ignorePath = path.join(gulp.config.roots.build);
    }

    var files = gulp.src(gulp.plugins.filenames.get("scripts", "full"), {
            read: false
        })
        //.pipe(gulp.plugins.print());
	
    return gulp.src([layoutsDir + '/**/*.jade', layoutsDir + '/**/*.pug'])
        .pipe(gulp.plugins.inject(files, {quiet: true, ignorePath: ignorePath}))
        .pipe(gulp.dest(layoutsDir));
}

function injectScripts2 (scripts) {
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts);
    var layoutsDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.layouts);

    var ignorePath = path.join(gulp.config.projectsDir, gulp.config.projectDirName, gulp.config.roots.build);

    if (process.env.GULP_PROJECTS_DIR) {
        ignorePath = path.join(gulp.config.roots.build);
    }

    var sources = gulp.src(scripts, {
            read: false,
            root: gulp.config.projectDir
        })
        .pipe(gulp.dest(dstDir, {cwd: ignorePath}));
    //.pipe(gulp.plugins.print());

    return gulp.src([layoutsDir + '/**/*.jade', layoutsDir + '/**/*.pug'])
        .pipe(gulp.plugins.inject(sources, {quiet: true}))
        .pipe(gulp.dest(layoutsDir));
}

gulp.task('scripts:inject', function() {
    return injectScripts();
});

gulp.task('scripts:inject-min', function() {
    return injectScripts2(['/' + path.join(gulp.config.roots.build, gulp.config.srcRoots.scripts, gulp.config.scripts.minify.dest)]);
});

// Lint JavaScript
gulp.task('scripts:jshint', function() {
    return gulp.src([path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts) + '/*.js', '!**.min.js'])
        .pipe(gulp.plugins.jshint())
        .pipe(gulp.plugins.jshint.reporter('jshint-stylish'))
});

var series = ['scripts:copy-vendors', 'scripts:copy-plugins', 'scripts:copy-project', 'scripts:copy-components',  'scripts:inject'];
// if (gulp.config.scripts.minify.inBuild) {
    series = ['scripts:min', 'scripts:inject-min'];
// }

gulp.task('scripts', gulp.series(series));
