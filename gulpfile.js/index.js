// ==== GULPFILE ==== //


gulp = require('gulp');
gulp.config = require('./../lib/loadconfig');
gulp.plugins = require('gulp-load-plugins')({ camelize: true });

var requireDir = require('require-dir');

requireDir('./tasks/global'); //tasks which don't depend on project/config

gulp.task('default', function(cb) {
    gulp.log('No project is found!');
});

if (gulp.config.isLoaded) {
    requireDir('./tasks');

    if (process.env.GULP_PROJECTS_DIR) {
        process.env.INIT_CWD = gulp.config.projectDir;
        process.chdir(gulp.config.projectDir);
    }

    gulp.task('rebuild:full', gulp.series('build', 'content', 'layouts:copy', 'styles' , 'images', 'scripts' , 'layouts'));

    gulp.task('rebuild:min', gulp.series('build', 'content', 'layouts:copy', 'styles' , 'images:min', 'scripts' , 'layouts'));

    gulp.task('rebuild', gulp.series('build:static', 'content', 'layouts:copy', 'styles' , 'images', 'scripts' , 'layouts'));

    gulp.task('dist', gulp.series('rebuild:min', 'dist:clean', 'dist:copy', 'dist:delete', 'build:sitemap', 'dist:configs'));

    gulp.task('dist:local', gulp.series('rebuild', 'dist:clean', 'dist:copy', 'dist:delete', 'build:sitemap', 'dist:configs'));

    gulp.task('deploy', gulp.series('dist', 'git:init-dist', 'git:push'));
    gulp.task('deploy:patch', gulp.series('dist', 'tag:patch', 'git:init-dist', 'git:push'));
    gulp.task('deploy:feature', gulp.series('dist', 'tag:feature', 'git:init-dist', 'git:push'));
    gulp.task('deploy:release', gulp.series('dist', 'tag:release', 'git:init-dist', 'git:push'));


    if (gulp.config.nodemon.script) {
        gulp.task('default', gulp.series('rebuild:full', gulp.parallel('nodemon', 'serve')));
    } else {
        gulp.task('default', gulp.series('rebuild:full', 'serve'));
    }
}
