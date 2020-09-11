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
const activity_1 = require("./pl/activity");
const chistory_1 = require("./pl/chistory");
const location_1 = require("./pl/location");
const default_1 = require("./pl/default");
const nhistory_1 = require("./pl/nhistory");
const online_1 = require("./pl/online");
const staff_1 = require("./pl/staff");
const uuid_1 = require("./pl/uuid");
exports.default = {
    name: 'pl',
    description: 'Searches for players',
    execute: (message, args, client) => __awaiter(void 0, void 0, void 0, function* () {
        switch (args[1]) {
            case 'chistory':
                chistory_1.default(message, args);
                break;
            case 'nhistory':
                nhistory_1.default(message, args);
                break;
            case 'uuid':
                uuid_1.default(message, args);
                break;
            case 'online':
                online_1.default(message, args);
                break;
            case 'activity':
                activity_1.default(message, args);
                break;
            case 'location':
                location_1.default(message, args);
                break;
            case 'staff':
                staff_1.default(message);
                break;
            default:
                default_1.default(message, args, client);
                break;
        }
    })
};
//# sourceMappingURL=pl.js.map