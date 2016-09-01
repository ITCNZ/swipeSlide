/**
*swipeSlide移动端全屏滑动插件
*version: 1.0
*author: WISHES
*time: 2016/09/01
*qq:1527127028
*版权:转载使用需要保留头部信息！前端菜鸟，欢迎朋友拍砖指正！
**/
;(function($){
$.fn.swipeSlide=function(options){
	
	//默认参数
	var defaults={
		scale:0.5,//宽高比
		auto:true,//自动滚
		isTit:true, //分页标题
		index:0    //初始项
	};
	var option=$.extend({},defaults,options);
	
	this.each(function(){
		var a=$(this);
		var b=a.find("ul");
		var c=a.find("li");
		var iNow = option.index, timer = null,iNow1 = option.index,Tit="",em="";
		var touch={"s":[],"d":""};
		for(var i=0; i<c.length;i++){em+='<em></em>'}
		if(option.isTit==true){Tit='<p class="title">'+c.eq(0).find("a").attr("title")+'</p>';}
		a.append('<div class="title-box">'+Tit+'<span class="circle">'+em+'</span></div>');
		
		//自适应
		function sizeShow(){
			w=$(window).width();
			a.height(w*option.scale);
			b.width(w*c.length);
			c.width(w).height(w*option.scale);
		};
		sizeShow();
		$(window).resize(function(){sizeShow()});
		
		//初始项相关
		if(iNow==c.length-1){
			c.eq(0).css({'position':'relative','left':w*c.length+'px'});
			b.css({"left":-w*iNow1})
		}
		
		//滑动开始
		a[0].addEventListener('touchstart', function(e){
			touch.s[0] = e.targetTouches[0].pageX;
			touch.s[1] = e.targetTouches[0].pageY;
			touch.s[2] = (new Date()).getTime();
			if(iNow==c.length-1){
				c.eq(0).css({'position':'relative','left':w*c.length+'px'});
			}else if(iNow==0){
				c.eq(c.length-1).css({'position':'relative','left':-c.length*w})
			}else{
				c.css({'position':'static'});
			}
			clearInterval(timer);
		}, false);
		
		//滑动过程
		a[0].addEventListener('touchmove', function(e){
			if(Math.abs(e.targetTouches[0].pageX-touch.s[0])>=Math.abs(e.targetTouches[0].pageY-touch.s[1]) && touch.d==""){
				touch.d=1;//左右
			}else if(touch.d==""){
				touch.d=0;//上下或者偏上下
			}
			if(touch.d==1){//左右滚动
			   e.preventDefault();
				b.css({"left":-iNow*w+e.targetTouches[0].pageX-touch.s[0]});
			}
		}, false);
		
		//滑动结束
		a[0].addEventListener('touchend', function(e){
			if(touch.d==1 && !b.is(":animated")){
				endleft=parseInt(a.css("left"));
				if((new Date()).getTime()-touch.s[2]>700){
					if(e.changedTouches[0].pageX-touch.s[0]>w/3){
						auto("right")
					}else if(touch.s[0]-e.changedTouches[0].pageX>w/3){
						auto("left")
					}else{
						auto("reset")
					}
				}else{
					if(e.changedTouches[0].pageX>touch.s[0]){
						auto("right");
					}else if(touch.s[0]>e.changedTouches[0].pageX){
						auto("left")
					}
				}
			}
			touch.d="";
			timer=setInterval(fnAuto,3000);
		}, false);
		
		//核心函数
		function auto(dir){
			if(dir=="left"){
				if(iNow>=c.length-1){
					c.eq(0).css({'position':'relative','left':w*c.length+'px'});
					iNow=0;
				}else{
					iNow++;
					c.css({'position':'static'});
				}
				iNow1++
				b.animate({"left":-w*iNow1},function(){
					 if(iNow1==c.length){
						c.eq(0).css({'position':'static',"left":0});
						b.css({'left':0});
						iNow1=0
					 }
				})
			}else if(dir=="right"){
				if(iNow<=0){
					iNow=c.length-1
				}else{
					iNow--;
					c.css({'position':'static'});
				}
				iNow1--
				b.animate({"left":-w*iNow1},function(){
					if(iNow1==-1){
						c.eq(c.length-1).css({'position':'static'});
						b.css({'left':-w*(c.length-1)});
						iNow1=c.length-1
					}
				})
			}else if(dir=="reset"){
				b.animate({"left":-w*iNow});
				c.css({'position':'static'});
			}
			page(iNow)
		};
		
		//定时滚动
		timer=setInterval(fnAuto,3000);
		
		//定时函数
		function fnAuto(){
			if(option.auto==false) return;
			auto("left")
		}
		
		//分页函数
		function page(i){
			a.find(".circle em").eq(i).addClass("active").siblings().removeClass("active");
			a.find(".title-box .title").html(c.eq(i).find("a").attr("title"))
		}
		page(option.index)
	})
}
})(jQuery);