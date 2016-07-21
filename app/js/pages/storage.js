

$(function() {

	var host = sewise.common.host;
	var updateCatalogUrl = host + '?mod=fileimport&do=updateLubo',
		getCatalogUrl = host + '?mod=fileimport&do=getLuboList',
		deleteCatalogUrl = host + '?mod=fileimport&do=deleteLubo',
		getCatalogInfoUrl = host + '?mod=fileimport&do=getLubo',
		getListUrl = host + '?mod=fileimport&do=ListByLuboId',
		importListUrl = host + '?mod=fileimport&do=listfromurl',
		addCatalogUrl = host + '?mod=fileimport&do=addLubo';

	var listDatas = {},
		curImportId;


	// 验证表单
	$("#catalogModalForm").validate({
		rules: {
			'name': {
				required: true,
				maxlength: 30
			},
			'password': {
				required: true,
				minlength: 6
			},
			'user': {
				required: true
			},
			'addr': {
				required: true,
				url: true
			}
		},
		messages: {
			'name': {
				required: '请输入目录名称',
				maxlength: '目录名称最多30个字符'
			},
			'password': {
				required: '请输入密码',
				minlength: '请输入至少6位密码'
			},
			'user': {
				required: '请输入用户名'
			},
			'addr': {
				required: '请输入导入地址',
				url: '请输入正确的地址格式'
			}
		},
		submitHandler: function(form) {
			var params = sewise.common.getFormDatas("#catalogModalForm");
			params.addr = params.addr.slice(7);
			$.post(addCatalogUrl, params, function(data) {
				$('.j-addCatalogModal').modal('hide');
				init(true);
				toastr['success']('保存成功');
			}, 'json');
		}
	});


	// 修改目录
	$('.j-catalog').on('click', '.j-editBtn', function() {
		var id = $(this).closest('li').attr('id');
		var that = $(this);
		$('.j-addCatalogModal').find('input[name="id"]').val(id);
		$('.j-addCatalogModal').modal('show').find('h4').text('修改存储目录').end().find('form').attr('action', updateCatalogUrl);
		$.get(getCatalogInfoUrl, {'id': id}, function(data) {
			that.closest('li').data('addr', data.addr);
			$.each(data, function(i, n) {
				$('.j-addCatalogModal').find('input[name="'+i+'"]').val(n);
			});
		}, 'json');
	});

	// 新增目录
	$('.j-addCatalogBtn').click(function() {
		$('.j-addCatalogModal').modal('show').find('h4').text('新增存储目录');
	});

	
	// 选择目录弹窗
	$('.j-openCatalogModal').click(function() {
		// 获取弹窗目录
		sewise.videoCatalog.initModal();
		sewise.videoCatalog.addEvent('.j-catalogModal', function(id, val) {
			curImportId = id;
			$('.j-openCatalogModal').text(val);
		});
	});

	// 导入视频按钮
	$('.j-importBtn').click(function() {
		var array = sewise.common.getCheckedVal('.j-storageList');
		if(array.length == 0) {
			toastr['error']('请选中要导入的文件！');
		} else if(!curImportId) {
			toastr['error']('请选择要导入的目录');
		} else {
			$.ajax({
				type: 'POST',
				url: importListUrl,
				data: {'data': JSON.stringify({'catalog': curImportId,'files': array,'host': listDatas.host,'session': listDatas.session})},
				dataType:'json',
				success: function(data) {
					// window.location.href = '/media/video.html';
					toastr['success']('导入任务提交成功');
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	});

	// 搜索
	sewise.common.search(function(val) {
		var buffer = [];
		$(listDatas.files).each(function(i,n){
			var str = n.name;
			if(str.indexOf(val) == -1) {
				return true;
			} else {
				buffer.push(listDatas.files[i]);
			}
		});
		refreshList(buffer);
	});

	// 初始化目录
	var init = function(flag) {
		var flag = flag || false;
		$.get(getCatalogUrl, function(data) {
			refreshCatalog(data.record);
			if(flag) {
				$('.j-catalog li:last').find('b').click();
			} else {
				$('.j-catalog li:first').find('b').click();
			}
		}, 'json');
	};
	init();


	// 刷新目录
	var refreshCatalog = function(files) {
		var buffer = [];
        $(files).each(function(i, n) {
			buffer.push([
				'<li id="',n.id,'" data-addr="',n.addr,'">',
                  '<b class="dib elimit15 j-text">',n.name,'</b>',
                  '<span class="none j-hoverBtns"><i class="fa fa-remove j-deleteBtn"></i><i class="fa fa-pencil j-editBtn"></i></span>',
                '</li>'].join(''));
		});
		$('.j-catalog').html(buffer.join(''));
	};

	// 点击目录
	$('.j-catalog').on('click', '.j-text', function() {
		var id = $(this).closest('li').attr('id');
		var addr = $(this).closest('li').data('addr');
		$('.j-catalog li').removeClass('active');
		$(this).closest('li').addClass('active');
		$.get(getListUrl, {'id': id}, function(data) {
			listDatas = data;
			refreshList(data.files);
		}, 'json');
		// 存储路径
		$('.j-addrText').text(addr);
	});

	var refreshList = function(files) {
		var buffer = [];
        $(files).each(function(i, n) {
        	n.duration = sewise.common.formatDuration(n.duration);
			buffer.push([
				'<tr>',
                    '<td><input type="checkbox" name="storage[]" value="',n.fullname,'"></td>',
                    '<td title="',n.name,'"><img class="icon60x40 mr10" src="',n.pic,'" alt="缩略图">',n.name,'</td>',
                    '<td>mp4</td>',
                    '<td>',n.duration,'</td>',
                 '</tr>'].join(''));
		});
		$('.j-storageList').html(buffer.join(''));
	}

	// hover目录
	$('.j-catalog').on('mouseenter', 'li', function() {
		$(this).find('b').addClass('blue').end().find('.j-hoverBtns').removeClass('none');
	});
	$('.j-catalog').on('mouseleave', 'li', function() {
		$(this).find('b').removeClass('blue').end().find('.j-hoverBtns').addClass('none');
	});

	$('.j-catalog').on('click', '.j-deleteBtn', function() {
		var id = $(this).closest('li').attr('id');
		var that = $(this);
		sewise.common.delete(function() {
			$.get(deleteCatalogUrl, {'id': id}, function(data) {
				that.closest('li').remove();
			}, 'json');
		});
	});

});