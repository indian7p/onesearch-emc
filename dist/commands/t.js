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
const online_1 = require("./t/online");
const activity_1 = require("./t/activity");
const default_1 = require("./t/default");
const list_1 = require("./t/list");
exports.default = {
    name: 't',
    description: 'Searches for towns',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        message.channel.startTyping();
        switch (args[1]) {
            case 'activity':
                activity_1.default(message, args);
                break;
            case 'list':
                switch (args[2]) {
                    default:
                    case 'members':
                        list_1.default(message, { residents: 'desc' });
                        break;
                    case 'area':
                        list_1.default(message, { area: 'desc' });
                        break;
                }
                break;
            case 'online':
                online_1.default(message, args);
                break;
            default:
                const defMsg = yield default_1.default(message, args);
                message.channel.send(defMsg);
                message.channel.stopTyping();
                break;
        }
    })
};
//# sourceMappingURL=t.js.map