




var beginTime = sewise.common.getTime();


// 全局对象版EPG编排
//
//
//
//插件以及工具箱
function cYearFunc() {
  var dstr = $(this).val()
  FnBuilDaylist(dstr, minEpgDate, maxEpgDate)
}







var oload = [];
var EPGList = (function(){
    var ct;
    var epgNodes = [];
    var removedNodes=[];
    var map = {};
    var miniDirty =-1;
    var flag = false;
    var reset = function(){
        var arr=epgNodes;
        map={};
        var current=null;
        var date = new Date();
        var time;
        if(arr.length > 0) {
        	$('.j-startPlayTime').attr('disabled', true);
           	$('.j-dailyCarousel').attr('disabled', true);
        } else {
        	$('.j-startPlayTime').attr('disabled', false);
           	$('.j-dailyCarousel').attr('disabled', false);
        }
        if($('.j-startPlayTime').val()) {
        	beginTime = $('.j-startPlayTime').val();
        }
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
            // console.log(time);
            time+=(n.duration*1000+(n['cutduration']||0)*1000);
            n['index']=i;
        });
        
        if(current){
            map[current][1]=arr.length-1;
        } 
    };
    
	var epgNodeTemplate = new Ext.Template([
				'<tr dataindex="{index}" class="{disable}">',
                  '<td><input type="checkbox" name="schedule[]"></td>',
                  '<td><span class="elimit15 dib" title="{name}">{name}</span></td>',
                  '<td>{time}</td>',
                  '<td>{formatDuration}</td>',
                '</tr>']);


	var now = new Date().getTime();
	var dataFormat = function(data){
	    data = $.extend({},data);
	    var playDate = DateUtil.parse(data.play_date);
	    data['duration'] = data['duration'];
	    data['formatDuration'] = DateUtil.formatDuration(data.duration);
	    if((playDate.getTime()<now) && daily_carousel=='0' ||data.play) data.disable='gray';

	    data['time'] = DateUtil.getTimePart(DateUtil.parse(data.play_date));
	    if(data['id'] && currentPlay==data['id']) data.playing='isplaying';
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

	    for (var i = 0; i < nodes.length; i++) {
	         data= dataFormat(nodes[i]);
	         // 循环播放，播放时间段不显示
	         if(daily_carousel == 1) {
	         	data.time = '';
	         }

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

	    
	    // if(daily_carousel=='0'){
	       // if(data){
	           // var epgTime =  DateUtil.time2sec(data['time'])+(data['duration']*1);
	           
	       //  if(epgTime>=3600*24){
	       //      $('.schedu-right-top').prepend('<div class="time-tips" style="visibility:visible">' + $_LANG.playbill_24_hour + '</div>');
	       //      $('.schedu-righttop-title').hide();
	       //  }else{
	       //      $('.schedu-right-top .time-tips').remove();
	       //      $('.schedu-righttop-title .cd9:first').html(DateUtil.formatDuration(epgTime));
	       //      $('.schedu-righttop-title .cd9:last').html(DateUtil.formatDuration(Math.max(3600*24-epgTime,0)));
	       //      $('.schedu-righttop-title').show();
	       //  }
	       // }else{
	           //  $('.schedu-right-top .time-tips').remove();
	           // $('.schedu-righttop-title .cd9:first').html('0小时0分');
	           //  $('.schedu-righttop-title .cd9:last').html('24小时0分');
	       // }
	      
	        
	    // }else{
	        // $('.Carouselinfo em').html(DateUtil.formatDuration(totalTime));
	    // }
	    $(ct).html(buff.join(''));
	};


	var init=function(){
		flag = true;
	     //拖动排序事件.epg
	    $('.j-scheduleList, .j-carouselList').sortable({
	        axis : "y",
	        revert : false,
	        start : function() {
	        },
	        update : function(event, ui) {  
	            var oldPos = $(ui.item).attr('dataindex');
	            var newPos;
	            var prevEl = $(ui.item).prev('tr');
	            if(prevEl.length==0) newPos = $(ui.item).next('tr').attr('dataindex')*1;
	            else                 newPos = prevEl.attr('dataindex')*1+1;
	            if(newPos>oldPos) newPos--;
	            NodeUtils.move(epgNodes,oldPos,newPos);
	            if(newPos<miniDirty) miniDirty = newPos-1;
	            if(oldPos<miniDirty) miniDirty = oldPos-1;
	            reset();
	            refresh();
	            $(ct).find('[dataindex='+newPos+']').addClass('bgblue');
	        },
	        items : '> tr:not(.played):not(.disable)',
	        cancel : 'tr.locked,tr.disable,tr.played'
	    });
	    

	    //点击添加需要编排的节目到右边进行编排 即： 左边---到右边
	    $('.j-addBtn').click(function(argument) {
	        if ($('.j-videoList').find('tr.bgblue').size() > 0) {
	            var nodeList = [];
	            $('.j-videoList').find('tr.bgblue').each(function(i,n){
	                var data = oload[$(n).attr('itemIndex')];
	                nodeList[i] = {name:data.name,duration:data.duration*1,url:data.url,sourceid:data.sourceid,play:0}; 
	            });
	            EPGList.add(nodeList);
	        };
	    });

	    //节目编辑移除
	    $('.j-removeBtn2').click(function(argument) {
	        var buff=[];
	        var selector ;
	       if(daily_carousel=='0'){
	            selector = '.j-scheduleList .bgblue';
	       }else{
	           selector = '.j-carouselList .bgblue'; 
	       }

	         $(selector).each(function(i,n){
	             var index = $(n).attr('dataindex')*1;
	             if(index<miniDirty) miniDirty = index-1;
	             buff[buff.length] = index;
	             if(epgNodes[index].id) removedNodes[removedNodes.length] = epgNodes[index].id;
	         });
	         epgNodes = NodeUtils.remove(epgNodes,buff);
	         reset();
	         refresh();
	    });
	    //保存按钮
	    $('.j-saveBtn').one('click', function() {
	             //save
	             //alert(JSON.stringify(epgNodes));
	              $.ajax({
	                url: 'http://192.168.1.45:81/?mod=program&do=program&op=saveEpg',
	                type: 'post',
	                data: {
	                	id: proid,
	                	epgdata: JSON.stringify(EPGList.getData()),
	                	pubdate: beginTime,
	                	daily_carousel: daily_carousel
	                },
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) {
	          // alert($_LANG.congratulations + $_LANG.click_EPG_preview);
	          window.location.reload(); //刷新避免全局参数的污染
	        } else {
	          // showErrors(data.errors);
	           toastr['error']('保存失败')
	           window.location.reload();
	        }
	      }
	    });
	    });

	    //替换
	    // $('#replaceBtn').click(function() {
	    //     var target = $('.j-scheduleList .e-tbody-tr-selected');
	    //     var src;
	    //     if(daily_carousel=='0'){
	    //          src = $('#rightbox .e-tbody-tr-selected2');
	    //      }else{
	    //          src = $('#Carouselbox .e-tbody-tr-selected2');
	    //      }
	    //     if (target.length == 1 && src.length == 1) {
	    //         SwsTools.ConfirmWarn({
	    //             title : '提醒',
	    //             warning : '两视频时长不一致时，后面时间会自动调整',
	    //             desc : '<label><input type="checkbox">替换后面所有相同条目</lablel>',
	    //             suredo : function() {
	    //                 var data = oload[$(target).attr('itemIndex')];
	    //                 var node  = {name:data.name,duration:data.duration,url:data.url,sourceid:data.sourceid,play:0};
	    //                 EPGList.replace($(src).attr('dataindex')*1,node,$('#win-warning .j-info1 input:checkbox').prop('checked'));
	    //             }
	    //         });
	    //     } else {
	    //         SwsTools.AlertTips('请确保，左右两边均选中一个条目');
	    //     }
	    // });

	};

    return{
        render:function(el){
           ct = el;
           if(!flag) {
           	 init();
           }
           //initial data;
               if(epgList.length>0){
                   for(var i =0;i<epgList.length;i++){
                       var data = epgList[i];
                       var node = {name:data.name,duration:data.duration*1,url:data.url,sourceid:data.sourceid,play:data.play*1,id:data.id,play_date:data.play_date,intercut:data.intercut};
                       epgNodes[epgNodes.length] = node;
                   }
                   miniDirty = epgNodes.length-1;
               }

           reset();
           //alert(JSON.stringify(map));
           refresh();
        },
        reset: reset,
        refresh:refresh,
        add:function(nodeList){
          var target = $(ct).find('.j-scheduleList tr:last');
          var startIndex;
          if(target.length==0){
            startIndex = epgNodes.length;
            epgNodes = NodeUtils.append(epgNodes,nodeList);
              if(startIndex<miniDirty) miniDirty = startIndex;
           } else{
              startIndex = target.attr('dataindex')*1+1;
              if((startIndex-1)<miniDirty) miniDirty = startIndex-1;
             epgNodes = NodeUtils.insert(epgNodes,nodeList,target.attr('dataindex')*1);
           }

          reset();
          refresh();
          WeekComponet.go(DateUtil.getDatePart(DateUtil.parse(epgNodes[startIndex+nodeList.length-1].play_date)));
          for(var i = startIndex;i<startIndex+nodeList.length;i++){
              var c = $(ct).find('[dataindex='+i+']');
              // c.addClass('bgblue');
          }
          if($(ct).find('.bgblue:first').length){
              $(ct).find('.bgblue:first')[0].scrollIntoView();
          }
         // var c = $(ct).find('[dataindex='+i+']');
       },
       getData:function(){
          var epgdata={updated:[],removed:removedNodes};
           for(var i = miniDirty+1;i<epgNodes.length;i++){
               epgdata['updated'][epgdata['updated'].length] = epgNodes[i];
           }

           return epgdata;


       },
       replace:function(index,data,all){
           if((index-1)<miniDirty) miniDirty = index-1;
           var srcid = epgNodes[index]['sourceid'];
           epgNodes[index]=$.extend(epgNodes[index],data);
           if(all){
               for(var i =index+1;i<epgNodes.length;i++){
                   if(srcid==epgNodes[i]['sourceid'])     epgNodes[i]=$.extend(epgNodes[i],data);
               }

           }
           reset();
           refresh();
       }
    };
})();

	// 可用视频列表
    //显示视频列表--fn-build-html
    function listVideo(RecordCount, PageIndex, record, total) {
        oload=record;
        // $("#pager").setPager({
        //     RecordCount : RecordCount,
        //     PageIndex : PageIndex,
        //     buttonClick : PageClick
        // });
        // total = total ? total : 0;
        // var html = DomVirtualData(GbSec);
        var html = '';
        $(".j-videoList").html();
        if (record[0] && PageIndex == 1)
            lastRid = record[0]['id'];
        for (var p in record) {
            if ( typeof record[p] == 'function')
                continue;
            var name = record[p]['name'];
            var duration = record[p]['duration'];
            var duration_name = record[p]['duration_name'];
            var sourceid = record[p]['sourceid'];
            var played = record[p]['play'];
            //是否播放
            var url = record[p]['url'];
            var dimension = record[p]['dimension'];

            //name = name.replace(/(.{15}).*/im, '$1...'); //截取长度超过15个字符的字符串

            html += '<tr itemIndex="' + p + '">';
            html += '<td><input type="checkbox" name="schedule[]"></td>',
            html += '<td><span class="elimit15 dib" title="' + name + '">' + name + '</span></td>'
            html +=	'<td>' + dimension + '</td><td><em class="none">'+ duration+'</em>' + duration_name + '</td>';
            html += '</tr>';
        }
        $(".j-videoList").html(html);
    };























$(function() {

	// 地址
	var host = sewise.common.host;
	var getVideoListUrl = host + '?mod=program&do=program&op=getVideos&dimension=&&date=';
		


	var currentQuery,
		currentScheduleList = [];



	// 取消、返回按钮
	$('.j-backBtn').click(function() {
		window.location.href = '/control/channel.html';
	});


	// 初始化
	var init = function(page) {
		var curPage = page || 1;
		$.get(getVideoListUrl, {'programid': proid, 'page': curPage, 'keyword': currentQuery}, function(data) {
		// $.get('../js/pages/test.json', function(data) {
			refreshVideoList(data.record);
			// listVideo(data.total_page, data.page, data.record, data.total_record);

            oload = data.record;
			// 分页样式
			if(data.record.length > 0) {
				sewise.pagination.refresh(curPage, data.total_page);
			} else {
				$('.pagination').html('');
			}
		}, 'json');
	};
	init();


	// 获取分类信息
	$('.j-catalog').append(sewise.videoCatalog.get(catalog));
	sewise.videoCatalog.addEvent('.j-catalog', function(id, val) {
	    $.post(getVideoListUrl, {'catalogid': id, 'keyword': currentQuery}, function(data) {
	    	$('.j-catalog').addClass('none');
	    	$('.j-copySelect').find('span').text(val);
	    	refreshVideoList(data.record);
	    	// 分页样式
			if(data.record.length > 0) {
				sewise.pagination.refresh(1, data.total_page);
			} else {
				$('.pagination').html('');
			}
	    }, 'json');
	});
	$('.j-copySelect').click(function() {
		$(this).next('ul').toggleClass('none');
	});

	// 节目列表
	var refreshScheduleList = function(files) {
        var buffer = [];
		$(files).each(function(i,n){
			var time = sewise.common.getTime();
			n.play_date = time;
			buffer.push(
				['<tr id="',n.id,'">',
                  '<td><input type="checkbox" name="schedule[]"></td>',
                  '<td><span class="elimit15 dib" title="',n.name,'">',n.name,'</span></td>',
                  '<td>',n.play_date,'</td>',
                  '<td>',n.duration_name,'</td>',
                '</tr>'].join(''));
		});
		return buffer.join('');
	};

	// 视频列表
	var refreshVideoList = function(files) {
        var buffer = [];
		$(files).each(function(i,n){
			buffer.push(
				['<tr itemIndex="',i,'" id="',n.id,'">',
                    '<td><input type="checkbox" name="schedule[]"></td>',
                    '<td><span class="elimit15 dib" title="',n.name,'">',n.name,'</span></td>',
                    '<td>',n.dimension,'</td>',
                    '<td><em class="none">',n.duration,'</em>',n.duration_name,'</td>',
                  '</tr>'].join(''));
		});
		$('.j-videoList').html(buffer.join(''));
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


	// 选择开播时间
	jeDate({
	    dateCell:".j-startPlayTime",
	    format:"YYYY-MM-DD hh:mm:ss",
	    minDate: sewise.common.getTime(),
	    isinitVal:false,                //是否初始化时间
		isTime:true,                   //是否开启时间选择
		isClear:true,                  //是否显示清空
	});


	// 循环播放复选框
	$('.j-dailyCarousel').click(function() {
		var flag = $(this).prop('checked');
		if(flag) {
			daily_carousel = 1;
			dailyCarousel(1);
			$('.j-startPlayTime').attr('disabled', true);
		} else {
			daily_carousel = 0;
			dailyCarousel(0);
			$('.j-startPlayTime').attr('disabled', false);
		}
	});



	// 循环播放操作
	var dailyCarousel = function(flag) {
		if(flag==0) {
			EPGList.render('.j-scheduleList');
			$('.j-scheduleListWrap').removeClass('none');
			$('.j-carouselListWrap').addClass('none');
	        //编排节目上边的日期选择
	        WeekComponet.render('.j-scheduleDate', 4, function (date) {
	            EPGList.refresh(date);
	        });
	    }else{
	    	EPGList.render('.j-carouselList');
	    	$('.j-scheduleListWrap').addClass('none');
			$('.j-carouselListWrap').removeClass('none');
	    }
	}
	dailyCarousel(daily_carousel);


});