define(['zepto', 'FastClick', 'cordova'], function($, FastClick) {

	function xetab(tabbtn,tabto,cls){
		$(tabbtn).on("tap",function(){
			var thisindex = $(tabbtn).index(this);
			$(tabbtn).removeClass(cls);
			$(this).addClass(cls);
			$(tabto).hide().eq(thisindex).show();
		})
	}

	// 加减
	
	$.fn.Spinner = function (opts,fns) {
	
		var defaults = {value:1, min:1, len:3, max:99}
		var options = $.extend(defaults, opts)
		var keyCodes = {up:38, down:40}
		return this.each(function() {
			var a = $('<span class="minus xeAppfonts"></span>'); 
			//f(a,0,"Decrease","&#xe62a;");	//加
			var c = $('<span class="plus xeAppfonts"></span>'); 
			//f(c,0,"Increase","&#xe610;");	//减
			var b = $('<input type="tel"/>');
			f(b,1,"Amount");
			cv(0);	//值
			$(this).append(a).append(b).append(c);

			if(fns && typeof fns == "function"){
				a.tap(function(event){
					event.stopPropagation();
					var _this = this;
					cv(-1);
					fns();						
				});
				c.tap(function(event){
					event.stopPropagation();
					var _this = this;
					cv(+1);
					fns();
				});
			}else{
				a.tap(function(){
					cv(-1);
					//alert(1);
				});
				c.tap(function(){
					cv(+1)
				});
			}
			

			b.bind('keyup paste change',function(e){
				e.keyCode==keyCodes.up&&cv(+1);
				e.keyCode==keyCodes.down&&cv(-1);
			});

			b.on("blur",function(){
				cv(0);
			});
			
			function cv(n){
				b.val(b.val().replace(/[^\d]/g,''));
				bv=parseInt(b.val()||options.min)+n;
				bv>=options.min&&bv<=options.max&&b.val(bv);
				if(bv<=options.min){
					b.val(options.min);
					f(a,2,"DisDe","Decrease");

				}else{
					f(a,2,"Decrease","DisDe");
				}
				if(bv>=options.max){
					b.val(options.max);
					f(c,2,"DisIn","Increase");
				}else{
					f(c,2,"Increase","DisIn");
				}
			}
			
		});

		function f(o,t,c,s){
			t==0&&o.addClass(c).append(s);
			t==1&&o.addClass(c).attr({"value":options.value,"autocomplete":"off","maxlength":options.len});
			t==2&&o.addClass(c).removeClass(s);
		}
	}


    //加入faskclick
	document.addEventListener('deviceready', function() {
        $(function() {
            FastClick.attach(document.body);
        });
	}, false);

    //用户是否登录
	function isLogin() {
		if (window.checkLogin) {
			return window.checkLogin()
		}
		var user = xe.db.get('user');
		return (user != null && JSON.parse(user).isLogin);
	}

	//登出用户
	function logout() {
		if (window.logout) {
			return window.logout()
		}
		var user = xe.db.get('user');
		if (user != null) {
			var newUser = JSON.parse(user);
			newUser.isLogin = false;
			xe.db.put('user', JSON.stringify(newUser));
		}
	}


	//需要登录的点击事件
    $.fn.needLogin = function (cb) {
    	this.on('click', function(e){
    		if (!isLogin()) {
	    		xe.nav.push(['auth.login']);
	    	}
	    	else if (cb != undefined && cb != null)
	    	{
	    		cb(e);
	    	}
    	});
    	
    }

    //根据登录状态显示界面
    $.fn.hideWhenLoggedin = function(elems) {
    	if (isLogin() === true) {
    		this.hide();
    	}
    	else
    	{
    		this.show();
    	}
    }
    
    $.fn.showWhenLoggedin = function (cb) {
    	if (isLogin() === true) {
    		if (cb != undefined && cb != null) {
    			cb(JSON.parse(xe.db.get('user')));
    		}
    		this.show();
    	}
    	else
    	{
    		this.hide();
    	}
    }

    //上拉加载 
    $.fn.loadMore = function(cb) {
    	this.on('scroll', function(e){
    		if (this.offsetHeight + this.scrollTop == this.scrollHeight) {
    			console.log('scroll to bottom, try to load more');
    			cb();
    		}
    	});

    }

    //TODO 完善校验函数
    function validate(type, value) {
    	if (type === 'mobile') {
    		return /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
    	}
    	else if (type === 'market.password') //TODO: 完善密码校验规则
    	{
    		return /^.{6,20}$/.test($.trim(value));
    	}
    	else if (type === 'market.username')  //TODO:  支持中文, 4-100，不能全为数字
    	{
    		return /^.{4,20}$/.test($.trim(value));
    	}
    	else
    	{
    		return false;
    	}
    }

    return {
        validate: validate,
        logout: logout,
        xetab : xetab,
        isIos: (function(){(/iphone/gi).test(window.navigator.appVersion)}())
    }
});

