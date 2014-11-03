// LICENSE : MIT
"use strict";
/**
 *
 * @param {Blob} blob
 * @returns {*}
 */
module.exports = function (blob) {
    var xURL = window.URL || window.webkitURL;
    return xURL.createObjectURL(blob)
};