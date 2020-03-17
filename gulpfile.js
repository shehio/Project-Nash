const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

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

gulp.task('eslint', () => 
{
    return gulp.src(sources)
        .pipe(eslint({}))
        .pipe(eslint.format());
});

gulp.task('test', gulp.series('eslint', () => 
{
    return gulp.src(tests, { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {}
        }));
}));

gulp.task('default',  gulp.series(['eslint', 'test'], (done) => { done() }));

gulp.task('watch', () => 
{
    gulp.watch(sources, () => 
    {
        gulp.run('eslint');
        gulp.run('test');
    });
});