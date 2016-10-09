(function() {
	mui.init({
		keyEventBind: {
			menubutton: false
		}
	});


	var w = null;
	var imageListElement = null;
	var imageList = [];

	mui.plusReady(function() {
		imageListElement = $('#image-list-element');

		resetPage();
		
		// event listeners
		snapIt.common.on('.add-item-btn', 'tap', addItem);
		snapIt.common.on('.take-image-btn', 'tap', takeImage);
		snapIt.common.on('.clear-history-btn', 'tap', cleanHistory);
		snapIt.common.on('.image-item', 'tap', showImgViewer);

		// image viewer page
		mui.preload(snapIt.common.page('imgViewer', {
			popGesture: 'none'
		}));

	});

	function resetPage() {
		$('#addCategory').val('');
		$('#addTitle').val('');

		imageListElement.empty();
		imageListElement.append('<li id="empty-element" class="mui-table-view-cell">无历史记录</li>');
		
		imageList.length = 0;
	}

	function addItem() {
		var title = $.trim($('#addTitle').val());
		var category = $.trim($('#addCategory').val()) ? $.trim($('#addCategory').val()) : '未分类';
		var images = imageList.toString();

		if(!title) {
			snapIt.common.alert('请填写标题！');
		} else {
			snapIt.common.getPage('add').hide();
			resetPage();
			snapIt.common.fire('list', 'addItemEvent', {
				title: title,
				category: category,
				images: images
			});

		}
	}

	function showImgViewer() {
		snapIt.common.show('imgViewer', 'slide-in-bottom', 300);

		snapIt.common.fire('imgViewer', 'displayImageEvent', {
			src: this.entry.toLocalURL()
		});
	}

	function takeImage() {
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				createItem(entry);
			}, function(e) {
				snapIt.common.alert("读取拍照文件错误：" + e.message);
			});
		}, function(e) {
			snapIt.common.alert("失败：" + e.message);
		}, {
			filename: "_doc/camera/",
			index: 1
		});
	}

	function cleanHistory() {
		$('.image-item').remove();

		$('#empty-element').show();
		
		snapIt.common.removeLocalImgFile(imageList);
		imageList.length = 0;

	}

	function createItem(entry) {
		qmask.show();
		var li = document.createElement("li");
		li.className = "mui-table-view-cell image-item";
		li.innerHTML = '<a class="mui-navigate-right"></a>';
		imageListElement.prepend(li);
		li.querySelector(".mui-navigate-right").innerText = entry.name;
		li.entry = entry;

		// 设置空项不可见
		$('#empty-element').hide();

		imageList.push(entry.name);

		qmask.hide();
	}

})();