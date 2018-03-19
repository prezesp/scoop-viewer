var gulp = require('gulp');

gulp.task('copy', function() {
    gulp.src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('../static/vendor/jquery'));
    
    
    gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('../static/vendor/bootstrap'));

    gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('../static/vendor/font-awesome'));

    gulp.src([
      'node_modules/ladda/dist/*',
      '!**/ladda.min.css',
      '!**/ladda.jquery.min.js'
    ])
    .pipe(gulp.dest('../static/vendor/ladda'));
});

gulp.task('default', ['copy']);
