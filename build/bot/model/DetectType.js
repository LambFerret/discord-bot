"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectPlatform = exports.DetectType = void 0;
var DetectType;
(function (DetectType) {
    DetectType[DetectType["Broadcast"] = 0] = "Broadcast";
    DetectType[DetectType["NewPost"] = 1] = "NewPost";
    DetectType[DetectType["OwnerChat"] = 2] = "OwnerChat";
    DetectType[DetectType["Else"] = 3] = "Else";
})(DetectType = exports.DetectType || (exports.DetectType = {}));
var DetectPlatform;
(function (DetectPlatform) {
    DetectPlatform["Chzzk"] = "Chzzk";
    DetectPlatform["Afreeca"] = "Afreeca";
    DetectPlatform["Youtube"] = "Youtube";
    DetectPlatform["Twitch"] = "Twitch";
    DetectPlatform["NaverCafe"] = "NaverCafe";
})(DetectPlatform = exports.DetectPlatform || (exports.DetectPlatform = {}));
//# sourceMappingURL=DetectType.js.map