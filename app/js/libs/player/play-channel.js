 // var host="http://192.168.1.114/sewiseplayer_js_3.0.0/bin/"
var host="/c-play/data/";
var config={
  elid:"con1",
  // url:"http://192.168.1.114/sewiseplayer_js_3.0.0/bin/m3u8/ee/test.m3u8",
  url: '#',
  // url: host + 'test2.mp4',
  // primary:"flash",
  // url:"vod://192.168.1.23:8888/sourceid",
  skin:"vodWhite",
  autostart:false,
  server:'vod'
};
  
  // $(document).ready(dowReady);

var player;

function dowReady() {
  player = new Sewise.SewisePlayer(config);
  player.startup();//启动播放器
}