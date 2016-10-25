const path = require('path');
const gulp = require('gulp');
const named = require('vinyl-named');
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');

gulp.task('copy-html', () =>
    gulp.src(['./examples/**/*.html', '!./examples/build', '!./examples/build/**'])
    .pipe(gulp.dest('./examples/build'))
);

gulp.task('build-examples', ['copy-html'], () => {
    const tmp = {};

    return gulp.src(['./examples/**/appentry.js', '!./examples/build', '!./examples/build/**'])
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
                    {test: /\.js/, exclude: /node_modules/, loader: "babel-loader"}
                ]
            }
        }))
        .pipe(rename(function (path) {
            path.dirname = tmp[path.basename].dirname;
        }))
        .pipe(gulp.dest('./examples/build'))
});