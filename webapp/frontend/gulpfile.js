const gulp = require('gulp');
const sass = require('gulp-sass');
const watchSass = require('gulp-watch-sass');
const webpack = require('webpack-stream');
const webpack2 = require('webpack');

let webpackWatch = false;

gulp.task('copy', gulp.series(function() {
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

    return gulp.src([
        'node_modules/bootstrap.native/dist/bootstrap-native-v4.min.js'
    ])
        .pipe(gulp.dest('../static/vendor/bootstrap.native'));
}));

gulp.task('sass', gulp.series(function() {
    return gulp.src('scss/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('../static'));
}));

gulp.task('sass:watch', gulp.series(() => watchSass([
    'scss/**/*.scss'
]).pipe(sass())
    .pipe(gulp.dest('../static'))));

gulp.task('webpack', gulp.series(function() {
    return gulp.src('./app.jsx').pipe(webpack({
        watch: webpackWatch,
        output: {
            path: __dirname,
            filename: 'static/js/bundle.js'
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread', 'transform-class-properties']
                }
            }, { 
                test: /\.css$/, 
                loader: 'style-loader!css-loader' 
            }]
        },
        optimization: {
            minimize: true
        },
        plugins: [
            new webpack2.DefinePlugin({
                'process.env': { 'NODE_ENV': '\'production\'' }
            }),
            new webpack2.ProvidePlugin({
                Promise: 'es6-promise-promise', // works as expected
            })
        ]
    }, webpack2)).pipe(gulp.dest('../'));
}));

gulp.task('webpack:watch', gulp.series(() => {
    // This task sets only a variable to change webpack watch mode
    // and launches webpack.
    webpackWatch = true;
    return gulp.src('.');
}, 'webpack'));

gulp.task('default', gulp.series('copy', 'sass', 'webpack'));
gulp.task('watch', gulp.parallel(gulp.series('copy', 'webpack:watch'), 'sass:watch'));
