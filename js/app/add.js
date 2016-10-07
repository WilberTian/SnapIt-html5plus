mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false
	}
});


mui.plusReady(function(){
	//resetPage();
	snapIt.common.on('.add-item-btn', 'tap', addItem);
	snapIt.common.on('.get-image-btn', 'tap', getImage);
	snapIt.common.on('.clear-history-btn', 'tap', cleanHistory);
	
	
	imageListElement=document.getElementById("image-list-element");
	emptyElement=document.getElementById("empty-element");
});


function resetPage(){
	$('#addCategory').val('');
	$('#addTitle').val('');

	//imageListElement.empty();
	//imageListElement.innerHTML = '<li class="mui-table-view-cell ditem-empty">无历史记录</li>';

}

// 添加待办事项
function addItem(){
	var title = $.trim($('#addTitle').val());
	var category = $.trim($('#addCategory').val()) ? $.trim($('#addCategory').val()) : '未分类';
	var images = imageList.toString();
	
	if(!title){
		snapIt.common.alert('请填写待办事项标题！');		
	}else{
		snapIt.common.getPage('add').hide();
		resetPage();
		snapIt.common.fire('list', 'addItemEvent', {title:title, category:category, images:images});
		
		
	}
}

var gentry=null,w=null;
var imageListElement=null,emptyElement=null;
var imageList = [];

function getImage() {
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
	
	// 删除音频文件
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
	li.className = "mui-table-view-cell ditem";
	li.innerHTML = '<a class="mui-navigate-right"></a>';
	li.setAttribute( "onclick", "displayFile(this);" );
	imageListElement.insertBefore( li, le.nextSibling );
	li.querySelector(".mui-navigate-right").innerText = entry.name;
	li.entry = entry;

	// 设置空项不可见
	emptyElement.style.display = "none";
	
	imageList.push(entry.name);
}


function displayFile( li ) {
	if ( w ) {
		snapIt.common.alert( "重复点击！" );
		return;
	}
	if ( !li || !li.entry ) {
		snapIt.common.alert( "无效的媒体文件" );
		return;
	}
	var name = li.entry.name;
	var url = "/views/image_viewer.html";

	w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
	w.addEventListener( "loaded", function(){
		w.evalJS( "loadMedia('"+li.entry.toLocalURL()+"')" );
		//w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
	}, false );
	w.addEventListener( "close", function() {
		w = null;
	}, false );
	w.show( "pop-in" );
}