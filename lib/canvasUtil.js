// LICENSE : MIT
"use strict";
function saveCanvas(canvas, callback) {
    canvas.toBlob(function (blob) {
        window.saveAs(blob, "pretty image.png");
        callback(null, blob);
    });
}
function fitCanvasWithImage(canvas, image) {
    canvas.width = image.width;
    canvas.height = image.height;
}

module.exports = {
    saveCanvas: saveCanvas,
    fitCanvasWithImage: fitCanvasWithImage
};