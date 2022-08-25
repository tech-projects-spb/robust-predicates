(function (factory) {
typeof define === 'function' && define.amd ? define(factory) :
factory();
})((function () { 'use strict';

const {orient2d, orient2dfast} = require('./esm/orient2d.js');
const {orient3d, orient3dfast} = require('./esm/orient3d.js');
const {incircle, incirclefast} = require('./esm/incircle.js');
const {insphere, inspherefast} = require('./esm/insphere.js');

module.exports = {
    orient2d,
    orient2dfast,
    orient3d,
    orient3dfast,
    incircle,
    incirclefast,
    insphere,
    inspherefast,
};

}));
