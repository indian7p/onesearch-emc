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
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Invalid username/UUID.'));
    const player = yield models_1.PlayerP.findOne({ uuid: data.data.player.raw_id }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!player)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('No player activity data.'));
    const location = player.lastLocation.replace(/ /, '').split(',');
    const locationString = location == "none" ? `Last location could not be found.` : `[${player.lastLocation}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`;
    const resEmbed = new Discord.MessageEmbed()
        .setTitle(`${data.data.player.username} - Player Activity`)
        .setColor(0x003175)
        .setThumbnail(data.data.player.avatar)
        .addField('Last Online', player.lastOnline)
        .addField('Last Location', locationString)
        .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(resEmbed);
});
//# sourceMappingURL=activity.js.map