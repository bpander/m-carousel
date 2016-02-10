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
            console.log('howMany', howMany);
        };


        proto.prev = function () {
            this.advance(this.currentSlidesScrolled * -1);
        };


        proto.next = function () {
            this.advance(this.currentSlidesScrolled);
        };

    });
}));
