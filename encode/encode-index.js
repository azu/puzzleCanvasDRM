// LICENSE : MIT
"use strict";

var canvas = document.getElementById("js-canvas");
var fetchImage = require("../lib/fetchImage");
var renderResult = null;
fetchImage("../img/toa.jpg").then(function (image) {
    return require("../lib/encodePuzzle")(canvas, image).then(function (result) {
        renderResult = result;
    });
}).catch(function (error) {
    console.log(error.stack);
    console.log(error);
});

document.getElementById("js-save-button").addEventListener("click", function () {
    if (renderResult == null) {
        return;
    }
    function saveJSON() {
        var JSONBlob = new Blob(
            [JSON.stringify(renderResult.imageMeta)],
            {type: 'application/json'}
        );
        window.saveAs(JSONBlob, "encoded.json");
    }

    require("../lib/canvasUtil").saveCanvas(canvas, "encoded.png", saveJSON());

});