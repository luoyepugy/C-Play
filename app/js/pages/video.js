
$(function() {

	// 请求地址
	var host = sewise.common.host;
	var	getCatalogUrl = host + '?mod=catalog&do=GetCatalog&id=0&output=json',
	 	addCatalogUrl = host + '?mod=catalog&do=add',
	 	deleteCatalogUrl = host + '?mod=catalog&do=delete',
	 	editCatalogUrl = host + '?mod=catalog&do=UpdateName',
	 	getListUrl = host + '?mod=resource&output=json',
	 	resourceUrl = host + '?mod=resource';


	var currentId = '',
		currentSort = '',
		currentKey = 'name',
		currentQuery;

	// 上传视频
	var time = new Date();
	$('#file_upload').uploadify({
		'auto'             : true,
		'buttonClass'　　　 : 'btn-blue', 
		'buttonText'       : '上传视频',
		'formData'      : {
            'timestamp' :time,
            'token'     : $.md5('unique_salt'+time),
        },
		'queueID'       : 'queue',
		'swf'			: '/plugins/uploadify/uploadify.swf',
		'uploader'      : '/plugins/uploadify/uploadify.php',
		'onSelect':function(file) {
              var fileName = file.name;
              var ext = fileName.substring(fileName.lastIndexOf('.') + 1); // Extract EXT
              switch (ext.toLowerCase()) {
                  case 'avi':
                  case 'mp4':
                  case 'flv':
                  case 'ts':
                  case 'mov':
                      $('.j-uploadModal').modal('show');
                      break;
                  default:
                      _toastr("文件格式不符合要求！", "top-right", "warning", false);
                      $('#file_upload').uploadify('cancel');
                      break;
              }
          },
		'onUploadSuccess' : function(file, data) { console.log(data); }
	});


	// 移动目录文件
	$('.j-moveBtn').click(function() {
		var string = sewise.common.getCheckedVal('.j-videoList').join(',');
		if(!string) {
			toastr['error']('请选中要移动的文件！');
		} else {
			sewise.videoCatalog.initModal();
		}
	});
	// 删除目录文件
	$('.j-removeBtn').click(function() {
		var string = sewise.common.getCheckedVal('.j-videoList').join(',');
		if($(this).hasClass('disabled')) {
			return false;
		};
		sewise.common.delete(function() {
			$.post(resourceUrl, {op:'del',sidStr: string}, function(data) {
				if(data.success) {
					init();
				} else {
					toastr['error'](data.errors);
				}
			}, 'json');
		});
	});

	// 确认移动文件到指定目录
	sewise.videoCatalog.addEvent('.j-catalogModal', function(id, val) {
		var string = sewise.common.getCheckedVal('.j-videoList').join(',');
		$.post(resourceUrl, {op:'movecatagory',catalog: id, sidStr: string}, function(data) {
			$('.j-catalogModal').modal('hide');
			// 刷新
			init();
		}, 'json');
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

	// 排序点击事件
	sewise.common.sort(function(key, sort) {
		currentKey = key;
		currentSort = sort;
		init();
	});


	// 获取列表内容
	$('.j-catalogList').on('click', '.j-text b', function() {
		$('.j-catalogList').find('.j-text').removeClass('active');
		$(this).closest('.j-text').addClass('active');
		// 右侧导航
		var navStr = function(text) {
			return '<span class="j-rightNavText"><i class="mr5 ml5">&gt;</i>'+ text +'</span>';
		}
		var buffer = [];
		if($(this).closest('ul').attr('id') == null) {
			$(this).parents('li').each(function(i, n) {
				if($(n).data('text')) {
					buffer.unshift(navStr($(n).data('text')));
				}
			});
			$('.j-rightNav').find('.j-rightNavText').remove().end().append(buffer.join(''));
		} else {
			$('.j-rightNav').find('.j-rightNavText').remove().end().append(navStr($(this).text()));
		}
		// 右侧表格内容数据
		currentId = $(this).closest('li').attr('id');
		init();
	});

	var init = function(page) {
		var curPage = page || 1;
		$.get(getListUrl, {'catalog': currentId,'page': curPage, 'sort': currentKey, 'pattern': currentSort, 'q': currentQuery}, function(data) {
			var datas = data.resources.record;
			refreshList(datas);
			// 分页样式
			if(datas.length > 0) {
				sewise.pagination.refresh(curPage, data.resources.total_page);
			} else {
				$('.pagination').html('');
			}
		}, 'json');
	};
	init();

	// 列表数据dom结构
	var refreshList = function(files) {
		var buffer = [];
		$(files).each(function(i,n){
			switch(n.status) {
				case '0': n.status = '处理中';break;
				case '2': n.status = '准备就绪';break;
				case '-2': n.status = '处理失败';break;
			}
			buffer.push(
				['<tr>',
                    '<td><input type="checkbox" name="intercut[]" value="',n.sourceid,'"></td>',
                    '<td title="',n.name,'"><img class="icon60x40 mr10" src="',n.pic,'" alt="缩略图"><span class="elimit15 dib">',n.name,'</span></td>',
                    '<td>',n.ext,'</td>',
                    '<td>',n.create_time,'</td>',
                    '<td>',n.status,'</td>',
                    '<td><i class="fa fa-chevron-down fa-chevron-up pointer j-listDetailBtn"></i></td>',
                  '</tr>',
                  '<tr class="none j-listDetailContent">',
                    '<td colspan="1"></td>',
                    '<td colspan="2"><p>视频id: ',n.sourceid,'</p><p>分辨率：',n.dimension,'</p></td>',
                    '<td colspan="3"><p>视频时长: ',n.duration,'</p><p>碼率：',n.bitrate,'</p></td>',
                  '</tr>'].join(''));
		});
		$('.j-videoList').html(buffer.join(''));
	};


    // 展开、隐藏列表详细信息
	$('.j-videoList').on('click', '.j-listDetailBtn', function() {
		$(this).toggleClass('fa-chevron-down').closest('tr').next().toggleClass('none');
	});
	

	// 展开、隐藏所有视频目录
	$('.j-slide').click(function() {
		$(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
		$('.j-catalogList').toggle();
	});


	// 添加目录字符串
	var addCatalogStr = '<li class="">'+
			              '<span class="j-addCatalog pointer"><b class="fa fa-plus mr5"></b>添加目录</span>'+
			              '<p class="none">' +
			                '<input class="j-catalogNameInput" type="text" placeholder="输入目录名称" value="">'+
			                '<i class="fa fa-remove j-cancelBtn"></i>'+
			                '<i class="fa fa-check j-addBtn"></i></li>'+
			              '</p>'+
			        	'</li>';
	// 目录列表字符串
	var catalogStr = function(id, name) {
		var str = '<li id="'+id+'" data-text="'+name+'">'+
	        '<p class="j-text">'+
	          '<em class="fa fa fa-minus-square-o fa-plus-square-o mr5 j-plus"></em>'+
	          '<b class="pointer">'+name+'</b>'+
	          '<span class="none j-hoverBtns"><i class="fa fa-remove j-deleteBtn"></i><i class="fa fa-pencil j-editBtn"></i></span>'+
	        '</p>'+
	        '<p class="none">'+
	          '<input class="j-catalogNameInput" type="text" placeholder="输入目录名称" value="">'+
	          '<i class="fa fa-remove j-cancelBtn"></i>'+
	          '<i class="fa fa-check j-saveBtn"></i></li>'+
	        '</p>'+
	    '</li>';
	    return str;
    };

    // 初始化加载数据
	$.get(getCatalogUrl, function(data) {
		$('.j-catalogList').html(refreshCatalog(data.catalogData));
		$('.j-catalogList').append(addCatalogStr);
	}, 'json');

	

	// 数据循环目录结构
	var refreshCatalog = function(files) {
		var buffer = [];
		if(!files) {
			return '';
		}
		$.each(files,function(i, n) {
			buffer.push([
				'<li id="',n.id,'" data-text="',n.name,'">',
                    '<p class="j-text">',
                      '<em class="fa fa fa-minus-square-o fa-plus-square-o mr5 j-plus"></em>',
                      '<b class="pointer">',n.name,'</b>',
                      '<span class="none j-hoverBtns"><i class="fa fa-remove j-deleteBtn"></i><i class="fa fa-pencil j-editBtn"></i></span>',
                    '</p>',
                    '<p class="none">',
                      '<input class="j-catalogNameInput" type="text" placeholder="输入目录名称" value="">',
                      '<i class="fa fa-remove j-cancelBtn"></i>',
                      '<i class="fa fa-check j-saveBtn"></i></li>',
                    '</p>',
                '</li>'
			].join(''));
		});
		return buffer.join('');
	};


	// 展开、隐藏目录
	$('.j-catalogList').on('click', '.j-plus', function() {
		if($(this).hasClass('fa-plus-square-o')) {
			var id = $(this).closest('li').attr('id');
			var that = $(this);
			$.get(getCatalogUrl, {'id': id}, function(data) {
				var buffer = '<ul>' + refreshCatalog(data.catalogData) + addCatalogStr +'</ul>';
				that.removeClass('fa-plus-square-o');
				$('#'+id).append(buffer);
			}, 'json');	
		} else {
			$(this).addClass('fa-plus-square-o');
			$(this).closest('li').find('ul').remove();
		}
	});	


	// 显示、隐藏操作按钮
	$('.j-catalogList').on('mouseenter', '.j-text', function() {
		$(this).find('b').addClass('blue').end().find('.j-hoverBtns').removeClass('none');
	});	
	$('.j-catalogList').on('mouseleave', '.j-text', function() {	
		$(this).find('b').removeClass('blue').end().find('.j-hoverBtns').addClass('none');
	});	

	// 添加目录
	$('.j-catalogList').on('click', '.j-addCatalog',function() {
		$(this).addClass('none').next('p').removeClass('none');
	});
	$('.j-catalogList').on('click', '.j-addBtn', function() {
		var val = $.trim($(this).parent().find('input').val());
		var that = $(this);
		// 输入框长度限制
		var input = $(this).parent().find('input');
		var flag = sewise.common.inputLengthLimit(input);
		if(flag) {
			var parentId = $(this).parents('li').eq(1).attr('id');
			$.post(addCatalogUrl, {'parent': parentId, 'name': val}, function(data) {
				var str = catalogStr(data.id, val);
				that.closest('ul').prepend(str);
				that.parent().addClass('none').prev().removeClass('none');
				toastr['success']('添加成功');
			}, 'json');
			// 清空
			that.parent().find('input').val('');
		}
	});


	// 编辑目录名称
	$('.j-catalogList').on('click', '.j-editBtn', function() {
		var oldValue = $(this).closest('p').find('b').text();
		$(this).closest('p').addClass('none').next('p').removeClass('none').find('input').val(oldValue);	
	});

	// 删除目录
	$('.j-catalogList').on('click', '.j-deleteBtn', function() {
		var id = $(this).closest('li').attr('id');
		var that = $(this);
		sewise.common.delete(function() {
			$.post(deleteCatalogUrl, {'id': id}, function(data) {
				toastr['success']('删除成功');
				that.closest('li').remove();
			}, 'json');
		});
	});

	// 取消编辑
	$('.j-catalogList').on('click', '.j-cancelBtn', function() {
		$(this).parent().addClass('none').prev().removeClass('none');
		$(this).parent().find('input').val('');
	});

	// 保存目录
	$('.j-catalogList').on('click', '.j-saveBtn', function() {
		var newValue = $(this).parent().find('input').val();
		var id = $(this).closest('li').attr('id');
		var that = $(this);
		var input = $(this).parent().find('input');
		var flag = sewise.common.inputLengthLimit(input);
		if(flag) {
			$.post(editCatalogUrl, {'id': id, 'name': newValue}, function(data) {
				toastr['success']('保存成功');
				that.parent().addClass('none').prev().removeClass('none').find('b').text(newValue);
			}, 'json');
		}
	});


});