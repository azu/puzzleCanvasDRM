// LICENSE : MIT
"use strict";
module.exports = encodePuzzle;
/**
 *
 * @param canvas
 * @param imagePath
 * @returns {Promise<U>|*}
 */
function encodePuzzle(canvas, imagePath) {
    var getCanvasMap = getImageMap.bind(null, canvas);
    return fetchImage(imagePath).then(function (image) {
        var imageMapList = getCanvasMap(image);
        var dataURLs = getImageDataMap(canvas, image, imageMapList);
        require("./canvasUtil").fitCanvasWithImage(canvas, image);
        var shuffled = require('shuffle-array')(imageMapList);
        return writeImageDataMap(canvas, shuffled, dataURLs).then(function () {
            return {
                canvas: canvas,
                imageMapList: shuffled,
                dataURLs: dataURLs
            }
        });
    }).catch(function (error) {
        console.error(error);
        console.log(error.stack);
    });
}
var fetchImage = require("./fetchImage");
/**
 *
 * @param canvas
 * @param image
 * @returns {Array.<ImageMap>}
 */
function getImageMap(canvas, image) {
    var NUM_COLS = 12,
        NUM_ROWS = 12;
    var dx = canvas.width = image.width / NUM_COLS;
    var dy = canvas.height = image.height / NUM_ROWS;
    var slicedImageTable = [];
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            /**
             * @typedef {{x: number, y: number, width: number, height: number}} ImageMap
             */
            var imageMap = {
                index: row + col,
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
/**
 *
 * @param canvas
 * @param imageMapList
 * @param dataMapList
 * @returns {Promise<U>|*}
 */
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
    })
}
