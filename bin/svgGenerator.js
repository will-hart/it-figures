"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as window from 'svgdom'
// import * as SVG from 'svg.js'
// SVG(window)
var window = require('svgdom');
var SVG = require('svg.js')(window);
var document = window.document;
var fs = require("fs");
var util_1 = require("util");
var fsw = util_1.promisify(fs.writeFile);
var SvgGenerator = /** @class */ (function () {
    function SvgGenerator(panel) {
        var _this = this;
        this.generate = function () { return __awaiter(_this, void 0, void 0, function () {
            var canvas;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = this.generateCanvas(this.panel.sizex * this.panel.width, this.panel.sizey * this.panel.height);
                        if (this.panel.images.length === 0) {
                            console.log("No images in panel, aborting");
                            return [2 /*return*/];
                        }
                        this.panel.images.forEach(function (image) {
                            console.log(" --> SVG Generator - " + image.source);
                            // create a group and throw the imported svg into it
                            var svg = fs.readFileSync(image.source, 'utf8');
                            var g = canvas.nested().svg(svg);
                            var scale = _this.getScale(g, image);
                            g.scale(scale, scale)
                                .move(image.left * _this.panel.sizex + (image.offsetx || 0), image.top * _this.panel.sizey + (image.offsety || 0));
                            // if we don't have a caption, exit
                            if (!image.caption)
                                return;
                            var fontSize = _this.panel.fontSize || 32;
                            // add the caption to the group
                            g.text(image.caption)
                                .fill('#000000')
                                .move(0, fontSize) // add font size due to the x/y position being bottom left of text
                                .font({
                                size: fontSize,
                                family: (_this.panel.fontFamily || 'Helvetica'),
                                anchor: 'start'
                            });
                        });
                        // write the svg string to file
                        return [4 /*yield*/, fsw(this.panel.output, canvas.svg())];
                    case 1:
                        // write the svg string to file
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Gets the scale to use for an image, maintaining aspect ratio and fitting
         * within the given bounds
         */
        this.getScale = function (g, image) {
            // current w/h of group
            var _a = g.bbox(), width = _a.width, height = _a.height;
            // size of sub figure grid area we are fitting the image to
            var boxW = _this.panel.sizex * image.cols;
            var boxH = _this.panel.sizey * image.rows;
            // determine the correct scaling value - basically scale to the smallest available proportion
            return Math.min(width / boxW, height / boxH);
        };
        /**
         * Generates a new SVG canvas that represents the entire size of the panel
         */
        this.generateCanvas = function (width, height) {
            return SVG(_this.document.documentElement).size(width, height);
        };
        this.panel = panel;
        this.document = window.document;
    }
    return SvgGenerator;
}());
exports.default = SvgGenerator;
