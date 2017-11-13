'use strict';
const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const gh_pages = require('gh-pages');
const handlebars = require('gulp-compile-handlebars');
const handlebars_layouts = require('handlebars-layouts');
const rename = require('gulp-rename');
const header = require('gulp-header');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));

handlebars.Handlebars.registerHelper(handlebars_layouts(handlebars.Handlebars));

// TODO: minification of CSS and JS files, source maps.

let banner = `/*!
 * Bootstrap Colorpicker - <%= pkg.description %>
 * @package v<%= pkg.name %>
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
  return gulp.src([]) // 'src/js/plugin.js'
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist/js/'));
});


gulp.task('css:clean', function () {
  return del(['dist/css/**/*']);
});
gulp.task('css', ['css:clean'], function () {
  return gulp.src('./src/sass/colorpicker.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('bootstrap-colorpicker.css'))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('html:clean', function () {
  return del(['dist/index.html']);
});
gulp.task('html', ['html:clean'], function () {

  let data = {banner: banner, package: pkg};
  let options = {
    batch: ['./src/hbs', './src/hbs/partials', './src/hbs/partials/examples'],
    helpers: {
      code: function (hbsOptions) {
        let entityMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': '&quot;',
          "'": '&#39;',
          "/": '&#x2F;'
        };

        let code = String(hbsOptions.fn(this)).trim().replace(/[&<>"'\/]/g, function (s) {
          return entityMap[s];
        });

        return '<div class="example-code">' + code + '</div>';
      }
    }
  };

  return gulp.src('src/hbs/index.hbs')
    .pipe(handlebars(data, options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});


gulp.task('gh-pages', ['default'], function () {
  // WARNING! You won't be able to publish unless you have write permissions on the repo.
  // Check the gh-pages npm package documentation.
  gh_pages.publish('dist',
    {
      message: 'Update build with latest master changes'
    },
    function () {
      console.info("The gh-pages branch is updated and pushed 📦.");
    }
  );
});

gulp.task('watch', ['default'], function () {
  gulp.watch('src/hbs/**/*.hbs', ['html']);
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
});


gulp.task('default', ['js', 'css', 'html'], function () {
  console.info("The dist files have been rebuilt ✨.");
});
