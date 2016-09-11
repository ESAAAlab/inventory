/**
 * Module Dependencies
 */
var gulp = require('gulp');
var pug = require('gulp-pug');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');


/**
 * Config
 */

var paths = {
  styles: [
    './public/css/*.css',
  ],
  scripts: [
    './public/js/*.js',
  ],
  views: [
    './public/views/**/*.pug',
  ],
  server: [
    './server/bin/www'
  ]
};

var nodemonConfig = {
  script: paths.server[0],
  ext: 'html js css pug',
  ignore: ['.git','node_modules']
};


/**
 * Gulp Tasks
 */

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('templates', function() {
  return gulp.src(paths.views)
    .pipe(pug({
      pretty:true
    }))
    .pipe(gulp.dest('./public/static/'))
});

gulp.task('browser-sync', ['nodemon'], function(done) {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true,
    logLevel: "debug"
  }, done);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon(nodemonConfig)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint']);
  gulp.watch(paths.views, ['templates']);
});

gulp.task('default', ['browser-sync', 'watch', 'templates'], function(){});
