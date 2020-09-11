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
const Discord = require("discord.js");
const fetch_1 = require("../../functions/fetch");
const statusMessage_1 = require("../../functions/statusMessage");
const models_1 = require("../../models/models");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch_1.getPlayer(args[2]);
    if (data.success == false)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Invalid username or UUID'));
    const player = yield models_1.Player.findOne({ id: data.data.player.raw_id }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!player || !player.history || player.history.length == 0)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('History not found'));
    let resEmbedPl = new Discord.MessageEmbed()
        .setTitle(`Player History - ${data.data.player.username}`)
        .setDescription('⚠ Player event history started on 4/17/2020. Previous events are missing.')
        .setColor(0x003175)
        .addField('Current Status', player.status)
        .addField('Player History', '```' + player.history.toString().replace(/,/g, '\n') + '```')
        .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(resEmbedPl);
});
//# sourceMappingURL=chistory.js.map