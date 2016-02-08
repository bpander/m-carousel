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

    });
}));
