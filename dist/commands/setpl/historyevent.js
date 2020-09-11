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
const moment = require("moment-timezone");
exports.default = (message, args, player, data) => __awaiter(void 0, void 0, void 0, function* () {
    const date = moment().tz('America/New_York').format('MMMM D YYYY h:mm A z');
    if (args[3] == 'null') {
        if (player) {
            player.history = null;
            player.save();
        }
        message.channel.send(statusMessage_1.successMessage.setDescription(`Cleared the player's history.`));
        return;
    }
    if (player) {
        let old = player.history;
        let newElement = [`${date} - ${player.status} - ${message.content.slice(10 + args[1].length + args[2].length)}`];
        player.history = [...old, ...newElement];
        player.save(function (err) {
            if (err)
                return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
            message.channel.send(statusMessage_1.successMessage.setDescription(`Added a history event for ${data.data.player.username}.`));
        });
    }
    else {
        message.channel.send(statusMessage_1.errorMessage.setDescription('Set a status before adding a history event.'));
    }
});
//# sourceMappingURL=historyevent.js.map