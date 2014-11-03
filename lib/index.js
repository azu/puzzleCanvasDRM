/**
 * Created by azu on 2014/10/24.
 * LICENSE : MIT
 */
"use strict";
var canvas = document.getElementById("js-canvas");
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
/**
 *
 * @param canvas
 * @param image
 * @returns {Array.<ImageMap>}
 */
function getImageMap(canvas, image) {
    var NUM_COLS = 6,
        NUM_ROWS = 6;
    var dx = canvas.width = image.width / NUM_COLS;
    var dy = canvas.height = image.height / NUM_ROWS;
    var slicedImageTable = [];
    var ctx = canvas.getContext("2d");
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            /**
             * @typedef {{x: number, y: number, width: number, height: number}} ImageMap
             */
            var imageMap = {
                x: dx * col,
                y: dy * row,
                width: dx,
                height: dy,
                sx: dx,
                sy: dy
            };
            slicedImageTable.push(imageMap);
        }
    }
    return slicedImageTable;
}
/**
 *
 * @param canvas
 * @param image
 * @param {ImageMap} imageMapList
 */
function getImageDataMap(canvas, image, imageMapList) {
    var ctx = canvas.getContext("2d");
    return imageMapList.map(function (imageMap) {
        ctx.drawImage(image, imageMap.x, imageMap.y, imageMap.width, imageMap.height,
            // 0,0からwidth,heightに配置
            0, 0, imageMap.sx, imageMap.sy);
        ctx.strokeRect(0, 0, imageMap.sx, imageMap.sy);
        return canvas.toDataURL()
    });
}

function writeImageDataMap(canvas, imageMapList, dataMapList) {
    var ctx = canvas.getContext("2d");
    var imagePromises = dataMapList.map(function (dataMap) {
        return fetchImage(dataMap);
    });
    return Promise.all(imagePromises).then(function (images) {
        images.forEach(function (image, index) {
            var imageMap = imageMapList[index];
            ctx.drawImage(image, imageMap.x, imageMap.y, imageMap.width, imageMap.height);
        });
    });
}

var getCanvasMap = getImageMap.bind(null, canvas);
fetchImage("./img/toa.jpg").then(function (image) {
    var imageMapList = getCanvasMap(image);
    var dataURLs = getImageDataMap(canvas, image, imageMapList);
    canvas.width = image.width;
    canvas.height = image.height;
    var shuffled = require('shuffle-array')(imageMapList);
    writeImageDataMap(canvas, shuffled, dataURLs);
}).catch(function (error) {
    console.error(error);
    console.log(error.stack);
});

