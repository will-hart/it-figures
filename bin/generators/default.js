"use strict";
/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */
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
var sharp = require("sharp");
var DefaultGenerator = /** @class */ (function () {
    function DefaultGenerator(metadata) {
        var _this = this;
        this.generate = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateBlankCanvas(this.panel.width * this.panel.sizex, this.panel.height * this.panel.sizey)
                            .then(this.applySubFigures)
                            .then(this.writeOutput)
                            .catch(function (err) { return console.log(err); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Generates an empty canvas of the specified figure size
         */
        this.generateBlankCanvas = function (width, height) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sharp(undefined, {
                            create: {
                                width: width,
                                height: height,
                                channels: 4,
                                background: { r: 0, g: 0, b: 0, alpha: 0 }
                            }
                        }).png()];
                    case 1: 
                    // start by creating an empty input buffer in the size of the image
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Generates and applies the given subfigures to the passed image
         * @param sh The SharpInstance being written
         */
        this.applySubFigures = function (sh) { return __awaiter(_this, void 0, void 0, function () {
            var newSh, _i, _a, image, offx, offy, top_1, left, w, h, blank, subfig, imgBuffer, buff;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newSh = sh;
                        _i = 0, _a = this.panel.images;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        image = _a[_i];
                        offx = parseInt((image.offsetx || 0).toString());
                        offy = parseInt((image.offsety || 0).toString());
                        top_1 = image.top * this.panel.sizey;
                        left = image.left * this.panel.sizex;
                        w = image.cols * this.panel.sizex;
                        h = image.rows * this.panel.sizey;
                        console.log(" --> Default Generator: " + image.source + " at {" + top_1 + ", " + left + "} with dimensions " + w + " x " + h);
                        return [4 /*yield*/, this.generateBlankCanvas(w + offx, h + offy)];
                    case 2:
                        blank = _b.sent();
                        return [4 /*yield*/, sharp(image.source)
                                .resize(w, h)
                                .max()
                                .background({ r: 0, g: 0, b: 0, alpha: 0 })
                                .embed()
                                .toBuffer()];
                    case 3:
                        subfig = _b.sent();
                        return [4 /*yield*/, blank.overlayWith(subfig, { top: offy, left: offx }).toBuffer()];
                    case 4:
                        imgBuffer = _b.sent();
                        if (!image.caption) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.addCaption(imgBuffer, image.caption, this.panel.fontSize || 32, this.panel.fontFamily || 'Open Sans')];
                    case 5:
                        imgBuffer = _b.sent();
                        _b.label = 6;
                    case 6: return [4 /*yield*/, newSh.overlayWith(imgBuffer, {
                            top: top_1,
                            left: left
                        }).toBuffer()];
                    case 7:
                        buff = _b.sent();
                        return [4 /*yield*/, sharp(buff)];
                    case 8:
                        newSh = _b.sent();
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/, newSh];
                }
            });
        }); };
        this.addCaption = function (buf, caption, fontSize, font) { return __awaiter(_this, void 0, void 0, function () {
            var captBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        captBuffer = new Buffer("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\">\n      <style>.c { font-family: \"" + font + "\" }</style>\n      <text class=\"c\" x=\"0\" y=\"0\" dy=\"" + fontSize + "\" font-size=\"" + fontSize + "\" fill=\"#000\">" + caption + "</text>\n    </svg>");
                        return [4 /*yield*/, sharp(buf).overlayWith(captBuffer, { top: 0, left: 0 }).toBuffer()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Writes the generated figure panel out to file
         * @param sh The SharpInstance being written
         */
        this.writeOutput = function (sh) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sh.toFile(this.panel.output)
                            .then(function () { return true; })
                            .catch(function (err) { return console.log(err); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.panel = metadata;
    }
    return DefaultGenerator;
}());
exports.default = DefaultGenerator;
