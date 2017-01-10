const path = require('path');
const gulp = require('gulp');
const named = require('vinyl-named');
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');

function bundle(appname) {
    const tmp = {};

    return gulp.src(`./examples/${appname}/appentry.js`)
        .pipe(named())
        .pipe(rename(function (path) {
            tmp[path.basename] = path;
        }))
        .pipe(webpack({
            output: {
                filename: 'appentry.js'
            },
            resolveLoader: {root: path.join(__dirname, "node_modules")},
            module: {
                loaders: [
                    {test: /\.js/, exclude: /node_modules/, loader: "babel-loader"},
                    {test: /node_modules\/insula\/.*?\.js/, loader: "babel-loader"}
                ]
            }
        }))
        .pipe(rename(function (path) {
            path.dirname = tmp[path.basename].dirname;
        }))
        .pipe(gulp.dest(`./examples/build/${appname}`));
}

gulp.task('copy-html', () => gulp.src(['./examples/**/*.html', '!./examples/build', '!./examples/build/**']).pipe(gulp.dest('./examples/build')));

gulp.task('build-imagesearch', ['copy-html'], () => bundle('imagesearch'));
gulp.task('build-todo', ['copy-html'], () => bundle('todo'));

gulp.task('build-examples', ['build-imagesearch', 'build-todo']);