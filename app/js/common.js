
$(function() {

	// 列表背景色
	$('.j-table').on('click', 'input[type="checkbox"]', function() {
		var array = sewise.common.getCheckedVal('.j-table');
		if(array.length > 0) {
			$('.j-removeBtn').removeClass('disabled');
		} else {
			$('.j-removeBtn').addClass('disabled');
		}
		if($(this).prop('checked')) {
			$(this).closest('tr').css('background', '#e1f8ff').addClass('bgblue');
		} else {
			$(this).closest('tr').css('background', '#fff').removeClass('bgblue');
		}
	});

	// 列表行中复选框点击阻止冒泡
	$('.j-table').on('click', '.j-checkbox', function(e) {
		e.stopPropagation();
	});


	// 全选、全不选
	$('.j-checkAll').click(function() {
		var flag = $(this).prop('checked');
		$(this).closest('table').find('input[type="checkbox"]').prop('checked', flag);
		if(flag) {
			$('.j-removeBtn').removeClass('disabled');
			$(this).closest('table').find('.j-table tr').css('background', '#e1f8ff').addClass('bgblue');
		} else {
			$('.j-removeBtn').addClass('disabled');
			$(this).closest('table').find('.j-table tr').css('background', '#fff').removeClass('bgblue');
		}
	});

});
	

(function(window, undefined) {


	sewise = window.sewise || {};

	// 通用
	sewise.common = {
		// 主机
		host: 'http://192.168.1.45:81/',
		// 输入框字符长度限制
		inputLengthLimit: function(el, min, max) {
			var min = min || 1,
				max = max || 10;
			var val = $.trim(el.val());
			if(val.length < min) {
				toastr['error']('请输入至少'+min+'个字符！');
				$(el).focus();
				return false;
			} else if(val.length > max) {
				toastr['error']('输入长度最多为'+max+'个字符！');
				$(el).focus();
				return false;
			} else {
				return true;
			}
		},
		formatDuration:function(duration){
            var buff=[];
            var timepart = ['小时','分','秒'];
            for(var i =0;i<timepart.length;i++){
            	
                var mod = Math.pow(60,2-i);
                var n = Math.floor(duration/mod);
                duration = duration%mod;
                if(n>0||buff.length>0) buff[buff.length] = n+timepart[i];
            }
            return buff.join('');
        },
		getUrlParams: function(paras) {
			var url = location.href;   
	        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");   
	        var paraObj = {}   
	        for (i=0; j=paraString[i]; i++){   
	            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);   
	        }   
	        var returnValue = paraObj[paras.toLowerCase()];   
	        if(typeof(returnValue)=="undefined"){   
	            return "";   
	        }else{   
	            return returnValue;   
	        }
		},
		getTime: function() {
			var date = new Date();
	        var year = date.getFullYear();
	        var month=String(date.getMonth()+1).length<2?'0'+(date.getMonth()+1):date.getMonth()+1;       //获取当前月份(0-11,0代表1月)
	        var day=String(date.getDate()).length<2?'0'+(date.getDate()):date.getDate();
	        var hours = String(date.getHours()).length<2?'0'+(date.getHours()):date.getHours();
	        var minutes = String(date.getMinutes()).length<2?'0'+(date.getMinutes()):date.getMinutes();
	        var seconds = String(date.getSeconds()).length<2?'0'+(date.getSeconds()):date.getSeconds();
	        var time=year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
	        return time;
		},
		getFormDatas: function(form){
			var params = {};
			form.find('input[name],textarea[name],select[name]').each(function(){
	            var tagname= $(this).attr('name');
	            var key=tagname;                    
	            var type = $(this).attr('type');                 
	            if((type=='radio'||type=='checkbox')&&$(this).prop('checked')==false){
	                return;
	            } else if(tagname=='') {
	                return;
	            } else if(tagname.substr(tagname.length-2,2)=='[]'){
	                key=tagname.substr(0,tagname.length-2);                     
	                if(!params[key])params[key]=[];
	                params[key].push($(this).val());
	            } else{                  
	                params[key]=$(this).val();
	            }
	        });
	        return params;
		},
		// 确认删除弹窗
		delete: function(callback) {
			$('.j-deleteModal').modal('show');
			$('.j-deleteModal').on('click', '.j-confirmBtn', function() {
				callback();
				$('.j-deleteModal').modal('hide');
				$('.j-removeBtn').addClass('disabled');
			});
		},
		// 搜索名称过滤列表
		search: function(callback) {
			$('.j-search').keyup(function() {
				var val = $.trim($(this).val());
				setTimeout(function() {
					callback(val);
				}, 1500);
			});
		},
		// sort升序降序
		sort: function(callback) {
			$('.j-sort').click(function() {
				var target = $(this).find('i');
				var key = $(this).data('key');
				if(target.hasClass('fa-sort-asc')) {
					target.removeClass('fa-sort-asc').addClass('fa-sort-desc');
					callback(key, 'desc');
				} else if(target.hasClass('fa-sort-desc')) {
					target.removeClass('fa-sort-desc').addClass('fa-sort-asc');
					callback(key, '');
				} else {
					$('.j-sort i').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
					target.removeClass('fa-sort').addClass('fa-sort-asc');
					callback(key, '');
				}
			});
		},
		// 获取选中的复选框的所有值
		getCheckedVal: function(el) {
			var array = [];
			$(el).find('input[type="checkbox"]').each(function(i, n) {
				if($(this).prop('checked')) {
					array.push($(this).val());
				}
			});
			return array;
		}
	};

	// 添加、保存、修改、删除频道
	sewise.channel = {
		add: function(el, iconStr) {
			// 添加频道
			var iconStr = iconStr || '';
			var addChannelStr = '<tr>' +
                    '<td class="j-checkbox"><input type="checkbox" name="channel[]"></td>'+
                    '<td>'+
                    	'<img class="icon60x40 mr10" src="/images/pages/default.png" alt="缩略图">'+
                    	'<span class="j-channelName"></span>'+
                    	'<input data-status="add" class="j-channelNameInput" type="text" value="未命名">'+
                    '</td>'+
                    '<td>'+ iconStr +'</td>'+
                  '</tr>';
			$('.j-addBtn').click(function() {
				$(el).prepend(addChannelStr).find('.j-channelNameInput').focus();
			});
		},
		save: function(el, cbAdd, cbUpdate) {
			// 添加频道输入框失去焦点保存
			$(el).on('blur', '.j-channelNameInput', function() {
				var returnObj = {};
				var obj = $(this);
				returnObj.val = $.trim($(this).val());
				returnObj.time = sewise.common.getTime();
				returnObj.id = $(this).closest('tr').attr('id');
					
				var flag = sewise.common.inputLengthLimit($(this), 1, 30);
				if(flag) {
					if($(this).data('status') == 'add') {
						cbAdd(returnObj, obj);
					} else {
						cbUpdate(returnObj, obj);
					}
				}
			});
		},
		edit: function(el) {
			// 修改频道名称
			$(el).on('click', '.j-channelName', function(e) {
				e.stopPropagation();
				$(this).hide().next('input').show().val($(this).text()).focus();
			}); 
		},
		delete: function(el, cb) {
			// 删除频道
			$('.j-removeBtn').click(function() {
				var string = sewise.common.getCheckedVal(el).join(',');
				if($(this).hasClass('disabled')) {
					return false;
				};
				sewise.common.delete(function() {
					cb(string);
				});
			});
		}
	};

	// 视频目录
	sewise.videoCatalog = {
		getCatalogUrl: sewise.common.host + '?mod=catalog&do=GetCatalog&id=0&output=json',
	    initModal: function() {
	    	$('.j-catalogModal').modal('show');
	    	$.get(this.getCatalogUrl, function(data) {
				$('.j-catalogModalList').html(sewise.videoCatalog.get(data.catalogData));
			}, 'json');
	    },
		addEvent: function(el, cb) {
			var id, val;
			// 展开、隐藏弹窗目录
			$(el).on('click', '.j-plus', function() {
				if($(this).hasClass('fa-plus-square-o')) {
					var id = $(this).closest('li').attr('class');
					var that = $(this);
					$.get(sewise.videoCatalog.getCatalogUrl, {'id': id}, function(data) {
						var buffer = '<ul>' + sewise.videoCatalog.get(data.catalogData) +'</ul>';
						that.removeClass('fa-plus-square-o');
						$('.'+id).append(buffer);
					}, 'json');	
				} else {
					$(this).addClass('fa-plus-square-o');
					$(this).closest('li').find('ul').remove()
				}
			});
			// 点击弹窗目录名称
			$(el).on('click', '.j-text', function() {
				$(el).find('.j-text').removeClass('blue');
				$(this).addClass('blue');
				id = $(this).closest('li').attr('class');
				val = $(this).text();
				
			});
			// 确定按钮
			$(el).on('click', '.j-confirmBtn', function() {
				$('.j-catalogModal').modal('hide');
				if(typeof cb == 'function') cb(id, val);
			});
		},
		get: function(files){
			var buffer = [];
			$.each(files,function(i, n) {
				buffer.push([
					'<li class="',n.id,'" data-text="',n.name,'">',
	                    '<p>',
	                      '<em class="fa fa fa-minus-square-o fa-plus-square-o mr5 j-plus"></em>',
	                      '<b class="j-text pointer">',n.name,'</b>',
	                    '</p>',
	                '</li>'
				].join(''));
			});
			return buffer.join('');
		}
	};

	// 分页
	sewise.pagination = {
		refresh: function(curPage, totalPage, pageWrap) {
			var pageWrap = pageWrap || '.pagination';
			curPage = (curPage < 1) ? 1 : curPage;
			curPage = (curPage > totalPage) ? totalPage : curPage;

			var buffer = [];
			var prevPageStr = '<a href="#" aria-label="Previous">'+
                      '<span aria-hidden="true">上一页</span>'+
                    '</a>'+
                  '</li>';
            var nextPageStr = '<a href="#" aria-label="Next">'+
                     '<span aria-hidden="true">下一页</span>'+
                    '</a>'+
                  '</li>';
            var disableStr = '<li class="disabled">';
            var liStr = '<li>';

            if(curPage == 1) {
            	prevPageStr = disableStr + prevPageStr;
            } else {
            	prevPageStr = liStr + prevPageStr;
            }

            if(curPage == totalPage) {
            	nextPageStr = disableStr + nextPageStr;
            } else {
            	nextPageStr = liStr + nextPageStr;
            }
            
            buffer.push(prevPageStr);
            if(totalPage<=10){
            for(var i = 1; i <= totalPage; i++) {
            	if(i == curPage) {
            		buffer.push('<li class="active"><a href="#">'+ i +'</a></li>');
            	} else {
            		buffer.push('<li><a href="#">'+ i +'</a></li>');
            	}
            }
            }else{
            	if(curPage<5){
            		for(var i = 1; i <= 5; i++) {
                    	if(i == curPage) {
                    		buffer.push('<li class="active"><a href="#">'+ i +'</a></li>');
                    	} else {
                    		buffer.push('<li><a href="#">'+ i +'</a></li>');
                    	}
                    }
            		buffer.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
            		buffer.push('<li><a href="#">'+ totalPage +'</a></li>');
            		
            		
            	}else if(curPage>totalPage-5){
            		buffer.push('<li><a href="#">1</a></li>');
            		buffer.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
            		for(var i = totalPage-5; i <= totalPage; i++) {
                    	if(i == curPage) {
                    		buffer.push('<li class="active"><a href="#">'+ i +'</a></li>');
                    	} else {
                    		buffer.push('<li><a href="#">'+ i +'</a></li>');
                    	}
                    }
            	}else{
            		buffer.push('<li><a href="#">1</a></li>');
            		buffer.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
            		for(var i = (curPage-2);i<=parseInt(curPage)+2; i++) {
                    	if(i == curPage) {
                    		buffer.push('<li class="active"><a href="#">'+ i +'</a></li>');
                    	} else {
                    		buffer.push('<li><a href="#">'+ i +'</a></li>');
                    	}
                    }
            		buffer.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
            		buffer.push('<li><a href="#">'+ totalPage +'</a></li>');
            	}
            }
            buffer.push(nextPageStr);

            $(pageWrap).html(buffer.join(''));
		},
		change: function(callback, el) {
			var el = el || '.j-pagination';
			$(el).on('click', 'li', function() {
				var curPage = Number($(this).closest('ul').find('li.active').text());
				var text = $(this).text();
				if(text == '上一页') {
					curPage = curPage - 1;
				} else if(text == '下一页') {
					curPage = curPage + 1;
				} else {
					curPage = text;
				}
				callback(curPage);
			});
		}
	}

})(window);
