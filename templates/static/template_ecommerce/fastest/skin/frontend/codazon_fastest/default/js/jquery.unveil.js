(function(a) {
    a.fn.unveil = function(h, j) {
        var e = a(window),
            b = h || 0,
            d = window.devicePixelRatio > 1,
            f = d ? "data-src-retina" : "data-src",
            i = this,
            g;
        this.one("unveil", function() {
            var k = this.getAttribute(f);
            k = k || this.getAttribute("data-src");
            if (k) {
                this.setAttribute("src", k);
                if (typeof j === "function") {
                    j.call(this)
                }
            }
        });

        function c() {
            var k = i.filter(function() {
                var m = a(this);
                if (m.is(":hidden")) {
                    return
                }
                var l = e.scrollTop(),
                    o = l + e.height(),
                    p = m.offset().top,
                    n = p + m.height();
                return n >= l - b && p <= o + b
            });
            g = k.trigger("unveil");
            i = i.not(g)
        }
        e.on("scroll.unveil resize.unveil lookup.unveil", c);
        c();
        return this
    }
})(window.jQuery || window.Zepto);