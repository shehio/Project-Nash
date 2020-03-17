const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');

const sources = 
[
    './*.js',
    './test/*.js',
    './finance/**/*.js',
    './lemke-howson/**/*.js',
    './minmax/**/*.js',
    './montecarlo/**/*.js'
];

const tests = 
[
    './test/*.js',
    './finance/test/*.js',
    './lemke-howson/test/*.js',
    './minmax/test/*.js',
    './montecarlo/test/*.js'
];

gulp.task('jshint', () => 
{
    return gulp.src(sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', gulp.series('jshint', () => 
{
    return gulp.src(tests, { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {}
        }));
}));

gulp.task('default',  gulp.series(['jshint', 'test'], () => { }));

gulp.task('watch', () => 
{
    gulp.watch(sources, () => 
    {
        gulp.run('jshint');
        gulp.run('test');
    });
});