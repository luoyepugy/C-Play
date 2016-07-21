
$(function() {

	var host = sewise.common.host;
	var getListUrl = host + '?mod=log&output=json',
		deleteListUrl = host + '?mod=log';

	var currentType = 'all',
		currentQuery = '';

	// 分类
	$('#logTypes').change(function() {
		currentType = $(this).find('option:selected').val();
		init();
	});


	// 初始化加载
	var init = function(page, cbLogTypes) {
		var curPage = page || 1;
		$.get(getListUrl, {'page': curPage, 'q': currentQuery, 'logtype': currentType}, function(data) {
			var datas = data.logs.record;

			refreshList(datas);
			if(typeof cbLogTypes == 'function') cbLogTypes(data.logTypes);
			// 分页样式
			if(datas.length > 0) {
				sewise.pagination.refresh(curPage, data.logs.total_page);
			} else {
				$('.pagination').html('');
			}
		}, 'json');
	};
	init(1, function(datas) {
		// 日志分类
		var types = [];
		$.each(datas, function(i, n) {
			types.push(['<option value="',n,'">',n,'</option>'].join(''));
		});
		$('#logTypes').append(types.join(''));
	});

	


	// 删除
	$('.j-removeBtn').click(function() {
		var string = sewise.common.getCheckedVal('.j-logList').join(',');
		if($(this).hasClass('disabled')) {
			return false;
		};
		sewise.common.delete(function() {
			$.post(deleteListUrl, {op:'delete',logs: string}, function(data) {
				init();
			}, 'json');
		});
	});

	// 搜索
	sewise.common.search(function(val) {
		currentQuery = val;
		init();
	});

	// 分页点击事件
	sewise.pagination.change(function(page) {
		init(page);
	});


	// 列表数据dom结构
	var refreshList = function(files) {
		var buffer = [];
		$(files).each(function(i,n){
			buffer.push(
				['<tr>',
                    '<td><input type="checkbox" name="log[]" value="',n.id,'"></td>',
                    '<td>',n.action,'</td>',
                    '<td>',n.ip,'</td>',
                    '<td>',n.create_time,'</td>',
                    '<td><span class="elimit15 db" title="',n.note,'">',n.note,'</span></td>',
                  '</tr>'].join(''));
		});
		$('.j-logList').html(buffer.join(''));
	};

});