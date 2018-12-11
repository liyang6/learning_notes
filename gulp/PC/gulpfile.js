global.dataPath={
	root:"../../PC/web",
	pagePath:"../../PC/web/pages",
	indexPath:"../../PC/web",
	headerPath:"../../PC/web/template/header.html",
	footerPath:"../../PC/web/template/footer.html"
};

var fs=require("fs"),
    gulp=require('gulp'),
    rimraf = require('rimraf'),
    plugins = require('gulp-load-plugins')();
const path = require('path');
var changeTem=require('./changeTem');
var outputDir='dist';
var output=global.dataPath.root+'/'+outputDir;

gulp.task('connect', function () {
    plugins.connect.server({
        name: 'PC网站',
        /*https:true,*/
        root: global.dataPath.root,
        /*host: "127.0.0.1",*/
        host: "0.0.0.0",
        port: 8082,
        livereload: true
    });
});

gulp.task('changeTem',function(){
    changeTem(global.dataPath.indexPath);
    changeTem(global.dataPath.pagePath);
});
gulp.task('watch',function(){
    gulp.watch(global.dataPath.headerPath,['changeTem']);
    gulp.watch(global.dataPath.footerPath,['changeTem']);
});




gulp.task('delDist', function (cb) {
    return rimraf(output, cb);
});
// 压缩 PC 目录 html
gulp.task('minify_html', function () {
    return gulp.src([global.dataPath.root+'/**/*.html', "!"+global.dataPath.root+'/template/*.html'],{
            base:global.dataPath.root
        })
        .pipe(plugins.htmlclean())
        .pipe(plugins.htmlmin({
            removeComments: true,
            collapseWhitespace:true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest(output))
});
// 压缩 PC 目录 css
gulp.task('minify_css', function () {
    return gulp.src([global.dataPath.root+'/**/*.css'],{
            base: global.dataPath.root 
        })
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(output));
});
// 压缩 PC js 目录 js
gulp.task('minify_js', function () {
    return gulp.src([global.dataPath.root+'/**/*.js'],{
            base: global.dataPath.root 
        })
        .pipe(plugins.uglify())
        .pipe(gulp.dest(output));
});
// 拷贝图片至相对应的目录
gulp.task('copy_file', function () {
    return gulp.src([global.dataPath.root+'/**/*.ico',global.dataPath.root+'/images/*.*',global.dataPath.root+'/data/*.*'],{
            base: global.dataPath.root 
        })
        .pipe(gulp.dest(output));
});

// 异步同步执行
gulp.task('dabao', function (cb) {
    plugins.sequence('delDist', ['minify_html', 'minify_css', 'minify_js', 'copy_file'], cb)
});
// 执行 gulp 命令时执行的任务
gulp.task('build', ['dabao']);


/*默认*/
gulp.task('default',["changeTem"],function() {
  // 将你的默认的任务代码放在这
 	gulp.start('connect','watch'); 
});

