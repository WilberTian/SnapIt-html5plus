mui.init({
	keyEventBind : {
		backbutton : false
	}
});



mui.plusReady(function(){
	updateMenuHandler();
	

	window.addEventListener('updateMenuEvent', updateMenuHandler);
	
	snapIt.common.on('.all-category', 'tap', function(){
		snapIt.common.fire('list', 'updateListEvent', {category:''});
		snapIt.common.indexPage().evalJS("toggleMenu();");
	});
	
	snapIt.common.on('.specific-category', 'tap', function(){
		var $categoryEle = $(this).children(":first");
		var category = $categoryEle.text();
		
		snapIt.common.fire('list', 'updateListEvent', {category:category});
		snapIt.common.indexPage().evalJS("toggleMenu();");
	});
});


function updateMenuHandler(){
	var $ul = $('#menu-item-list').empty();
	snapIt.common.query(db, 'select category, COUNT(category) as numOfCategory from snap_it group by category', function(res){

		for (i = 0; i < res.rows.length; i++) {
			$ul.append(generateMenuItem(res.rows.item(i).category, res.rows.item(i).numOfCategory));
		}

		showMenuItemList($ul);
	});
}
function generateMenuItem(category, count){
	return '<li class="mui-table-view-cell specific-category"><span>' + category + '</span><span class="mui-badge mui-badge-purple">' + count + '</span></li>';
}

function showMenuItemList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();
}
