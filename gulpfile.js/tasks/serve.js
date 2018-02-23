

var path = require('path');

var connect = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    _ = require('lodash');

gulp.task('serve:wordpress', function() {
    var phpServerOptions = {
        base: gulp.config.libWordpressDir + '/public',
        port: gulp.config.serve.php.port
    };

    var browserSyncOptions = {
        proxy: '127.0.0.1:' + gulp.config.serve.php.port,
        port: gulp.config.serve.port,
        files: [path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles) + path.sep + '**/*.css',
                path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts) + path.sep + '**/*.js']
    };

    connect.server(phpServerOptions, function (){
        browserSync(browserSyncOptions);
    });

});

gulp.task('serve:proxy', function() {



    browserSync(browserSyncOptions);
});


gulp.task('serve:site', function() {

    var browserSyncOptions;

    if (gulp.config.serve.proxy) {

        browserSyncOptions = {
            proxy: '127.0.0.1:' + gulp.config.serve.proxy.port,
            port: gulp.config.serve.port,
            files: [path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles) + path.sep + '**/*.css',
                path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts) + path.sep + '**/*.js']
        };

    } else {

        browserSyncOptions = {
            port: gulp.config.serve.port,
            files: [path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.styles) + path.sep + '**/*.css',
                path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.scripts) + path.sep + '**/*.js'],
            server: {
                baseDir: path.join(gulp.config.projectDir, gulp.config.serve.baseDir)
            },
            open: gulp.config.serve.open
        };

    }

    browserSync(browserSyncOptions);

});

gulp.task('serve:reload', function(cb) {
    browserSync.reload();
    cb();
});


gulp.task('serve:watch', function () {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.src) + path.sep;

    gulp.watch([srcDir + gulp.config.srcRoots.imgs + '/**/*'], gulp.series('images', 'layouts:shopify', 'serve:reload'));
    gulp.watch([srcDir + gulp.config.srcRoots.scripts + '/**/*.js'], gulp.series('scripts', 'layouts:shopify', 'serve:reload'));
    gulp.watch([srcDir + gulp.config.srcRoots.scss + '/**/*.scss'], gulp.series('styles', 'layouts:shopify', 'serve:reload'));
    gulp.watch([srcDir + gulp.config.srcRoots.layouts + '/**/*.jade', srcDir + gulp.config.srcRoots.layouts + '/**/*.pug'], gulp.series('rebuild', 'serve:reload'));
    gulp.watch([srcDir + gulp.config.srcRoots.content + '/**/*.md'], gulp.series('rebuild', 'serve:reload'));
    gulp.watch([srcDir + gulp.config.srcRoots.static + '/**/*'], gulp.series('build:static', 'serve:reload'));
});

gulp.task('serve', gulp.parallel('serve:watch', 'serve:' + gulp.config.serve.mode));
