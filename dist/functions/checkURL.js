"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function default_1(string) {
    let url;
    try {
        url = new url_1.URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
exports.default = default_1;
//# sourceMappingURL=checkURL.js.map