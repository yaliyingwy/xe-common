/**
	author zhangwen
	鲜易图片延迟加载插件
**/

;(function($){
    $.fn.xelazyload = function(settings){
        var $this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();
        var setIds = 0;
        var failList = [];
        settings = $.extend({
            threshold: 0, // 提前高度加载
            $el:$(window),
            placeholder: ''
        }, settings||{});

        // 执行懒加载图片
        lazyLoadPic();

        // 滚动触发换图
        settings.$el.on('scroll',function(){
            clearTimeout(setIds);
            setIds = setTimeout(function(){
                _winScrollTop = $(window).scrollTop();
                lazyLoadPic();
            },0);
        });

        // 懒加载图片
        function lazyLoadPic(){
            $this.each(function(){
                var $self = $(this);
                // 如果是img
                if($self.is('img')){
                    if($self.attr('data-original')){
                        if( !$self.attr("src")){
                            $self.attr("src",settings.placeholder);
                        }
                        var _offsetTop = $self.offset().top, url = $self.attr('data-original');
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop) && inviewport($self)){
                            loading(url,function(){
                                $self.attr('src',url);
                                $self.removeAttr('data-original');
                                lazyloadOut($self);
                            });

                        }
                    }
                    // 如果是背景图
                }else{
                    if($self.attr('data-original')){
                        // 默认占位图片
                        if($self.css('background-image') == 'none'){
                            $self.css('background-image','url('+settings.placeholder+')');
                        }
                        var _offsetTop = $self.offset().top;
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            $self.css('background-image','url('+$self.attr('data-original')+')');
                            $self.removeAttr('data-original');
                        }
                    }
                }
            });
        }
        //判断当前元素是否在可视区域
        function inviewport( el ) {
            // 当前窗口的顶部
            var top = window.pageYOffset || 0;
            // 当前窗口的底部
            var btm = top + window.innerHeight;
            // 元素所在整体页面内的y轴位置
            var eltop = $(el).offset().top;
            // 判断元素，是否在当前窗口，或者当前窗口延伸400像素内
            return eltop >= (top-80) && eltop - settings.threshold <= btm
        }
        //加载动画
        function lazyloadOut(_t){
            _t.css({
                "-webkit-animation-name": "slideOut",
                "animation-name": "slideOut",
                "-webkit-animation-duration":".2s",
                "animation-duration": ".2s"
            })
        }
        function loading(url,callback){
            var image = new Image();

            image.onload = function(){
                delete image;
                callback && callback();
            };
            image.onerror = function(){
                failList.push(url);
                loadFail();
                delete image;
            };
            image.src = url;
        }
        // loadFail();
        function loadFail(){
            var num = 3;
            var setId = setInterval(function(){
                num--;
                var len = failList.length;
                if(len == 0 || num <=  0){
                    clearInterval(setId);
                    return;
                }
                var flag = false;
                for(var i=0; i< len; i++){
                    if(flag){
                        break;
                    }
                    (function(n){
                        var image = new Image();
                        image.onload = function(){
                            var $self = $("img[data-original='"+failList[n]+"']");
                            $self.attr('src',failList[n]);
                            $self.removeAttr('data-original');
                            lazyloadOut($self);
                            failList.splice(n,1);
                            flag = true;
                        };
                        image.src =failList[n];
                    })(i);

                }
            },1500);
        }

    }
})(Zepto);