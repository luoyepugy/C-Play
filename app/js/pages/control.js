
var NodeUtils=(function(){
    return {
        append:function(arrSrc,arrDest){
          return arrSrc.concat(arrDest);  
        },
        insert:function(arrSrc,arrDest,index){
              
              arrSrc.splice.apply(arrSrc,[index+1,0].concat(arrDest));
              
              //arrSrc.splice(index,0,arrDest);
              return arrSrc;
        },
        remove:function(arr,index){
            index = [].concat(index);
            index.sort(function(a,b){return b-a;});
            $(index).each(function(i,n){
                arr.splice(n,1);
            });
            
            return arr;
        },
        swap:function(arr,index1,index2){
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return reset(arr);
        },
        move:function(arr,oldPos,newPos){
            arr.splice(newPos,0,arr.splice(oldPos,1)[0]);
            return arr;
        }
    };
})();

var WeekComponet = (function(){
    // init dayselect
    var maxWeek = 4;
    var currentWeek = 0;
    var ct;
   
    var weekTemplate = new Ext.Template('<li date="{date}"><p>{day}</p><p>{shortdate}</p></li>');
  
    var loadWeekDays = function(week,mute) {
    	// var val = $('.j-startPlayTime').val();
        var date = new Date();
        var start = date.getTime() + 7 * 3600 * 24 * 1000 * week;

        var buff = [];
        for (var i = 0; i < 7; i++) {
            // var start+i*3600*24*1000;
            date.setTime(start + i * 3600 * 24 * 1000);
            buff[buff.length] =weekTemplate.apply({day:DateUtil.getCNDay(date),shortdate:DateUtil.getShortString(date),date:DateUtil.getDatePart(date)}) ;
        }
        
        if(week==0) $(ct).find('.scrollPrev').addClass('dscrollPrev');
        else        $(ct).find('.scrollPrev').removeClass('dscrollPrev');
        
        if(week==(maxWeek-1)) $(ct).find('.scrollNext').addClass('dscrollNext');
        else        $(ct).find('.scrollNext').removeClass('dscrollNext');
        $(ct).find('ul').html(buff.join(''));
         currentWeek=week;
         if(mute) return;
        $(ct).find('ul>li:first').addClass('blue');
         fireSelectEvent();
    };
    
    var initEvent=function(){
        $(ct).on('click','.scrollWeek',function(ev){
            if($(this).hasClass('scrollPrev') && !$(this).hasClass('dscrollPrev')){
                loadWeekDays(--currentWeek);
            }
            if($(this).hasClass('scrollNext') && !$(this).hasClass('dscrollNext')){
                loadWeekDays(++currentWeek);
            }
           
        });
        $(ct).find('ul').on('click','li',function(ev){
            if($(this).hasClass('blue')) return;
            $(ct).find('ul>li').removeClass('blue');
            $(this).addClass('blue');
            fireSelectEvent();
        });
    };
    
    var fireSelectEvent = function(){
        if(typeof cb == 'function') cb($(ct).find('.blue').attr('date'));
    };
    
    
    return{
        render:function(el,weekNum,callback){
            ct=el;
            maxWeek = weekNum;
            cb=callback;
            initEvent();
            loadWeekDays(0);
        },
        getCurrent:function(){
            return $(ct).find('.blue').attr('date');
        },
        go:function(date){
            var startDate = new Date();
            startDate.setHours(0);
            var destDate = DateUtil.parse(date);
            destDate.setHours(1);
           if(DateUtil.getDatePart(destDate)==WeekComponet.getCurrent()) return;
            var week = Math.floor((destDate.getTime() - startDate.getTime())/(1000*3600*24)/7);
            if(week!=currentWeek)    loadWeekDays(week,true);
             $(ct).find('ul>li[date='+date+']').trigger('click');
        }
    };
})();

var DateUtil = (function() {
    var cnDayNames = ['日', '一', '二', '三', '四', '五', '六'];
    var zeroPrefix = function(num) {
        num = parseInt(num);
        if (num >= 10)
            return num;
        return '0' + num;
    };
    return {
        getDateString : function(date) {
            return this.getDatePart(date) + ' ' + this.getTimePart(date);
        },
        getDatePart:function(date){
           return  zeroPrefix(date.getFullYear()) + '-' + zeroPrefix(date.getMonth()+1) + '-' + zeroPrefix(date.getDate());
        },
        getShortString : function(date) {
            return zeroPrefix(date.getMonth(date)+1) + '-' + zeroPrefix(date.getDate(date));
        },
        getCNDay : function(date) {
            return '周' + cnDayNames[date.getDay()];
        },
        getTimePart:function(date){
           return zeroPrefix(date.getHours())+':'+ zeroPrefix(date.getMinutes())+":"+zeroPrefix(date.getSeconds()); 
        },
        time2sec:function(time){
           var temp = time.split(':');
           return temp[0]*3600+temp[1]*60+temp[2]*1 ; 
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
        parse:function(datestr){
            var matchs = datestr.match(/\d+/ig);
            if(matchs[1]) matchs[1] = matchs[1]*1-1;
            return new (Date.bind.apply(Date,[null].concat(matchs)));
        }
    };
})();