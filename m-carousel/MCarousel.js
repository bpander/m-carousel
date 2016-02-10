(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['motherboard', 'tween.js'], factory);
    } else {
        // Browser globals
        root.MCarousel = factory(root.M, root.TWEEN);
    }
}(this, function (M, TWEEN) {
    'use strict';


    return M.element('m-carousel', function (proto, base) {

        proto.customAttributes.push(

            M.attribute('slides-visible', {
                type: Number,
                responsive: true,
                default: '1'
            }),

            M.attribute('slides-scrolled', {
                type: Number,
                responsive: true,
                default: '1'
            }),

            M.attribute('autoplay', { type: Boolean }),

            M.attribute('easing', {
                type: String,
                default: 'linear'
            }),

            M.attribute('speed', {
                type: Number,
                default: 500
            }),

            M.attribute('delay', {
                type: Number,
                default: 7000
            })

        );


        proto.createdCallback = function () {
            base.createdCallback.call(this);

            this.actuator = this.findWithTag('m-carousel.actuator');

            this.prevButton = this.findWithTag('m-carousel.prevButton');

            this.nextButton = this.findWithTag('m-carousel.nextButton');

            this.slides = Array.prototype.slice.call(this.actuator.children);

            this.index = 0;

            this.listen(this.prevButton, 'click', this.prev);
            this.listen(this.nextButton, 'click', this.next);
            this.enable();
        };


        proto.attachedCallback = function () {
            base.attachedCallback.call(this);
            this.slides.forEach(function (slide) {
                slide.style.width = 1 / this.currentSlidesVisible * 100 + '%';
            }, this);
        };


        proto.advance = function (howMany) {
            var slideWidth = this.clientWidth / this.currentSlidesVisible;
            this.index = (this.index + howMany) % this.slides.length;
            if (this.index < 0) {
                this.index += this.slides.length;
            }
            var target = Math.ceil(slideWidth * this.index); // Math.ceil since we can't scroll to have a pixel in a lot of browsers
            var tween = new TWEEN.Tween({ scrollLeft: this.actuator.scrollLeft });
            tween.to({ scrollLeft: target }, 500);
            tween.easing(TWEEN.Easing.Cubic.InOut);
            var actuator = this.actuator;
            tween.onUpdate(function () {
                console.log(this);
                actuator.scrollLeft = this.scrollLeft
            });
            tween.start();
            var animate = function (time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
            };
            requestAnimationFrame(animate);
        };


        proto.prev = function () {
            this.advance(this.currentSlidesScrolled * -1);
        };


        proto.next = function () {
            this.advance(this.currentSlidesScrolled);
        };

    });
}));
