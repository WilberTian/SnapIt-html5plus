mui.init({
	keyEventBind : {
		menubutton : false
	}
});

var imgViewer = null;


mui.plusReady(function(){
	//resetPage();
	snapIt.common.on('.add-item-btn', 'tap', addItem);
	snapIt.common.on('.take-image-btn', 'tap', takeImage);
	snapIt.common.on('.clear-history-btn', 'tap', cleanHistory);

	// image viewer page
	imgViewer = mui.preload(snapIt.common.page('imgViewer', {popGesture:'none'}));
	
	imageListElement=document.getElementById("image-list-element");
	emptyElement=document.getElementById("empty-element");
});


function resetPage(){
	$('#addCategory').val('');
	$('#addTitle').val('');

	//imageListElement.empty();
	//imageListElement.innerHTML = '<li class="mui-table-view-cell ditem-empty">无历史记录</li>';

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
var imageListElement=null,emptyElement=null;
var imageList = [];

function takeImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage( function ( p ) {
		snapIt.common.alert( "成功："+p );
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
	imageListElement.innerHTML = '<li class="mui-table-view-cell ditem-empty">无历史记录</li>';
	emptyElement = document.getElementById( "empty-element" );
	
	imageList.clear();
	

	snapIt.common.alert( "清空拍照录像历史记录：" );
	gentry.removeRecursively( function () {
		// Success
		snapIt.common.alert( "成功！" );
	}, function ( e ) {
		snapIt.common.alert( "失败："+e.message );
	});
}
		
function createItem( entry ) {
	var li = document.createElement("li");
	li.className = "mui-table-view-cell image-item";
	li.innerHTML = '<a class="mui-navigate-right"></a>';
	li.setAttribute( "onclick", "showImgViewer(this);" );
	imageListElement.insertBefore( li, emptyElement.nextSibling );
	li.querySelector(".mui-navigate-right").innerText = entry.name;
	li.entry = entry;

	// 设置空项不可见
	emptyElement.style.display = "none";
	
	imageList.push(entry.name);
}
