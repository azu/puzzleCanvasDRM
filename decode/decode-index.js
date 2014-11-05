/**
 * Created by azu on 2014/10/24.
 * LICENSE : MIT
 */
"use strict";
var canvas = document.getElementById("js-canvas");
var fetchImage = require("./../lib/fetchImage");
fetchImage("../img/encoded.png").then(function (puzzledImage) {
    return require("./../lib/decodePuzzle")(canvas, puzzledImage, require("../img/encoded.json"));
}).catch(function (error) {
    console.log(error.stack);
    console.log(error);
});