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
const models_1 = require("../../models/models");
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch_1.getMapData();
    const query = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');
    const town = yield models_1.Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!town) {
        message.channel.stopTyping();
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
    }
    let online = [];
    for (var i = 0; i < data.players.length; i++) {
        const player = data.players[i];
        const playerTown = yield models_1.Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (playerTown && playerTown.name == town.name) {
            online.push(player.account);
        }
    }
    const onlineCount = online.length == 0 ? 0 : online.length;
    if (online.length == 0)
        online.push('No players online');
    const embed = new Discord.MessageEmbed()
        .setTitle(`Players Online - ${town.name}`)
        .setColor(0x003175)
        .setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ')}\`\`\``)
        .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(embed);
    message.channel.stopTyping();
});
//# sourceMappingURL=online.js.map