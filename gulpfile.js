const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');

gulp.task('default', ['jshint', 'test'], function () { });

gulp.task('test', () => {
    let sources = [
        './test/*.js',
        './finance//test/*.js',
        './lemke-howson/test/*.js',
        './minmax/test/*.js',
        './montecarlo/test/*.js'
    ]
    return gulp.src(sources, { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {}
        }));
});

gulp.task('jshint', () => {
    return gulp.src('./*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
