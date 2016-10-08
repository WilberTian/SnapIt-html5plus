mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false,
		
	},
	gestureConfig : {
		longtap:true
	}
});

var tapId = null;

mui.plusReady(function(){
	// get snap item list
	updateListHandler();
	
	// swipe to close menu
	window.addEventListener('swiperight', function(){
		snapIt.common.indexPage().evalJS("toggleMenu();");
	});
	
	// show item detail
	snapIt.common.on('#snap-item-list li', 'tap', function(){
		snapIt.common.fire('detail', 'displayItemDetail', {id:$(this).data('id')});
	});
	
	// edit item
	snapIt.common.on('.edit-item-btn', 'tap', function(){
		
		/*
		var $li = $(this).parent().parent();
		var id = $li.data('id');
		$li.remove();
		showList($('#snap-item-list'));
		
		snapIt.common.fire('menu', 'doneItem', {todoId:id});
		return false;
		*/
	});
	
	// longtap to delete item
	snapIt.common.on('#snap-item-list li', 'longtap', function(){
		tapId = $(this).data('id');
		snapIt.common.pop();
	});
	
	// 删除
	snapIt.common.on('.delete-item-btn', 'tap', deleteItemHandler);
	

	window.addEventListener('addItemEvent', addItemHandler);
	window.addEventListener('updateListEvent', updateListHandler);
});



function updateListHandler(event){
	qmask.show();

	var queryStr = '';
	if(event && event.detail.category !== '') {
		queryStr = ' where category = "' + event.detail.category + '"';
	}
	
	var $ul = $('#snap-item-list').empty();
	snapIt.common.query(db, 'select * from snap_it' + queryStr, function(res){
		for (i = 0; i < res.rows.length; i++) {
			$ul.append(generateListItem(res.rows.item(i)));
		}

		showList($ul);
	});
	
	qmask.hide();
}
function generateListItem(data){
	var id = data.id;
	var title = data.title;
	var category = data.category;
	var images = data.images;
	
	var li = 
		'<li class="mui-table-view-cell" id="todoli_' + id + '" data-id="' + id + '">' +
			'<div class="mui-slider-right mui-disabled">' + 
				'<a class="mui-btn mui-btn-primary edit-item-btn">编辑</a>' +
			'</div>' + 
			'<div class="mui-slider-handle">' + 
				'<div class="mui-media-body">' + 
					title + 
					'<p class="mui-ellipsis"><span class="mui-badge">'+category+'</span></p>' + 
				'</div>' + 
			'</div>' +
		'</li>';
		
	return li;
}
function showList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();	
}


function addItemHandler(event){

	var title = event.detail.title;
	var category = event.detail.category;
	var images = event.detail.images;
	
	snapIt.common.query(db, 'select max(id) mid from snap_it', function(res){
		var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
		snapIt.common.update(db, 'insert into snap_it (id, title, category, images) values (' + (id+1) + ', "' + title + '", "' + category + '", "' + images + '")');
		
		$('#snap-item-list').prepend(generateListItem({id:id+1, 'title':title, 'category': category, 'images':images})).show();
	});
	
	snapIt.common.fire('menu', 'updateMenuEvent');
}


function deleteItemHandler(){
	if(tapId){
		snapIt.common.update(db, 'delete from snap_it where id=' + tapId);
		snapIt.common.pop();
		updateListHandler();
		
		snapIt.common.fire('menu', 'updateMenuEvent');
	}
}