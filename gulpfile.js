const gulp = require('gulp');
const ts = require('gulp-typescript');
const zip = require('gulp-zip');

const srcPath = 'src/**/*.ts';
const distPath = './dist';

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('compile:typescript', () => {
    const tsResult = gulp.src(srcPath)
        .pipe(ts({
            //noImplicitAny: true,
			//outFile: 'index.js',
            target: "ES5"
        }))
        .on('error', swallowError);
	
	return tsResult.js
        .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
    gulp.watch([srcPath], ['compile:typescript']);
});

gulp.task('publish:aws', ['compile:typescript'], () => {
    return gulp.src([
        `${distPath}/*.@(js|json)`, 
        `!${distPath}/trustscore.js`
    ])
    .pipe(zip('trustscore-calculator.zip'))
    .pipe(gulp.dest(`${distPath}/aws`));
});

gulp.task('default', ['compile:typescript']);