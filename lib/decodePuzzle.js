// LICENSE : MIT
"use strict";
module.exports = decodePuzzle;
var _ = require("lodash");
var fetchImage = require("./fetchImage");
function sortImageMapByIndex(imageMapList) {
    return _.sortBy(imageMapList, "index");
}
function decodePuzzle(canvas, image, imageMapList) {
    var sortedMapList = sortImageMapByIndex(imageMapList);
    var imageDataURLs = getImageDataMap(canvas, image, sortedMapList);
    require("./canvasUtil").fitCanvasWithImage(canvas, image);
    writeImageDataMap(canvas, sortedMapList, imageDataURLs);
}

/**
 *
 * @param canvas
 * @param image
 * @param {ImageMap} imageMapList
 */
function getImageDataMap(canvas, image, imageMapList) {
    var NUM_COLS = 12,
        NUM_ROWS = 12;
    var dx = canvas.width = image.width / NUM_COLS;
    var dy = canvas.height = image.height / NUM_ROWS;
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
