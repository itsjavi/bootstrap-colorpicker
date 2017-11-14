'use strict';
const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const ghPages = require('gh-pages');
const handlebars = require('gulp-compile-handlebars');
const handlebarsLayouts = require('handlebars-layouts');
const rename = require('gulp-rename');
const header = require('gulp-header');
const shell = require('gulp-shell');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));

handlebars.Handlebars.registerHelper(handlebarsLayouts(handlebars.Handlebars));

// TODO: add CSS source maps.

let banner = `/*!
 * Bootstrap Colorpicker - <%= pkg.description %>
 * @package <%= pkg.name %>
 * @version v<%= pkg.version %>
 * @license <%= pkg.license %>
 * @link <%= pkg.homepage %>
 * @link <%= pkg.repository.url %>
 */
`;

gulp.task('clean', function () {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('js:clean', function () {
  return del(['dist/js/**/*']);
});
gulp.task('js', ['js:clean'], function () {
  return gulp.src([])
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('css:clean', function () {
  return del(['dist/css/**/*']);
});
gulp.task('css-min', ['css:clean'], function () {
  return gulp.src('./src/sass/colorpicker.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('bootstrap-colorpicker.min.css'))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('css', ['css:clean', 'css-min'], function () {
  return gulp.src('./src/sass/colorpicker.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('bootstrap-colorpicker.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('tutorials:clean', function () {
  return del(['build/tutorials/*']);
});
gulp.task('tutorials', ['tutorials:clean'], function () {

  let data = {banner: banner, package: pkg};
  let options = {
    batch: ['./src/hbs'],
    helpers: {
      code: function (hbsOptions) {
        let entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;'
        };

        return String(hbsOptions.fn(this)).trim().replace(/[&<>"'\/]/g, function (s) {
          return entityMap[s];
        }).replace(/^ {2,8}/mgi, '');
      }
    }
  };

  gulp.src('src/hbs/tutorials/tutorials.json')
    .pipe(gulp.dest('build/tutorials'));

  return gulp.src('src/hbs/tutorials/**/*.hbs')
    .pipe(handlebars(data, options))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('build/tutorials'));
});

gulp.task('docs:clean', function () {
  return del(['build/docs/*']);
});
gulp.task('docs', ['docs:clean', 'dist', 'tutorials'], shell.task([
  'node_modules/.bin/jsdoc --configure .jsdoc.json --verbose',
  'cp -R dist build/docs/dist'
]));

gulp.task('publish-docs', ['default'], function () {
  // WARNING! You won't be able to publish unless you have write permissions on the repo.
  // Check the gh-pages npm package documentation.
  ghPages.publish('build/docs',
    {
      message: 'Update build with latest master changes'
    },
    function () {
      console.info('The gh-pages branch is updated and pushed 📦.');
    }
  );
});

gulp.task('watch', ['default'], function () {
  gulp.watch('src/hbs/**/*.hbs', ['tutorials']);
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('dist', ['js', 'css']);

gulp.task('default', ['dist', 'docs'], function () {
  console.info('The dist and docs files have been rebuilt 👏✨.');
});
