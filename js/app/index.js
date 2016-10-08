(function() {
	mui.init({
		subpages: [snapIt.common.normalPage('list')]
	});

	var main = null;
	var showMenu = false;
	var menu = null;
	var add = null;
	var detail = null;

	mui.plusReady(function() {
		// create table in db
		snapIt.common.update(db, 'create table if not exists snap_it (id unique, title, category, images)');

		setColor("#f7f7f7");

		// main page
		main = snapIt.common.indexPage();
		
		
		// menu page
		var menuoptions = snapIt.common.page('menu', {
			styles: {
				left: 0,
				width: '70%',
				zindex: -1
			}
		});
		menu = mui.preload(menuoptions);
		

		// add page
		add = mui.preload(snapIt.common.page('add', {
			popGesture: 'none'
		}));
		

		// detail page
		detail = mui.preload(snapIt.common.page('detail', {
			popGesture: 'none'
		}));
		
		// event listeners
		snapIt.common.on('.mui-icon-bars', 'tap', toggleMenu);
		snapIt.common.on('.add-page-btn', 'tap', function() {
			snapIt.common.show('add', 'slide-in-bottom', 300);
		});
		main.addEventListener('maskClick', toggleMenu);
		window.addEventListener('toggleMenuEvent', toggleMenu);

		// exit app
		mui.back = function() {
			if(showMenu) {
				closeMenu();
			} else {
				snapIt.common.exit();
			}
		};

	});

	// menu
	function toggleMenu() {
		if(showMenu) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	function openMenu() {
		if($('.add-page-btn').is(':visible')) {
			setColor("#333333");
			menu.show('none', 0, function() {
				main.setStyle({
					mask: 'rgba(0,0,0,0.4)',
					left: '70%',
					transition: {
						duration: 150
					}
				});

				showMenu = true;
			});
		}
	}

	function closeMenu() {
		setColor("#f7f7f7");
		main.setStyle({
			mask: 'none',
			left: '0',
			transition: {
				duration: 100
			}
		});

		showMenu = false;
		setTimeout(function() {
			menu.hide();
		}, 300);
	}

	function setColor(color) {
		if(mui.os.ios && color) plus.navigator.setStatusBarBackground(color);
	}
})();