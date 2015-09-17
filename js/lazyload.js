/**
    author zhangwen
    鲜易图片延迟加载插件
**/
(function($) {
    $.fn.xelazyload = function(threshold, callback) {
        var $w = $(window), 
            th = threshold || 0, 
            retina = window.devicePixelRatio > 1, 
            attrib = retina ? "data-original" : "data-original", 
            images = this, 
            loaded;
        console.log(attrib)
        this.one("unveil", function() {
            var source = this.getAttribute(attrib);

            source = source || this.getAttribute("data-original") || this.getAttribute("data-src") || this.getAttribute("data-url");
            if (this.not_new == "yes") {
                return false
            }
            if (source) {
                this.xe_bg = this.src;
                this.setAttribute("src", source);
                this.onerror = function() {
                    this.not_new = "yes";
                    this.setAttribute("src", this.xe_bg);
                    $(this).css({"opacity": 1, "-webkit-transition": "all 600ms ease"})
                };
                this.onload = function() {
                    this.not_new = "yes";
                    $(this).css({"opacity": 1, "-webkit-transition": "opacity 600ms ease"})
                };
                if (typeof callback === "function") {
                    callback.call(this)
                }
            }
        });
        function unveil() {
            var inview = images.filter(function() {
                var $e = $(this), wt = $w.scrollTop(), wb = wt + $w.height(), et = $e.offset().top, eb = et + $e.height();
                return eb >= wt - th && et <= wb + th
            });
            loaded = inview.trigger("unveil");
            images = images.not(loaded)
        }
        $w.bind("scroll", function() {
            unveil()
        });
        $w.bind("resize", function() {
            unveil()
        });
        unveil();
        return this
    }
})(window.jQuery || window.Zepto);