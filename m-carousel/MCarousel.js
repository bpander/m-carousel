(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['motherboard'], factory);
    } else {
        // Browser globals
        root.MCarousel = factory(root.M);
    }
}(this, function (M) {
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
            this.actuator.scrollLeft = target;
        };


        proto.prev = function () {
            this.advance(this.currentSlidesScrolled * -1);
        };


        proto.next = function () {
            this.advance(this.currentSlidesScrolled);
        };

    });
}));
