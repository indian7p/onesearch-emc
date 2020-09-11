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
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch_1.getPlayer(args[2]);
    if (data.success == false)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Invalid username or UUID'));
    const resEmbedU = new Discord.MessageEmbed()
        .setTitle(`UUID - ${data.data.player.username}`)
        .setColor(0x003175)
        .setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
        .addField('UUID', data.data.player.raw_id)
        .addField('Formatted', data.data.player.id)
        .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(resEmbedU);
});
//# sourceMappingURL=uuid.js.map