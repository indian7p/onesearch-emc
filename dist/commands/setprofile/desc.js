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
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, args, player) => __awaiter(void 0, void 0, void 0, function* () {
    if (args[2] == 'null') {
        player.desc = undefined;
        player.save();
        message.channel.send(statusMessage_1.successMessage.setDescription('Successfully cleared profile description.'));
    }
    else {
        const desc = message.content.slice(args[0].length + args[1].length + 4);
        player.desc = desc;
        player.save();
        message.channel.send(statusMessage_1.successMessage.setDescription('Successfully set profile description.'));
    }
});
//# sourceMappingURL=desc.js.map