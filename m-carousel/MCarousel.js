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

            // TODO: Implement this
            M.attribute('easing', {
                type: String,
                default: 'TWEEN.Easing.Cubic.InOut'
            }),

            M.attribute('speed', {
                type: Number,
                default: 1500
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

            this.position = { x: 0 };

            this.rafId = 0;

            this.index = 0;

            // Create copies of the tween event handlers bound to this instance
            this.handleAnimationFrame = proto.handleAnimationFrame.bind(this);
            this.handleTweenComplete = proto.handleTweenComplete.bind(this);
            this.handleTweenUpdate = proto.handleTweenUpdate.bind(this);

            this.tween = new TWEEN.Tween(this.position);
            this.tween
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(this.handleTweenUpdate)
                .onComplete(this.handleTweenComplete);

            this.listen(this.prevButton, 'click', this.prev);
            this.listen(this.nextButton, 'click', this.next);
            this.enable();
        };


        proto.attachedCallback = function () {
            base.attachedCallback.call(this);

            var slideWidth = 1 / this.currentSlidesVisible * 100 + '%';
            this.slides.forEach(function (slide) {
                slide.style.width = slideWidth
            }, this);
        };


        proto.advance = function (howMany) {

            // Stop the animation if it's happening
            cancelAnimationFrame(this.rafId);
            this.tween.stop();

            // Update the active index
            this.index = (this.index + howMany) % this.slides.length;
            if (this.index < 0) {
                this.index += this.slides.length;
            }

            // Do some math and get the tween going
            var slideWidth = this.clientWidth / this.currentSlidesVisible;
            var target = { x: Math.ceil(slideWidth * this.index) }; // Math.ceil since we can't scroll to have a pixel in a lot of browsers
            this.tween.to(target, this.speed);
            this.tween.start();
            this.rafId = requestAnimationFrame(this.handleAnimationFrame);
        };


        proto.prev = function () {
            this.advance(this.currentSlidesScrolled * -1);
        };


        proto.next = function () {
            this.advance(this.currentSlidesScrolled);
        };


        proto.handleAnimationFrame = function (time) {
            this.rafId = requestAnimationFrame(this.handleAnimationFrame);
            this.tween.update(time);
        };


        proto.handleTweenComplete = function () {
            cancelAnimationFrame(this.rafId);
        };


        proto.handleTweenUpdate = function () {
            this.actuator.scrollLeft = this.position.x;
        };

    });
}));
