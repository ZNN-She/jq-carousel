/**
 * Created by zhangnanning on 2019/6/2.
 */
(function ($) {
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('snake.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (typeof option == 'number') {
                options.interval = option
            }
            if (!data) $this.data('snake.carousel', (data = new Carousel(this, options)));
            if (action) data[action]();
        })
    }

    function Carousel(ele, option) {
        this.$ele = $(ele);
        this.eleNum = this.$ele.find(".carousel-content-item").length;
        this.isLoop = false;
        this.pause = false;
        this.slideIndex = 0;
        self.direction = "next";
        this.options = option;

        this.init();
    }

    Carousel.DEFAULTS = {
        interval: 3000
    };
    Carousel.prototype.init = function () {
        var self = this;
        self.$ele.on("click", ".carousel-arrows-next", function (event) {
            self.next();
        })
        self.$ele.on("click", ".carousel-arrows-prev", function (event) {
            self.prev();
        })
        self.$ele.on("click", ".carousel-slide", function (event) {
            self.showIndex = self.slideIndex = $(event.target).index();
            self.nowIndex = self.$ele.find('.carousel-content-item.carousel-content-show').index();
            var isNext = self.slideIndex > self.nowIndex;
            self.direction = isNext ? "next" : "prev";
            self.show();
        })
        self.$ele.hover(function (argument) {
            self.pause = true;
        }, function (argument) {
            self.pause = false;
        })
        $(document).on('keydown', $.proxy(self.keydown, self))
        self.loop();
    }
    Carousel.prototype.next = function () {
        var self = this;
        self.nowIndex = self.$ele.find('.carousel-content-item.carousel-content-show').index();
        self.showIndex = self.nowIndex + 1 > self.eleNum - 1 ? 0 : self.nowIndex + 1;
        self.direction = "next";
        self.show();
    }
    Carousel.prototype.prev = function () {
        var self = this;
        self.nowIndex = self.$ele.find('.carousel-content-item.carousel-content-show').index();
        self.showIndex = self.nowIndex - 1 < 0 ? self.eleNum - 1 : self.nowIndex - 1;
        self.direction = "prev";
        self.show();
    }
    Carousel.prototype.keydown = function (e) {
        console.log(1);
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37:
                this.prev();
                break
            case 39:
                this.next();
                break
            default:
                return
        }

        e.preventDefault()
    }
    Carousel.prototype.loop = function () {
        var self = this;
        setTimeout(function () {
            self.pause || self.next();
            self.loop();
        }, self.options.interval);
    }
    Carousel.prototype.show = function (e) {
        if (this.isLoop) {
            return;
        }
        this.isLoop = true;
        var self = this;
        switch (self.direction) {
            case "next":
                self.$ele.find('.carousel-content-item').eq(self.nowIndex).addClass('next-hide');
                self.$ele.find('.carousel-content-item').eq(self.showIndex).addClass('carousel-content-show next-show');
                break;
            case "prev":
                self.$ele.find('.carousel-content-item').eq(self.nowIndex).addClass('prev-hide');
                self.$ele.find('.carousel-content-item').eq(self.showIndex).addClass('carousel-content-show prev-show');
                break;
            default:
                self.$ele.find('.carousel-content-item').eq(self.nowIndex).addClass('next-hide');
                self.$ele.find('.carousel-content-item').eq(self.showIndex).addClass('carousel-content-show next-show');
                break
        }
        setTimeout(function () {
            self.$ele.find('.carousel-content-item').eq(self.nowIndex).removeClass('carousel-content-show');
            self.$ele.find('.carousel-content-item').removeClass('prev-show');
            self.$ele.find('.carousel-content-item').removeClass('next-show');
            self.$ele.find('.carousel-content-item').removeClass('prev-hide');
            self.$ele.find('.carousel-content-item').removeClass('next-hide');
            self.isLoop = false;
        }, 1000);
        self.$ele.find('.carousel-slide-item').removeClass('carousel-slide-active').eq(self.showIndex).addClass('carousel-slide-active');
    }


    $.fn.carousel = Plugin;

    $(window).on("load", function () {
        $("[data-snake='carousel']").each(function () {
            Plugin.call($(this), $(this).data());
        })
    })
})(jQuery);
