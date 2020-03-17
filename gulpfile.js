const gulp = require('gulp');
const mocha = require('gulp-mocha');
const lint = require('gulp-eslint');

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

gulp.task('lint', () => 
{
    return gulp.src(sources)
        .pipe(lint({}))
        .pipe(lint.format());
});

gulp.task('test', gulp.series('lint', () => 
{
    return gulp.src(tests, { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {}
        }));
}));

gulp.task('default',  gulp.series(['lint', 'test'], (done) => { done() }));

gulp.task('watch', () => 
{
    gulp.watch(sources, () => 
    {
        gulp.run('lint');
        gulp.run('test');
    });
});