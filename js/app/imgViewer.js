(function() {
	mui.init({
		keyEventBind: {
			menubutton: false
		}
	});

	mui.plusReady(function() {
		window.addEventListener('displayImageEvent', displayImageHandler);
	});
	
	function displayImageHandler(event) {
		var imageSrc = event.detail.src;
		document.getElementById("img").src = imageSrc;
	}
	
	window.imgViewer = {
		imgLoaded: _imgLoaded,
		imgError: _imgError,
	}

	function _imgLoaded() {
		qmask.show();
		var img = document.getElementById("img");
		img.style.width = "100%";
		img.style.visibility = 'visible';
		qmask.hide();
	}

	function _imgError() {
		plus.nativeUI.alert("无效的图片资源", function() {
			mui.back();
		});
	}

})();