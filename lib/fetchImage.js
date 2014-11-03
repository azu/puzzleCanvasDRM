// LICENSE : MIT
"use strict";
/**
 *
 * @param imagePath
 * @returns {Promise}
 */
function fetchImage(imagePath) {
    var _resolve = null;
    var promise = new Promise(function (resolve) {
        _resolve = resolve;
    });
    var image = new Image();
    image.src = imagePath;
    image.onload = function () {
        _resolve(image);
    };
    return promise;
}
module.exports = fetchImage;