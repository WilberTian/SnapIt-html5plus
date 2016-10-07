mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false
	}
});


mui.plusReady(function(){
	window.addEventListener('displayItemDetail', displayItemDetailHandler);
});


function displayItemDetailHandler(event){
	snapIt.common.indexPage().evalJS("showBackBtn();");

	var detailId = event.detail.id;
	var sql = 'select * from snap_it where id=' + detailId;
	snapIt.common.query(db, sql, function(res){
		if(res.rows.length > 0){
			var data = res.rows.item(0);
			$('#detailTitle').text(data.title);
			if(data.images === '') {
				$('#detailContent').html('没有图片记录');
			} else {
			
				var imagePathList = data.images.split(',');
				var imagePathList = imagePathList.map(function(path){
					return '_doc/camera/' + path;
				})
				
				imagePathList.forEach(function(path){
					plus.io.resolveLocalFileSystemURL( path, function ( entry ) {
						$('#image-list-viewer').append('<img src="' + entry.toLocalURL() + '"></img>');
					}, function ( e ) {
						snapIt.common.alert( "读取拍照文件错误："+e.message );
					} );
				});
			}
			
			snapIt.common.show('detail', 'slide-in-right', 300);
		}
	});
}