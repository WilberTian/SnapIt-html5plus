(function() {
	mui.init({
		keyEventBind: {
			menubutton: false
		}
	});

	mui.plusReady(function() {
		window.addEventListener('displayItemDetail', displayItemDetailHandler);
	});

	function displayItemDetailHandler(event) {
		var detailId = event.detail.id;
		var sql = 'select * from snap_it where id=' + detailId;
		snapIt.common.query(db, sql, function(res) {
			qmask.show();

			if(res.rows.length > 0) {
				var data = res.rows.item(0);
				$('#detailTitle').text(data.title);

				if(data.images === '') {
					$('#detailContent').html('没有图片记录');
				} else {

					var imagePathList = data.images.split(',');
					var imagePathList = imagePathList.map(function(path) {
						return '_doc/camera/' + path;
					})

					$('#image-list-viewer').empty();

					imagePathList.forEach(function(path) {
						plus.io.resolveLocalFileSystemURL(path, function(entry) {
							$('#image-list-viewer').append('<img src="' + entry.toLocalURL() + '" style="width:100%"></img>');
						}, function(e) {
							snapIt.common.alert("读取拍照文件错误：" + e.message);
						});
					});
				}

				snapIt.common.show('detail', 'slide-in-right', 300);
			}

			qmask.hide();
		});
	}
})();