var fs=require("fs");
var path=require("path");
/*同步读文件*/
function readCont(path){
	return fs.readFileSync(path,'utf-8').toString();
}
/*内容变更*/
function replaceCont(str,headerTem,footerTem){
	(function (){
		var start=str.indexOf("<!-- headerStart -->");
		var end=str.indexOf("<!-- headerEnd -->");
		if(start!=-1 && end!=-1){
			str=str.substring(0,start+20)+headerTem+str.substring(end);
		}
	})();
	(function (){
		var start=str.indexOf("<!-- footerSatrt -->");
		var end=str.indexOf("<!-- footerEnd -->");
		if(start!=-1 && end!=-1){
			str=str.substring(0,start+20)+footerTem+str.substring(end);
		}
	})();
	return str;
}
/*获取模板*/
function getTem(path){
	var str=readCont(path);
	str.replace(/\<body\>(\S|\s)*/gm,function(s){
		str=s.replace(/\<body\>|\<\/body\>(\S|\s)*/gm,'');
	});
	return str;
}
/*变更模板*/
function changeTem(obj){
	var str=obj.tem || "";
	var fileName=obj.fileName.split(".")[0];
	var sRegActive='class="'+fileName;
	var regActive=new RegExp(sRegActive,'mg');
	if(obj.isChange){
		/*menu 路径*/
		var dif='';
		if(fileName=="index"){
			dif=path.relative(global.dataPath.indexPath,global.dataPath.pagePath);
			str=str.replace(/href\=\"\w+\.html/mg,function(s){
				if( !/index.html/mg.test(s) ){
					s=s.replace(/\"([^\.]+)/mg,'"'+dif+'/$1');
				}
				return s;
			});
		}else{
			dif=path.relative(global.dataPath.pagePath,global.dataPath.indexPath);
			str=str.replace(/href\=\"\w+\.html/mg,function(s){
				s=s.replace(/index/mg,dif+'/index');
				return s;
			});
		}
		if(obj.type=='header'){
			/*menu active*/
			if(regActive.test(str)){
				str=str.replace(regActive,sRegActive+' active');
			}
		}
	}
	return str;
};

module.exports=function(changePath) {
	var headerTem=getTem(global.dataPath.headerPath);
	var footerTem=getTem(global.dataPath.footerPath);
	var aFile=fs.readdirSync(changePath);
	for(var i=0,sHeader='',sFooter='';i<aFile.length;i++){
		if(/.html/g.test(aFile[i])){
			(function (sFileName){
				sHeader=changeTem({
					path:changePath,
					fileName:sFileName,
					type:"header",
					tem:headerTem,
					isChange:true
				});
				sFooter=changeTem({
					path:changePath,
					fileName:sFileName,
					tem:footerTem,
					type:"footer",
					isChange:true
				});
				var filePath=path.join(changePath,sFileName);
				var cont=readCont(path.join(changePath,sFileName));
				cont=replaceCont(cont,sHeader,sFooter);
				fs.writeFileSync(path.join(changePath,sFileName),cont);
				console.log("检测的模板路径："+path.join(changePath,sFileName));
			})(aFile[i]);
		}
	}
};
