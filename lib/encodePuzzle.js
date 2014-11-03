// LICENSE : MIT
"use strict";
module.exports = encodePuzzle;
var _ = require("lodash");
var fetchImage = require("./fetchImage");
/**
 *
 * @param canvas
 * @param image
 * @returns {Promise<U>|*}
 */
function encodePuzzle(canvas, image) {
    var getCanvasMap = getImageMap.bind(null, canvas);
    var imageMapList = getCanvasMap(image);
    var dataURLs = getImageDataMap(canvas, image, imageMapList);
    var mapAndDataURLs = imageMapList.map(function (imageMap, index) {
        return _.merge(imageMap, {
            dataURL: dataURLs[index]
        });
    });
    require("./canvasUtil").fitCanvasWithImage(canvas, image);
    var shuffled = require('shuffle-array')(mapAndDataURLs);
    console.log(shuffled);
    return writeImageDataMap(canvas, shuffled).then(function () {
        return {
            canvas: canvas,
            imageMapList: shuffled
        }
    });
}
/**
 *
 * @param canvas
 * @param image
 * @returns {Array.<ImageMap>}
 */
function getImageMap(canvas, image) {
    var NUM_COLS = require("./const-col-row").cols,
        NUM_ROWS = require("./const-col-row").rows;
    var dx = canvas.width = image.width / NUM_COLS;
    var dy = canvas.height = image.height / NUM_ROWS;
    var slicedImageTable = [];
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
        return canvas.toDataURL()
    });
}
/**
 *
 * @param canvas
 * @param imageMapList
 * @returns {Promise<U>|*}
 */
function writeImageDataMap(canvas, imageMapList) {
    var ctx = canvas.getContext("2d");
    var imagePromises = imageMapList.map(function (dataMap) {
        return fetchImage(dataMap.dataURL);
    });
    return Promise.all(imagePromises).then(function (images) {
        var NUM_COLS = require("./const-col-row").cols,
            NUM_ROWS = require("./const-col-row").rows;
        var dx = imageMapList[0].width;
        var dy = imageMapList[0].height;
        var index = 0;
        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                ctx.drawImage(images[index], dx * col, dy * row, dx, dy);
                imageMapList[index].index = index;
                index++;
            }
        }
    })
}
