(function() {
	var root = this;
	root.snapIt = {};
	root.snapIt.common = {};
	root.db = null;
	
	snapIt.common.normalStyle = {
		top: '45px',
		bottom: 0
	};
	snapIt.common.normalPage = function(id, options) {
		var opt = $.extend({}, options, snapIt.common.normalStyle);
		return snapIt.common.page(id, {
			styles: opt
		});
	};
	snapIt.common.page = function(id, options) {
		var url = id + '.html';

		options.id = id;
		options.url = url;
		return options;
	};
	snapIt.common.getPage = function(id){                     
       return id ? plus.webview.getWebviewById(id) : null;
	};                                                        
	snapIt.common.indexPage = function() {
		return plus.webview.getWebviewById(plus.runtime.appid);
	};
	snapIt.common.show = function(id, ani, time, func) {
		if(id) plus.webview.show(id, ani, time, func);
	};
	snapIt.common.hide = function(id, ani, time) {
		if(id) plus.webview.hide(id, ani, time);
	};

	snapIt.common.on = function(obj, event, func) {
		$(document).off(event, obj).on(event, obj, func);
	};
	snapIt.common.fire = function(id, name, values) {
		mui.fire(snapIt.common.getPage(id), name, values);
	};

	// popover
	snapIt.common.pop = function() {
		mui('.mui-popover').popover('toggle');
	};

	snapIt.common.modaloptions = {
		title: 'title',
		abtn: '确定',
		cbtn: ['确定', '取消'],
		content: 'content'
	};
	snapIt.common.alert = function(options, ok) {
		var opt = $.extend({}, snapIt.common.modaloptions);

		opt.title = '提示';
		if(typeof options == 'string') {
			opt.content = options;
		} else {
			$.extend(opt, options);
		}

		plus.nativeUI.alert(opt.content, function(e) {
			if(ok) ok();
		}, opt.title, opt.abtn);
	};

	snapIt.common.confirm = function(options, ok, cancel) {
		var opt = $.extend({}, snapIt.common.modaloptions);

		opt.title = '确认操作';
		if(typeof options == 'string') {
			opt.content = options;
		} else {
			$.extend(opt, options);
		}

		plus.nativeUI.confirm(opt.content, function(e) {
			var i = e.index;
			if(i == 0 && ok) ok();
			if(i == 1 && cancel) cancel();
		}, opt.title, opt.cbtn);
	};

	snapIt.common.prompt = function(options, ok, cancel) {
		var opt = $.extend({}, snapIt.common.modaloptions);

		opt.title = '输入内容';
		if(typeof options == 'string') {
			opt.content = options;
		} else {
			$.extend(opt, options);
		}

		plus.nativeUI.prompt(opt.content, function(e) {
			var i = e.index;
			if(i == 0 && ok) ok(e.value);
			if(i == 1 && cancel) cancel(e.value);
		}, opt.title, opt.content, opt.cbtn);
	};

	// web sql
	snapIt.common.db = function(name, size) {
		var db_name = name ? name : 'db_snapIt';
		var db_size = size ? size : 2;

		return openDatabase(db_name, '1.0', 'db_snapIt', db_size * 1024 * 1024);
	};
	snapIt.common.update = function(db, sql) {
		if(db && sql) {
			db.transaction(function(tx) {
				tx.executeSql(sql);
			});
		}
	};
	snapIt.common.query = function(db, sql, func) {
		if(db && sql) {
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, results) {
					func(results);
				}, null);
			});
		}
	};

	snapIt.common.exit = function() {
		snapIt.common.confirm('确定要退出吗？', function() {
			plus.runtime.quit();
		});
	};
	
	db = snapIt.common.db();
})();