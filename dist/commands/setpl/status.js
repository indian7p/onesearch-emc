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
const models_1 = require("../../models/models");
exports.default = (message, args, player, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (args[3] == 'null') {
        if (player) {
            player.history = null;
            player.save();
        }
        message.channel.send(statusMessage_1.successMessage.setDescription(`Cleared the player's status.`));
        return;
    }
    if (player) {
        player.status = message.content.slice(15 + args[2].length);
    }
    else {
        let newDoc = new models_1.Player({
            id: data.data.player.raw_id,
            status: message.content.slice(15 + args[2].length)
        });
        newDoc.save(function (err) {
            if (err)
                return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
            message.channel.send(statusMessage_1.successMessage.setDescription(`Set ${args[2]}'s status to ${message.content.slice(15 + args[2].length)}.`));
        });
    }
});
//# sourceMappingURL=status.js.map