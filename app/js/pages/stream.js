
$(function() {

	var host = sewise.common.host;
	var addStreamUrl = host + '?mod=live&do=add',
		updateStreamUrl = host + '?mod=live&do=update',
		getListUrl = host + '?mod=live&do=getLive',
		deleteStreamUrl = host + '?mod=live&do=delete',
		getStreamUrl = host + '?mod=Live&do=getLiveOne';

	var currentId,
		currentSort = '',
		currentKey = 'name',
		currentQuery,
		curObj = {},
		initDatas,
		curType = 0;
		


	// 初始化
	var init = function(page) {
		var curPage = page || 1;
		$.get(getListUrl, {'page': curPage, 'q': currentQuery, 'pattern': currentSort}, function(data) {
			initDatas = data.record;
			var datas =  data.record;
			refreshList(datas);
			// 分页样式
			if(datas.length > 0) {
				sewise.pagination.refresh(curPage, data.total_page);
			} else {
				$('.pagination').html('');
			}
		}, 'json');
	};
	init();


	// 排序点击事件
	sewise.common.sort(function(key, sort) {
		currentKey = key;
		currentSort = sort;
		init();
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


	// 列表
	var refreshList = function(files) {
		var buffer = [];
		var linkClass = '',
			linkTip = '未链接';
		$(files).each(function(i,n){
			linkClass = (n.status == 2) ? 'green': '';
			linkTip = (n.status == 2) ? '已链接': '未链接';
			buffer.push(
				['<tr class="j-list" id="',n.id,'" data-index="',i,'" data-addr="',n.addr,'" data-streamid="',n.streamid,'" data-name="',n.name,'">',
                    '<td class="j-checkbox"><input type="checkbox" name="channel[]" value="',n.id,'"></td>',
                    '<td><img class="icon60x40 mr10" src="/images/pages/default.png" alt="缩略图">',
                    	'<span class="j-channelName pointer">',n.name,'</span>',
                    	'<input class="j-channelNameInput none" type="text" value=""></td>',
                    '<td><i data-toggle="tooltip" data-placement="bottom" data-original-title="',linkTip,'" class="fa fa-link mr10 ',linkClass,'"></i></td>',
                '</tr>'].join(''));
		});
		$('.j-streamList').html(buffer.join(''));
	}

	// 点击列表展开详情
	$('.j-streamList').on('click', '.j-list', function() {
		var id = $(this).attr('id'),
			html = $('.j-listDetail').html(),
			flag = $(this).next('tr').hasClass('control'),
			listDetailStr = '<tr class="control"><td colspan="3">' + html +'</td></tr>',
			index = $(this).data('index');
		
		$(this).next().siblings('.control').remove();

		if(flag) {
			$(this).next('tr').remove();
		} else {
			$(this).after(listDetailStr);

			// 流名称和流地址
			$(this).next('tr').find('.j-streamName').val(initDatas[index].name);
			$(this).next('tr').find('.j-streamAddr').val(initDatas[index].url);

			// 播放器加载
			dowReady();

		}
	});


	// 点击流模式
	$('.j-streamList').on('click', 'input[name="mode"]', function() {
		var index = $(this).closest('tr').prev('tr').data('index');
		if($(this).val() == 0) {
			$(this).closest('form').find('.j-streamAddr').val(initDatas[index].url);
			curType = 0;
		} else {
			curType = 1;
			$(this).closest('form').find('.j-streamAddr').val(initDatas[index].addr);
		}
	});


	// 保存
	$('.j-streamList').on('click', '.j-saveBtn', function() {
		var parentTr = $(this).closest('tr');
		var name = parentTr.find('.j-streamName').val(),
			addr = parentTr.find('.j-streamAddr').val(),
			streamid = parentTr.prev('tr').data('streamid');
			// streamText = parentTr.prev('tr').find('.j-channelName');

		if(!name) {
			toastr['error']('请输入流名称');
		} else if(!addr) {
			toastr['error']('请输入流地址');
		} else {
			$.post(updateStreamUrl, {'name': name, 'streamid': streamid, 'addr': addr, 'type': curType}, function(data) {
				// streamText.text(name);
				init();
			}, 'json');
		}
	});


	// 流状态
	$('.j-streamList').on('click', '.j-statusTab', function() {
		var index = $(this).closest('tr').prev('tr').data('index');
		var status = initDatas[index].status;
		if(status == 0 || status == 1) {
			$(this).closest('tr').find('.j-linkIcon').removeClass('none').next().addClass('none');
		} else if(status == 2) {
			$(this).closest('tr').find('.j-linkIcon').addClass('none').next().removeClass('none');
		}
		$.each(initDatas[index], function(i, n) {
			$(this).closest('tr').find('.j-streamStatusForm').find('input[name="'+i+'"]').val(n);
		});
	});


	// ============================  预览 ============================
	$('.j-streamList').on('click', '.j-previewBtn', function() {
		var index = $(this).closest('tr').prev('tr').data('index');
		console.log(initDatas[index].url);
		if(initDatas[index].status == 2) {
			// player.toPlay('rtmp://live.hkstv.hk.lxdns.com/live/hks', "", 0, true);
			player.toPlay(initDatas[index].url, "", 0, true);
		} else {
			toastr['error']('当前流状态未链接，不可预览');
		}
	});


	// 添加实时流中图标字符串
    var iconStr = '<i class="fa fa-link mr10"></i>';

    sewise.channel.add('.j-streamList', iconStr);


    // 保存名称
	sewise.channel.save('.j-streamList', function(obj) {
		$.post(addStreamUrl, {'name': obj.val}, function(data) {
			init();
		}, 'json');
	});


	// sewise.channel.edit('.j-streamList');

	sewise.channel.delete('.j-streamList', function(string) {
		$.post(deleteStreamUrl, {'streams': string}, function(data) {
			// 刷新
			init();
		}, 'json');
	});



});