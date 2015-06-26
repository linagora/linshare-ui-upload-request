var gulp = require('gulp');

var closureCompiler = require('gulp-closure-compiler');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var filter = require('gulp-filter');

var sync = require('sync-pkg');
var browserSync = require('browser-sync');

var paths = {
  src: 'app',
  dest: 'dist',
  ngComponents: ['app/ng_components/**/*.js', '!app/ng_components/**/*.spec.js'],
  states: ['app/states/**/*.js', '!app/states/**/*.pageobject.js', '!app/states/**/*.scenario.js', '!app/states/**/*.spec.js'],
  main: 'app/js/app.js',
  config: 'app/js/config.js',
  bowerComponents: 'bower_components',
  images: 'app/img/**/*'
};

// Remove previous build
gulp.task('clean', function(){
  return gulp.src(paths.dest, {read: false})
    .pipe(rimraf());
});

// Sync package.json & bower.json
gulp.task('sync', ['clean'], function() {
  sync({
    include: ['name', 'version', 'description', 'license', 'homepage'],
    exclude: ['main']
  });
  gulp.src('bower.json')
    .pipe(gulp.dest(paths.dest));
});

// Compile all angular js files with google closure compiler
gulp.task('compile', ['clean', 'lint'], function() {
  return gulp.src([].concat.apply([], [
      paths.ngComponents,
      paths.states,
      paths.main,
      paths.bowerComponents + '/closure-library-github/closure/goog/base.js'
    ]))
    .pipe(closureCompiler({
      compilerPath: paths.bowerComponents + '/closure-compiler/compiler.jar',
      fileName: 'app.js',
      compilerFlags: {
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT',
        externs: [
          paths.bowerComponents + '/closure-compiler-github/contrib/externs/angular-1.2.js',
          paths.bowerComponents + '/closure-compiler-github/contrib/externs/underscore-1.5.2.js',
          paths.src + '/closure-externs/node-uuid-1.4.1.js'
        ],
        manage_closure_dependencies: true,
        generate_exports: true,
        angular_pass: true
      }
    }))
    .pipe(gulp.dest(paths.dest));
});

// Compile Sass
gulp.task('sass', ['clean'], function() {
  gulp.src(paths.src + '/styles/main.scss')
    .pipe(sass())
    .pipe(gulp.dest(paths.dest + '/styles/'));
});

// Javascript linter
gulp.task('lint', function() {
  gulp.src([paths.src + '/**/*.js', '!' + paths.src + '/styles/**/*', '!' + paths.src + '/i18n/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Inject sources in index.html
gulp.task('inject', ['clean', 'sass', 'compile', 'bower-concat', 'copy'], function() {
  return gulp.src(paths.src + '/index.html')
    // Ordered css
    .pipe(inject(
      gulp.src(
        [
          paths.dest + '/**/normalize.css',
          paths.dest + '/styles/bootstrap.css',
          paths.dest + '/styles/font-awesome.css',
          paths.dest + '/styles/main.css',
          paths.dest + '/styles/loading-bar.min.css',
          paths.dest + '/styles/angular-growl.min.css',
          paths.dest + '/styles/ng-table.min.css'
        ],
        {
          read: false
        }
      ),
      {
        ignorePath: paths.dest,
        addRootSlash: false
      }
    ))
    // Ordered js
    .pipe(inject(gulp.src([
        paths.dest + '/vendor.js',
        paths.dest + '/app.js',
        paths.dest + '/config.js',
        paths.dest + '/i18n/messageformat/**/*'
      ], {read: false}),
      {
        ignorePath: paths.dest,
        addRootSlash: false
      }
    ))
    .pipe(gulp.dest(paths.dest));
});

// Concatenate bower js files
gulp.task('bower-concat', ['clean'], function() {
  gulp.src(bowerFiles({
    env: process.env.NODE_ENV || 'development'
  }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.dest + '/'));
});

// Copy ressources from src to dest folder
gulp.task('copy', ['clean'], function() {
  gulp.src(paths.src + '/states/**/*.html')
    .pipe(gulp.dest(paths.dest + '/states/'));
  gulp.src(paths.src + '/styles/linshare/fonts/**/*')
    .pipe(gulp.dest(paths.dest + '/styles/linshare/fonts'));
  gulp.src([
    paths.bowerComponents + '/normalize-css/normalize.css',
    paths.bowerComponents + '/angular-loading-bar/build/loading-bar.min.css',
    paths.bowerComponents + '/angular-growl/build/angular-growl.min.css',
    paths.bowerComponents + '/ng-table/ng-table.min.css'
  ])
    .pipe(gulp.dest(paths.dest + '/styles/'));
  gulp.src(paths.src + '/styles/bootstrap.css')
    .pipe(gulp.dest(paths.dest + '/styles/'));
  gulp.src(paths.src + '/styles/font-awesome.css')
    .pipe(gulp.dest(paths.dest + '/styles/'));
  gulp.src(paths.src + '/styles/linshare/fonts/fontawesome-webfont.*')
    .pipe(gulp.dest(paths.dest + '/styles/linshare/fonts'));
  gulp.src(paths.src + '/i18n/**/*')
    .pipe(gulp.dest(paths.dest + '/i18n/'));
  gulp.src(paths.images)
    .pipe(gulp.dest(paths.dest + '/img/'));
  gulp.src(paths.config)
    .pipe(gulp.dest(paths.dest));
});

// Watch and livereload
gulp.task('watch', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: [paths.dest]
    },
    ports: {
      min: 3502,
      max: 3600
    },
    notify: false
  });

  gulp.watch(paths.src + '/**/*', ['bs-reload']);
});

// Reload all Browsers
gulp.task('bs-reload', ['build'], function () {
    browserSync.reload();
});

gulp.task('build', ['sync', 'inject']);
gulp.task('serve', ['build', 'watch']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);
