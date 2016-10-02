var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', () => {
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
