

var beginTime,
	daily_carousel,
	epgList = [],
	flagCheck = false,
	curObj = {};


$(function() {

	var host = sewise.common.host;
	var getListUrl = host + '?mod=program&do=getProList&output=json',
		addChannelUrl = host + '?mod=program&do=program&op=add&description=&daily_carousel=0&start=&end=',
		updateChannelUrl = host + '?mod=program&do=program&op=mod&description=&start=&end=',
		getStatusUrl = host + '?mod=program&do=program&op=get&purpose=detail',
		getParamsUrl = host + '?mod=program&do=checkPro',
		getVideoListUrl = host + '?mod=resource&output=json&catalog=',
		getResultUrl = host + '?mod=program&do=getProOut',
		getSchedulelUrl = host + '?mod=program&do=getSchedule',
		deleteChannelUrl = host + '?mod=program&do=program&op=del',
		deleteOneScheduleUrl = host + '/?mod=program&do=program&op=saveEpg',
		transcodeUrl = host + '?mod=resource&do=tranCustom',
		transcodeStatusUrl = host + '?mod=resource&op=get&output=json',

		publishChannelUrl = host + '?mod=program&do=program&op=havePublishDate',
		publishPauseUrl = host + '?mod=program&do=program&op=unpub',
		pushChannelUrl = host + '?mod=program&do=program&op=startpush',
		pushPauseUrl = host + '?mod=program&do=program&op=stoppush',
		pubUrl = host + '/?mod=program&do=program&op=pub';


	var currentSort = '',
		currentQuery,
		currentQueryVideo = '',
		currentKey = 'name',
		scheduleDatas,
		initDatas;

	var init = function(page) {
		var curPage = page || 1;
		$.get(getListUrl, {'page': curPage, 'q': currentQuery, 'pattern': currentSort}, function(data) {
			initDatas = data.programs.record;
			refreshList(data.programs.record);
			// 分页样式
			if(data.programs.record.length > 0) {
				sewise.pagination.refresh(curPage, data.programs.total_page);
			} else {
				$('.pagination').html('');
			}
		}, 'json');
	};
	init();


	// ============================  预览频道 ============================
	$('.j-channelList').on('click', '.j-previewBtn', function() {
		var selector = (curObj.daily_carousel == 0) ? '.j-scheduleList' : '.j-carouselList'; 
		var sourceid = $(this).closest('tr').find(selector).find('tr').eq(0).data('sourceid');
		if(sourceid){
			var url="http://192.168.1.45:5080/vlive/preview/"+sourceid+".m3u8";  
			player.toPlay(url, "", 0, true);
		} else {
			toastr['error']('请您先添加节目列表');
		}
	});

	// ============================  检查频道 ============================

	// 提示
	$('.j-channelList').on('mouseenter', '.j-popoverBtn', function() {
		$(this).popover({
	    	placement:"right",
	    	html:true,
	    	content:'<p><button class="btn btn-default w100 j-transcodeBtn">转码</button>'+
	    			'<button class="btn btn-default j-deleteBtn">删除文件</button></p>'
		});
	});

	// 转码按钮
	$('.j-channelList').on('click', '.j-transcodeBtn', function() {
		var sourceid = $(this).closest('tr').data('sourceid');
		var that = $(this),
			ext = that.closest('tr').data('ext');
		if(index == -1 || ext == 'ts' || ext == 'npegts' || !ext) {
			toastr['error']('该文件格式不符合转码格式，请您删除');
			return false;
		}

		// 定时器请求转码状态
		var interval_transcode = function() {
			$.get(transcodeStatusUrl, {'sourceid': sourceid}, function(data) {
				// 转码中
				if(data.status == 0) {
					
				} 
				// 转码成功
				else if(data.status == 2) {
					that.closest('tr').find('.j-spinnerIcon').addClass('none');
					clearInterval(interval_transcode);
				}
				// 转码失败
				else {
					that.closest('tr').find('.j-errorSign').addClass('red').end()
						.find('.j-popoverBtn').removeClass('none').end()
						.find('.j-spinnerIcon').addClass('none');
					clearInterval(interval_transcode);
				}
			},'json');
		};

		$.post(transcodeUrl, {'sourceids': sourceid, 'dimension': curObj.dimension, 'bitrate': curObj.bitrate, 'framerate': curObj.framerate}, function(data) {
			// 修改样式为转码中
			that.closest('tr').find('.j-errorSign').removeClass('red').end()
				.find('.j-popoverBtn').trigger('click').addClass('none').end()
				.find('.j-spinnerIcon').removeClass('none');
			setInterval(interval_transcode(), 5000);
		}, 'json');
	});


	// ============================  编辑频道 ============================

	// 编辑频道按钮
	$('.j-channelList').on('click', '.j-editBtn', function() {
		var id = $(this).closest('tr').prev('tr').attr('id');
		var name = $(this).closest('tr').prev('tr').data('name');
		window.location.href = '/control/schedule.html?id=' + id + '&name=' + name;
	});


	// ============================  发布频道、推流 ============================
	// 发布频道
	$('.j-channelList').on('click', '.j-publishBtn', function() {
		var id = $(this).closest('tr').prev('tr').attr('id');
		var hasError = $(this).closest('tr').find('.j-errorSign').hasClass('red'),
			that = $(this);
		if(!flagCheck) {
			toastr['error']('请先检查频道');
		} else if(hasError) {
			toastr['error']('请先将不匹配的视频文件删除或者转码');
		} else {
			$(this).hide().next('button').show();
			$(this).parent().find('.j-pushBtn').attr('disabled', false);
			$.post(publishChannelUrl, {'id': id}, function(data) {
				if(data.success) {
					if(data.have == 1 || data.have == 2) {
						that.closest('tr').prev('tr').find('.j-playIcon').addClass('green');
					} else {
						pub(id);
					}
				}
			}, 'json');
		}
	});
	function pub(id) {
		// var id = id || programs.join(',');
		$.ajax({
			url : pubUrl,
			type : 'post',
			dataType : 'json',
			data : {
				type : 1,
				programs : id
			},
			success : function(data) {
				if (data.success) {
					window.history.go(0);
				} else {
					toastr['error'](data.errors);
				}
			},
			error : function() {
				toastr['error']('请检查网络');
			}
		})
	}

	// 停止发布
	$('.j-channelList').on('click', '.j-publishPauseBtn', function() {
		var id = $(this).closest('tr').prev('tr').attr('id');
		var that = $(this);
		$(this).hide().prev('button').show();
		$.post(publishPauseUrl, {'type': 0, 'programs': id}, function(data) {
			if(data.success) {
				that.closest('tr').prev('tr').find('.j-playIcon').removeClass('green');
			} else {
				toastr['error'](data.errors);
			}
		}, 'json');
	});
	// 推流
	$('.j-channelList').on('click', '.j-pushBtn', function() {
		var pushUrl = $(this).closest('tr').find('.j-resultPushText').val().trim();
		var id = $(this).closest('tr').prev('tr').attr('id');
		if(pushUrl) {
			$(this).hide().next('button').show();
			$.post(pushChannelUrl, {'id': id, 'pushUrl': pushUrl}, function(data) {
				toastr['success']('推流成功');
			}, 'json');
		} else {
			toastr['error']('请输入推流地址');
		}
	});
	// 停止推流
	$('.j-channelList').on('click', '.j-pushPauseBtn', function() {
		var id = $(this).closest('tr').prev('tr').attr('id');
		$(this).hide().prev('button').show();
		$.post(publishPauseUrl, {'programs': id}, function() {

		}, 'json');
	});





	// ============================  频道状态 ============================

	// 频道状态选项卡点击
	$('.j-channelList').on('click', '.j-statusTab' ,function(){
		var id = $(this).closest('tr').prev('tr').attr('id');
		var statusForm = $(this).closest('tr').find('.j-channelStatusForm'),
			that = $(this);
		$.post(getStatusUrl, {'id': id}, function(data) {
			var datas = curObj = data.record[0];
			// 播出中
			if(datas.status == '1') {
				that.closest('tr').find('.j-playIcon').addClass('none').next().removeClass('none');
			} else {
				that.closest('tr').find('.j-playIcon').removeClass('none').next().addClass('none');
			}
			// 插播中
			if(datas.current_play && datas.current_play.intercut) {
				that.closest('tr').find('.j-intercutIcon').addClass('none').next().removeClass('none');
			} else {
				that.closest('tr').find('.j-intercutIcon').removeClass('none').next().addClass('none');
			}
			// 推流中
			// if(datas.push_status == '2' || datas.push_status == '1') {
			// 	that.closest('tr').find('.j-pushIcon').removeClass('none');
			// }
			showChannelStatus(datas, statusForm);
		}, 'json');
	});

	// 显示频道状态
	var showChannelStatus = function(files, form) {
		var definition = form.find('input[name="definition"]');
		$.each(files, function(i, n) {
			if(i == 'daily_carousel') {
				n = (n == 1) ? '轮播': '直播';
			}
			if(i == 'bitrate') {
				n = (!n) ? '' : n + 'kbps';
			}
			if(i == 'framerate') {
				n = (!n) ? '' : n + 'fps';
			}
			if(i == 'dimension') {
				if(n == '640x360') {
					definition.val('流畅');
				} else if(n == '854x480') {
					definition.val('标清');
				} else if(n == '1280x720') {
					definition.val('高清');
				} else {
					definition.val('自定义');
				}
			}
			form.find('input[name="'+i+'"]').val(n);
		});
	};

	// 获取频道状态
	var getChannelStatus = function(form) {
		var datas = sewise.common.getFormDatas(form);
		datas.bitrate = datas.bitrate.slice(0,-4);
		datas.framerate = datas.framerate.slice(0,-3);
		return datas;
	};

	// ============================  结果输出 ============================

	// 结果输出选项卡点击
	$('.j-channelList').on('click', '.j-resultTab' ,function(){
		var id = $(this).closest('tr').prev('tr').attr('id');

		$.get(getResultUrl, {'id': id}, function(data) {
			var datas = data.record;
			var jsText = decodeURIComponent(datas.playerjs);
			jsText = jsText.replace(/\+/g, ' ');
			$('.j-resultPullText').val(datas.pull.url);
			$('.j-resultPlayerText').val(jsText);
		}, 'json');
	});

	// 复制播放器代码按钮
	$('.j-channelList').on('click', '.j-copyBtn' ,function(){
		var val = $('.j-channelList').find('.j-resultPlayerText').val();
		var clip=new ZeroClipboard(document.getElementById("copyBtn"), {
		  	moviePath: '/plugins/zeroclipboard/dist/ZeroClipboard.swf'
		});
		clip.setText(val);
		clip.on("complete",function(client,args){
			toastr['success']('复制成功');
		});
	});
	

	// ============================  频道参数 ============================

	// 频道参数选项卡点击
	$('.j-channelList').on('click', '.j-paramsTab' ,function(){
		var programid = $(this).closest('tr').prev('tr').data('programid');
		$.post(getParamsUrl, {'pid': programid}, function(data) {
			var datas = data.record;
			if(datas.length > 0) {
				if(datas.length > 3) {
					datas.length = 3;
				}
				showChannelParams(datas);
				$('.j-channelList').find('input[type="radio"]').eq(0).attr('disabled', false);
			}
		}, 'json');
	});

	var showChannelParams = function(files) {
		var buffer = [];
		var tipStr = '<p class="mb5">以下是节目列表中出现频率最高的三种样本，请选择一个作为此频道的参数。</p>';
		buffer.push(tipStr);
		$(files).each(function(i, n) {
			n.pic = (n && n.pic) ? (host + n.pic) : '';
			buffer.push([
				'<img data-dimension="',n.dimension,'" data-bitrate="',n.bitrate,'" data-framerate="',n.framerate,'"',
				'class="mr10 icon100x60 j-choiceParams" src="',n.pic,'" alt="缩略图">'].join(''));
		});
		$('.j-channelList').find('.j-paramsContent1').html(buffer.join(''));
	}
	
	// 频道参数单选框选择
	$('.j-channelList').on('change', 'input:radio', function() {
		if($(this).val() == 1) {
			$('.j-paramsContent2').find('button').addClass('disabled');
		} else {
			$('.j-paramsContent2').find('button').removeClass('disabled');
		};
	});


	// 频道参数具体选择
	$('.j-channelList').on('click', '.j-choiceParams', function() {
		var id = $(this).closest('tr').prev('tr').attr('id');
		var tagName = $(this).get(0).tagName.toLowerCase(),
			custom = 1,
			time = sewise.common.getTime(),
			statusForm = $(this).closest('tr').find('.j-channelStatusForm');

		var obj = {};
			obj.dimension = $(this).data('dimension');
			obj.bitrate = $(this).data('bitrate');
			obj.framerate = $(this).data('framerate');

		if(tagName == 'button') {
			custom = 1;
			$('.j-paramsContent1').find('img').css('border', '0');
			$(this).addClass('active').siblings('button').removeClass('active');
		} else if (tagName == 'img') {
			custom = 0;
			$('.j-channelList').find('input[type="radio"]').eq(0).attr('checked', true);
			$('.j-paramsContent2').find('button').addClass('disabled');
			$(this).css('border', '2px solid #22a9e6').siblings('img').css('border','0');
		}
		showChannelStatus(obj, statusForm);
			
		// 提交表单	
		var datas = getChannelStatus(statusForm);
		datas.custom = custom;
		datas.hidden_pid = id;
		datas.daily_carousel = scheduleDatas.daily_carousel;
		$.post(updateChannelUrl, datas, function(data) {
			curObj = datas;
			curObj.id = id;
		}, 'json');
	});


	// ============================  列表详情 ============================

	// 循环播放操作
	var dailyCarousel = function(flag) {
		if(flag==0) {
			EPGList2.render('.j-scheduleList');
			$('.j-scheduleListWrap').removeClass('none');
			$('.j-carouselListWrap').addClass('none');
	        //编排节目上边的日期选择
	        WeekComponet.render('.j-scheduleDate', 4, function (date) {
	            EPGList2.refresh(date);
	        });
	    }else{
	    	EPGList2.render('.j-carouselList');
	    	$('.j-scheduleListWrap').addClass('none');
			$('.j-carouselListWrap').removeClass('none');
			EPGList2.refresh();
	    }
	}

	var scheduleListType = function(id) {
		$.post(getSchedulelUrl, {'id': id}, function(data) {
			scheduleDatas = data;
			epgList = data.epgList;
			daily_carousel = data.daily_carousel;
			if(data.epgList.length > 0) {
				beginTime = data.epgList[0].play_date;
			}
			if(data.epgList.length > 0) {
				$('.j-noSchedule').addClass('none');
				if(data.daily_carousel=='0') {	
					dailyCarousel(0);
			    } else {
			    	dailyCarousel(1);
				}
		    } else {
		    	EPGList2.init();
		    	$('.j-noSchedule').removeClass('none');
		    	$('.j-scheduleListWrap').addClass('none');
				$('.j-carouselListWrap').addClass('none');
		    }
		}, 'json');
	};

	// 点击列表展开详情
	$('.j-channelList').on('click', '.j-list', function() {
		var id = $(this).attr('id');
		var html = $('.j-listDetail').html(),
			flag = $(this).next('tr').hasClass('control'),
			listDetailStr = '<tr class="control"><td colspan="3">' + html +'</td></tr>',
			isPlay = $(this).find('.j-playIcon').hasClass('green'),
			isPush = $(this).find('.j-pushIcon').hasClass('icon-pushLight');
		
		$('.j-channelList').find('tr.control').remove();

		if(flag) {
			$(this).next('tr.control').remove();
		} else {
			$(this).after(listDetailStr);
			// 判断是否选择频道参数
			$(this).next('tr').find('.j-statusTab').trigger('click');
			// 播出状态
			if(isPlay) {
				$('.j-publishBtn').hide().next('button').removeClass('none');
				$('.j-pushBtn').prop('disabled', false);
			} else {
				$('.j-publishBtn').show().next('button').addClass('none');
				$('.j-pushBtn').prop('disabled', true);
			}
			// 推流状态
			if(isPush) {
				$('.j-pushBtn').addClass('none').next('button').removeClass('none');
			} else {
				$('.j-pushBtn').removeClass('none').next('button').addClass('none');
			}


			scheduleListType(id);

			// 播放器加载
			dowReady();
		}
	});




	// 列表数据dom结构
    var refreshList = function(files) {
		var buffer = [];
		var pushClass = 'icon-intercut',
			playClass = '',
			publishTip = '未发布',
			intercutTip = '无插播';
		$(files).each(function(i,n){
			// if(n.push_status == 2 || n.push_status == 1) {
			// 	pushClass = 'icon-intercutLight';
			// } else {
			// 	pushClass = 'icon-intercut';
			// }
			playClass = (n.status == 1) ? 'green' : '';
			publishTip = (n.status == 1) ? '已发布' : '未发布';
			// intercutTip = (n.status == 1) ? '已插播' : '无插播';
			buffer.push(
				['<tr class="j-list" id="',n.id,'" data-index="',i,'" data-programid="',n.programid,'" data-name="',n.name,'">',
                    '<td class="j-checkbox"><input type="checkbox" name="channel[]" value="',n.id,'"></td>',
                    '<td><img class="icon60x40 mr10" src="/images/pages/default.png" alt="缩略图">',
                    	'<span class="j-channelName pointer">',n.name,'</span>',
                    	'<input class="j-channelNameInput none" type="text" value=""></td>',
                    '<td><i data-toggle="tooltip" data-placement="bottom" data-original-title="',publishTip,'" ',
                    	'class="fa fa-rss mr10 j-playIcon ',playClass,'"></i>',
                    	'<i data-toggle="tooltip" data-placement="bottom" data-original-title="',intercutTip,'" class="j-pushIcon ',pushClass,'"></i></td>',
                '</tr>'].join(''));
		});
		$('.j-channelList').html(buffer.join(''));
	};

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


	// ============================  频道添加、修改、保存、删除 ============================

	// 添加频道字符串
	// var addChannelStr = '<tr>' +
 //                    '<td class="j-checkbox"><input type="checkbox" name="channel[]"></td>'+
 //                    '<td>'+
 //                    	'<img class="icon60x40 mr10" src="/images/pages/default.png" alt="缩略图">'+
 //                    	'<span class="j-channelName"></span>'+
 //                    	'<input data-status="add" class="j-channelNameInput" type="text" value="未命名频道">'+
 //                    '</td>'+
 //                    '<td><i class="fa fa-rss mr10"></i><i class="icon-intercut"></i></td>'+
 //                  '</tr>';

 	// 添加频道中图标字符串
    var iconStr = '<i class="fa fa-rss mr10"></i><i class="icon-intercut"></i>';

    sewise.channel.add('.j-channelList', iconStr);

	sewise.channel.save('.j-channelList', function(obj) {
		$.get(addChannelUrl, {'name': obj.val, 'publish_time': obj.time, 'hidden_pid': ''}, function(data) {
			if(data.errors) {
				toastr['error'](data.errors);
			}
			init();
		}, 'json');
	}, function(obj) {
		$.get(updateChannelUrl, {'name': obj.val, 'publish_time': obj.time, 'hidden_pid': obj.id}, function(data) {
			init();
		}, 'json');
	});

	sewise.channel.edit('.j-channelList');

	sewise.channel.delete('.j-channelList', function(string) {
		$.post(deleteChannelUrl, {'programs': string}, function(data) {
			// 刷新
			init();
		}, 'json');
	});

	// 删除频道
	// $('.j-removeBtn').click(function() {
	// 	var string = sewise.common.getCheckedVal('.j-channelList').join(',');
	// 	sewise.common.delete(function() {
	// 		$.post(deleteChannelUrl, {'programs': string}, function(data) {
	// 			// 刷新
	// 			init();
	// 		}, 'json');
	// 	});
	// });

	// 添加频道
	// $('.j-addBtn').click(function() {
	// 	$('.j-channelList').prepend(addChannelStr).find('.j-channelNameInput').focus();
	// });


	// 添加频道输入框失去焦点保存
	// $('.j-channelList').on('blur', '.j-channelNameInput', function() {
	// 	var val = $.trim($(this).val()),
	// 		time = sewise.common.getTime(),
	// 		that = $(this),
	// 		id = that.closest('tr').attr('id');
	// 	var flag = sewise.common.inputLengthLimit($(this), 1, 30);
	// 	if(flag) {
	// 		if($(this).data('status') == 'add') {
	// 			$.get(addChannelUrl, {'name': val, 'publish_time': time, 'hidden_pid': ''}, function(data) {
	// 				init();
	// 			}, 'json');
	// 		} else {
	// 			$.get(updateChannelUrl, {'name': val, 'publish_time': time, 'hidden_pid': id}, function(data) {
	// 				init();
	// 			}, 'json');
	// 		}
	// 	}
	// });

	// 修改频道名称
	// $('.j-channelList').on('dblclick', '.j-channelName', function() {
	// 	$(this).hide().next('input').show().val($(this).text()).focus();
	// });  

});



var EPGList2 = (function(){
    var ct;
    var epgNodes = [];
    var removedNodes=[];
    var map = {};
    var miniDirty = -1;
    var reset = function(){
        var arr=epgNodes;
        map={};
        var current=null;
        var date = new Date();
        var time;
        if(beginTime) time = DateUtil.parse(beginTime).getTime();
        if(time<new Date().getTime()) time = new Date().getTime();
        $(arr).each(function(i,n){
            if(i>miniDirty) {
                date.setTime(time);
                n['play_date'] = DateUtil.getDateString(date);
            }else{
                time = DateUtil.parse(n['play_date']).getTime();
            }
            date.setTime(time);
            var datePart = DateUtil.getDatePart(date);
            if(current!=datePart){
                current=current||datePart;
                if(map[current]){
                    map[current][1]=i-1;
                    map[datePart]=[i];
                } 
                else map[datePart]=[i];
                current = datePart;
            }
            time+=(n.duration*1000+(n['cutduration']||0)*1000);
            n['index']=i;
        });
        
        if(current){
            map[current][1]=arr.length-1;
        } 
    };
    
	var epgNodeTemplate = new Ext.Template([
			'<tr id="{id}" dataindex="{index}" data-sourceid="{sourceid}" data-ext="{ext}" data-name="{name}" class="{disable}">',
                  '<td><span class="elimit15 dib j-errorSign {errorClass} {playing}" title="{name}">{name}</span>{infoStr}</td>',
                  '<td>{time}</td>',
                  '<td>{formatDuration}</td>',
            '</tr>']);

	var now = new Date().getTime();
	var dataFormat = function(data){
	    data = $.extend({},data);
	    var playDate = DateUtil.parse(data.play_date);
	    data['duration'] = data['duration'];
	    data['formatDuration'] = DateUtil.formatDuration(data.duration);
	    if(data.isCheck) {
	    	data.errorClass = 'red';
	    	data.infoStr = '<i class="fa fa-info-circle red j-popoverBtn" data-toggle="popover" title="该文件不符合频道参数，您可以做以下操作。"></i>' +
					'<i class="fa fa-spinner none j-spinnerIcon" data-toggle="tooltip" data-placement="bottom" data-original-title="正在转码中"></i>';
	    }
	    if((playDate.getTime()<now) && daily_carousel=='0' ||data.play) data.disable='gray';
	    data['time'] = DateUtil.getTimePart(DateUtil.parse(data.play_date));
	    // if(data['id'] && currentPlay==data['id']) data.playing='isplaying';
	    return data;
	};
	var getNodeByDate=function(date){
	    if(!map[date]) return [];
	    return epgNodes.slice(map[date][0],map[date][1]+1);
	};
	var refresh = function(date) {
	    if(daily_carousel=='0') {
	        date = date || WeekComponet.getCurrent();
	    }
	    var nodes = daily_carousel=='0'? getNodeByDate(date):epgNodes;
	    var buff = [];
	    var data =null;
	    var totalTime = 0;
	    var el;

		if($('.j-scheduleListWrap').hasClass('none')) {
			el = '.j-carouselList';
		} else {
			el = '.j-scheduleList';
		}

	    for (var i = 0; i < nodes.length; i++) {
	         data= dataFormat(nodes[i]);

	        totalTime+= nodes[i].duration*1;
	        if(data['intercut']){
	            //if(data.playing) data.playing='';
	            var playing = data.playing;
	            if(playing) data.playing='';
	            var intercut = $.parseJSON(data['intercut']);
	            var d = intercut.create_time - DateUtil.parse(data['play_date']).getTime()/1000;
	            data['duration'] = d;
	            buff[buff.length] = epgNodeTemplate.apply(data);
	            var now = new Date().getTime();
	            intercut['name'] = '(插播)'+intercut['name'];
	            if(now<(intercut.create_time*1000+intercut.duration*1000))
	                 intercut['playing']=playing;
	            intercut['disable'] = data.disable;
	            var date = new Date();
	            date.setTime(intercut['create_time']*1000);
	            intercut['time'] = DateUtil.getTimePart(date);
	            intercut['formatDuration'] = DateUtil.formatDuration(intercut.duration);
	            buff[buff.length] = epgNodeTemplate.apply(intercut);
	            
	            date.setTime(intercut.create_time*1000+intercut.duration*1000);
	            data['time'] = DateUtil.getTimePart(date);
	            if(now>(intercut.create_time*1000+intercut.duration*1000)) data['playing'] = playing;
	            buff[buff.length] = epgNodeTemplate.apply(data);
	        }else{
	            buff[buff.length] = epgNodeTemplate.apply(data);
	        }
	    }
	    $(el).html(buff.join(''));
	};
	var init = function() {
		// 删除文件按钮
		$('.j-channelList').on('click', '.j-deleteBtn', deleteClick);
		// 检查频道
		$('.j-channelList').on('click', '.j-checkBtn', checkClick);
		
	};
	return {
		render:function(el){
			// 清空数据，解绑事件
			epgNodes = [];
			$('.j-channelList').off('click', '.j-checkBtn', checkClick);
			$('.j-channelList').off('click', '.j-deleteBtn', deleteClick);
			flagCheck = false;

            ct = el;
           	init();
            if(epgList.length>0){
               for(var i =0;i<epgList.length;i++){
                   var data = epgList[i];
                   var node = {
                   	name:data.name,
                   	duration:data.duration*1,
                   	url:data.url,
                   	sourceid:data.sourceid,
                   	play:data.play*1,
                   	id:data.id,
                   	play_date:data.play_date,
                   	intercut:data.intercut,
                   	bitrate: data.bitrate,
                   	framerate: data.framerate,
                   	dimension: data.dimen,
                   	ext: data.ext
                   };
                   epgNodes[epgNodes.length] = node;
               }
               miniDirty = epgNodes.length-1;
            }
           reset();
           // refresh();
        },
		reset: reset,
		refresh: refresh,
		init: init
	}
		function checkClick () {
			flagCheck = true;
			var hasSchedule = (epgList.length > 0) ? true : false;
			if(!hasSchedule) {
				toastr['error']('请先编辑频道添加节目列表');
			} else if(!curObj.bitrate || !curObj.dimension | !curObj.framerate) {
				toastr['error']('请先选择频道参数');
			} else {
				var errorNum = 0;
				$(epgNodes).each(function(i, n) {
					if((n.dimension != curObj.dimension) || (n.framerate != curObj.framerate) || (n.bitrate != curObj.bitrate)) {
						n.isCheck = true;
						errorNum++;
					} else {
						n.isCheck = false;
					}
				});
				if(errorNum == 0) {
					toastr['success']('检查通过');
					return false;
				} 
				if(curObj.daily_carousel == 0) {
					reset();
					WeekComponet.render('.j-scheduleDate', 4, function(date) {
						refresh(date);
			        });
				} else {
					reset();
					refresh();
				}
			}	
		};
		function deleteClick() {
			var removeArrray = [],
				index = $(this).closest('tr').attr('dataindex'),
				buff = [];
			removeArrray.push($(this).closest('tr').attr('id'));
	       	$.ajax({
	            url: 'http://192.168.1.45:81//?mod=program&do=program&op=saveEpg',
	            type: 'post',
	            data: {
		            id: curObj.id,
		            epgdata: JSON.stringify({updated:[], removed: removeArrray}),
		            pubdate: sewise.common.getTime()
	            },
		      	dataType: 'json',
		      	success: function(data) {
			        if (data.success) {
			        	// var index = $(n).attr('dataindex')*1;
			            if(index<miniDirty) miniDirty = index-1;
			            buff[buff.length] = index;
			            // if(epgNodes[index].id) removedNodes[removedNodes.length] = epgNodes[index].id;
			            epgNodes = NodeUtils.remove(epgNodes,buff);
				        reset();
				        refresh();
			        } else {
			           toastr['error'](data.errors);
			        }
			    }
			});
		};

})();
