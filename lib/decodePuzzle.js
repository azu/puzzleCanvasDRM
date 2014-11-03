// LICENSE : MIT
"use strict";
module.exports = decodePuzzle;
var _ = require("lodash");
var fetchImage = require("./fetchImage");
function sortImageMapByIndex(imageMapList) {
    return _.sortBy(imageMapList, "index");
}
function decodePuzzle(canvas, image, imageMeta) {
    var sortedMapList = sortImageMapByIndex(getImageDataMap(canvas, image, imageMeta));
    require("./canvasUtil").fitCanvasWithImage(canvas, image);
    writeImageDataMap(canvas, sortedMapList).then(function () {
        console.log(canvas.toDataURL());
    });
}

function pickImageMapAtIndex(imageMapList, index) {
    return _.find(imageMapList, function (obj) {
        return obj.index === index;
    });
}

/**
 *imageMeta
 * @param canvas
 * @param image
 * @param {ImageMeta} imageMeta
 */
function getImageDataMap(canvas, image, imageMeta) {
    var imageMapList = imageMeta.imageMapList,
        delimit = imageMeta.delimit;
    var NUM_COLS = delimit.cols,
        NUM_ROWS = delimit.rows;
    var dx = canvas.width = image.width / NUM_COLS;
    var dy = canvas.height = image.height / NUM_ROWS;
    var ctx = canvas.getContext("2d");
    var index = 0;
    var array = [];
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            ctx.drawImage(image, dx * col, dy * row, dx, dy, 0, 0, dx, dy);
            var imageMap = pickImageMapAtIndex(imageMapList, index);
            array.push(_.merge(imageMap, {
                dataURL: canvas.toDataURL()
            }));
            index++;
        }
    }
    return array;
}
/**
 *
 * @param canvas
 * @param imageMapList
 * @returns {Promise<U>|*}
 */
function writeImageDataMap(canvas, imageMapList) {
    var ctx = canvas.getContext("2d");
    var imagePromises = imageMapList.map(function (imageMap) {
        return fetchImage(imageMap.dataURL);
    });
    return Promise.all(imagePromises).then(function (images) {
        images.forEach(function (image, index) {
            var imageMap = imageMapList[index];
            ctx.drawImage(image, imageMap.x, imageMap.y, imageMap.width, imageMap.height);
        });
    })
}
