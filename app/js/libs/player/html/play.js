 //var host="http://192.168.1.111/sewiseplayer_js_3.0.0/bin/"
var host="../data/"
		    var config={
  		    	elid:"con1",
  		    	autostart:true,
                 	url:host+"test.mp4",
                  // primary:"flash",
                  // url:"vod://192.168.1.23:8888/sourceid",
  		    	skin:"vodLight",
            autostart: true
           };
          
          $(document).ready(dowReady);

         var player;

         function dowReady() {
		   player = new Sewise.SewisePlayer(config);
		   
          
           
         player.on("playerReady",function(){
         	console.log("播放器准备好了");
         });
		/*
		 * 视频开始播放后回调的函数
		 */
		 player.on("start", function() {
		 	console.log("播放开始");
		 });
		 /*
		  * 视频播放前回调
		  */
		 player.on("beforePlay",function(){
		 	
		 });
		 /*
          *视频暂停播放后回调
         */
         player.on("pause",function(){
         	console.log("播放暂停");
         });
 
         /*
          *视频停止播放后回调
          */
         player.on("ended",function(){
         	console.log("播放停止");
         });
 
        /*
         * 视频时长改变时回调
         */
        player.on("durationChange",function(){
        	console.log("视频时长改变");
        });

        /*
         *视频实时播放回调
         */
        player.on("timeupdate",function(){
        });
 
        /*
         * 视频加载进度回调
         * @parame pt
         */
       player.on("loadProgress",function(pt){
       	  console.log("加载进度"+pt);
       });

       /*
        * 视频缓冲开始回调
        */
       player.on("bufferBegin",function(){
       	console.log("缓冲开始");
       });

       /*
        * 视频缓冲结束回调
        */
      player.on("bufferComplete",function(){
      	console.log("缓冲结束");
      });

      /*
       * 播放器获取到视频metadata信息后回调
       */
       player.on("metadata",function(obj){
       	console.log("视频元数据",obj);
      });

      /*
       * 视频时移播放后回调的函数
       */
       player.on("seek",function(e){
       	console.log("视频时移"+e);
       });
	   //启动播放器
	   player.startup();  
	   //player2.startup();
	};
			
	//点播接口调用方法
	function startPlay(){
		player.play();
	}
	function playPause(){
		player.pause();
	}
	function seekTo(){
		player.seek(8);
	}
	function playStop(){
		player.stop();
	}
	function changeVolume(){
		player.setVolume(0.1);
	}
	function getDuration(){
		alert(player.duration());
	}
	function getPlayTime(){
		alert(player.playTime());
	}
	 function setMuted(){
	 	player.muted(true);
	 }
	function switchVideo(){
		player.toPlay(host+"video/test3.mp4", "Sintel", 0, true);
	}