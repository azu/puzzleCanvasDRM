/**
 * Created by azu on 2014/10/24.
 * LICENSE : MIT
 */
"use strict";
var canvas = document.getElementById("js-canvas");
var fetchImage = require("./fetchImage");
fetchImage("./img/toa.jpg").then(function (image) {
    return require("./encodePuzzle")(canvas, image).then(function (result) {
        var canvas = result.canvas,
            imageMeta = result.imageMeta;
        return fetchImage(canvas.toDataURL()).then(function (puzzledImage) {
            return require("./decodePuzzle")(canvas, puzzledImage, imageMeta);
        });
    });
}).catch(function (error) {
    console.log(error.stack);
    console.log(error);
});

