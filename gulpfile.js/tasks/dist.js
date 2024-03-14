

var fs = require('fs-extra');
var path = require('path');

gulp.task('dist:clean', function(cb) {
    var dir = path.join(gulp.config.projectDir, gulp.config.roots.dist);

    fs.emptyDir(dir, cb);
});

gulp.task('dist:copy', function(cb) {
    var buildDir = path.join(gulp.config.projectDir, gulp.config.roots.build);
    var distDir = path.join(gulp.config.projectDir, gulp.config.roots.dist);

    if (!distDir) {
        cb();
        return;
    }

    var pubDir = distDir;
    if (gulp.config.dist.public) {
        pubDir = path.join(distDir, gulp.config.dist.public);
    }

    fs.copy(buildDir, pubDir, function() {
        if (!gulp.config.dist.copyFiles) {
            cb();
            return;
        }

        gulp.config.dist.copyFiles.forEach(function(files) {
            fs.copySync(path.join(gulp.config.projectDir, files[0]), path.join(distDir, files[1]));
        });

        cb();
    });
});

gulp.task('dist:delete', function (done) {
    const distDir = path.join(gulp.config.projectDir, gulp.config.roots.dist);

    if (!distDir || !(gulp.config.dist.deleteFiles && gulp.config.dist.deleteFiles.length)) {
        done();
        return;
    }

    Promise.all(gulp.config.dist.deleteFiles.map(file => 
        fs.remove(path.join(distDir, file))
    )).then(() => done()).catch(done);
});

gulp.task('dist:configs', function(cb) {
    if (gulp.config.dist.makeConfig)
        fs.writeFile(path.join(gulp.config.projectDir, gulp.config.roots.dist, gulp.config.dist.makeConfig), JSON.stringify(gulp.config.dist.configData, null, 4), cb);
    else
        cb();
});

