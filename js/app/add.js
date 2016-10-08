mui.init({
	keyEventBind : {
		menubutton : false
	}
});

var imgViewer = null;


mui.plusReady(function(){
	imageListElement=$('#image-list-element');
	
	resetPage();
	snapIt.common.on('.add-item-btn', 'tap', addItem);
	snapIt.common.on('.take-image-btn', 'tap', takeImage);
	snapIt.common.on('.clear-history-btn', 'tap', cleanHistory);

	// image viewer page
	imgViewer = mui.preload(snapIt.common.page('imgViewer', {popGesture:'none'}));

});


function resetPage(){
	$('#addCategory').val('');
	$('#addTitle').val('');

	imageListElement.empty();
	imageListElement.append('<li id="empty-element" class="mui-table-view-cell">无历史记录</li>');
}


function addItem(){
	var title = $.trim($('#addTitle').val());
	var category = $.trim($('#addCategory').val()) ? $.trim($('#addCategory').val()) : '未分类';
	var images = imageList.toString();
	
	if(!title){
		snapIt.common.alert('请填写标题！');		
	}else{
		snapIt.common.getPage('add').hide();
		resetPage();
		snapIt.common.fire('list', 'addItemEvent', {title:title, category:category, images:images});
		
	}
}


function showImgViewer(ele) {
	snapIt.common.show('imgViewer', 'slide-in-bottom', 300);

	snapIt.common.fire('imgViewer', 'displayImageEvent', {src:ele.entry.toLocalURL()});
}

var gentry=null,w=null;
var imageListElement=null;
var imageList = [];

function takeImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage( function ( p ) {
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			createItem( entry );
		}, function ( e ) {
			snapIt.common.alert( "读取拍照文件错误："+e.message );
		} );
	}, function ( e ) {
		snapIt.common.alert( "失败："+e.message );
	}, {filename:"_doc/camera/",index:1} );
}

function cleanHistory() {
	$('.image-item').remove();
	
	$('#empty-element').show();
	imageList.length = 0;
	
	// snapIt.common.alert( "清空拍照录像历史记录：" );
	gentry.removeRecursively( function () {
		// Success
		snapIt.common.alert( "成功！" );
	}, function ( e ) {
		snapIt.common.alert( "失败："+e.message );
	});
}
		
function createItem( entry ) {
	qmask.show();
	var li = document.createElement("li");
	li.className = "mui-table-view-cell image-item";
	li.innerHTML = '<a class="mui-navigate-right"></a>';
	li.setAttribute( "onclick", "showImgViewer(this);" );
	imageListElement.prepend( li );
	li.querySelector(".mui-navigate-right").innerText = entry.name;
	li.entry = entry;

	// 设置空项不可见
	$('#empty-element').hide();
	
	imageList.push(entry.name);
	
	qmask.hide();
}
