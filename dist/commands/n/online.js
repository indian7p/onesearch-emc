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
const models_1 = require("../../models/models");
const fetch_1 = require("../../functions/fetch");
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const onQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');
    const data = yield fetch_1.getMapData();
    const nation = yield models_1.Nation.findOne({ nameLower: onQuery }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!nation) {
        message.channel.send(statusMessage_1.errorMessage.setDescription('Nation not found. The database may be updating, try again in a minute.'));
        message.channel.stopTyping();
        return;
    }
    let online = [];
    for (var i = 0; i < data.players.length; i++) {
        const player = data.players[i];
        const playerTown = yield models_1.Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (playerTown && playerTown.nation == nation.name) {
            online.push(player.account);
        }
    }
    const onlineCount = online.length == 0 ? 0 : online.length;
    if (online.length == 0)
        online.push('No players online');
    let embed = new Discord.MessageEmbed()
        .setTitle(`Players Online - ${nation.name.replace(/_/g, '\_')}`)
        .setColor(0x003175)
        .setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ').replace(/_/g, '\_')}\`\`\``)
        .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(embed);
    message.channel.stopTyping();
});
//# sourceMappingURL=online.js.map