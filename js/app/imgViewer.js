mui.init({
	keyEventBind : {
		menubutton : false
	}
});


mui.plusReady(function(){
	window.addEventListener('displayImageEvent', displayImageHandler);
});

function displayImageHandler(event) {
	var imageSrc = event.detail.src;
	document.getElementById("img").src=imageSrc;
}

function imgLoaded() {
	qmask.show();
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
	img.style.visibility = 'visible';
	qmask.hide();
}

function imgError(){
	document.getElementById("img").style.display = "none";
	plus.nativeUI.alert( "无效的图片资源", function(){
		back();
	} );
}
