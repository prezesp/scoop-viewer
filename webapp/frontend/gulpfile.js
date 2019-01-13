var gulp = require('gulp');
var webpack = require('webpack-stream');
var webpack2 = require('webpack');

gulp.task('copy', function() {
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

gulp.task('webpack', function() {
    return gulp.src('./app.jsx').pipe(webpack({
        watch: true,
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
                    plugins: ["transform-object-rest-spread", "transform-class-properties"]
                }
            }, { 
                test: /\.css$/, 
                loader: "style-loader!css-loader" 
            }]
        },
        optimization: {
            minimize: true
        },
        plugins: [
            new webpack2.DefinePlugin({
                'process.env': { 'NODE_ENV': "'production'" }
            }),
            new webpack2.ProvidePlugin({
                Promise: 'es6-promise-promise', // works as expected
            })
        ]
    }, webpack2)).pipe(gulp.dest('../'));
});

gulp.task('default', ['copy', 'webpack']);
