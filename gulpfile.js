//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    uglify = require('gulp-uglify'),//压缩文件
	concat = require('gulp-concat'),//文件合并
	rename = require('gulp-rename');//重命名

//压缩合并js文件
gulp.task('slide',function() {
	return gulp.src('js/slide.js') 
		.pipe(concat('slide.js')) 
        .pipe(uglify()) 
		.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js'))
});

gulp.watch('js/slide.js',['slide']);