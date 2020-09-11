"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassicMap = exports.getBetaMap = exports.getMapData = exports.getPlayerCount = exports.getPlayer = void 0;
const node_fetch_1 = require("node-fetch");
function getPlayer(player) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default(`https://playerdb.co/api/player/minecraft/${player}`);
        const data = yield res.json();
        return data;
    });
}
exports.getPlayer = getPlayer;
function getPlayerCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default(`https://35hooghtcc.execute-api.us-east-1.amazonaws.com/prod/getServerInfo`);
        const data = yield res.json();
        return data;
    });
}
exports.getPlayerCount = getPlayerCount;
function getMapData() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default("https://earthmc.net/map/up/world/earth/");
        const data = yield res.json();
        return data;
    });
}
exports.getMapData = getMapData;
function getBetaMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default("https://earthmc.net/map/beta/up/world/randomworld1/");
        const data = yield res.json();
        return data;
    });
}
exports.getBetaMap = getBetaMap;
function getClassicMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default("https://earthmc.net/map/classic/up/world/earth/");
        const data = yield res.json();
        return data;
    });
}
exports.getClassicMap = getClassicMap;
//# sourceMappingURL=fetch.js.map