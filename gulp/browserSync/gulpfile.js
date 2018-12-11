var gulp=require('gulp');
var browserSync = require('browser-sync').create();  //自动同步

 gulp.task('browser',function () {
     var files = [
         '**/*.html',
         '**/*.css',
         '**/*.js'];
//代理模式（本地服务器）
    browserSync.init(files,{
        proxy: 'http://10.106.26.99:8087/zui/themes/MOBILE/index.html',  //此处根据项目实际目录填写
    });
//本地静态文件
     /*browserSync.init(files, {
         server: {
             baseDir: './lf'   //该路径到html的文件夹目录
         }
     });*/
});

/*默认*/
gulp.task('default',function() {
  // 将你的默认的任务代码放在这
 	gulp.start('browser'); 
});