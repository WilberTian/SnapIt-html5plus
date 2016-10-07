var w=null;

mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false
	}
});


mui.plusReady(function(){
	w=plus.nativeUI.showWaiting();
});

function imgLoaded() {
	w&&(w.close(),w=null);
	var b = document.body;
	var img = document.getElementById("img");
	var pb = b.clientHeight/b.clientWidth,
	pi = img.clientHeight/img.clientWidth;
	if ( pb > pi ) {
		img.style.width = "100%";
	} else {
		img.style.height = "100%";
	}
	b.style.lineHeight = b.clientHeight+"px";
}

function imgError(){
	w&&(w.close(),w=null);
	document.getElementById("img").style.display = "none";
	plus.nativeUI.alert( "无效的图片资源", function(){
		back();
	} );
}

function loadMedia(src){
	document.getElementById("img").src=src;
}