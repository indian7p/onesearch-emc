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
const staffList = require("../../staffList.json");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    message.channel.startTyping();
    const data = yield fetch_1.getMapData();
    let playersOnline = [];
    for (var i = 0; i < data.players.length; i++) {
        const player = data.players[i];
        playersOnline.push(player.account);
    }
    switch (args[2]) {
        case 'staff':
            let playerList = playersOnline.filter((player) => {
                return staffList.staffList.includes(player);
            });
            let listLength = playerList.length;
            if (playerList.length == 0) {
                playerList.push('No staff found. Try again later.');
                listLength = 0;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle('Players Online - Staff')
                .setColor(0x003175)
                .setDescription(`**Players [${listLength}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
                .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
            message.channel.send(embed);
            message.channel.stopTyping();
            break;
        default:
            if (!args[2]) {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Players Online')
                    .setColor(0x003175)
                    .setDescription(`**Players [${playersOnline.length}]**\`\`\`${playersOnline.toString().replace(/,/g, ', ')}\`\`\``)
                    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
                message.channel.send(embed);
            }
            else {
                const playerData = yield fetch_1.getPlayer(args[2]);
                if (playerData.success == false)
                    return message.channel.send(statusMessage_1.errorMessage.setDescription('Invalid username/UUID.'));
                let status = 'Offline';
                if (playersOnline.includes(playerData.data.player.username)) {
                    status = 'Online';
                }
                let embed = new Discord.MessageEmbed()
                    .setTitle(playerData.data.player.username).setColor(0x003175)
                    .addField('Status', status)
                    .setThumbnail(`https://crafatar.com/avatars/${playerData.data.player.raw_id}?overlay`)
                    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
                message.channel.send(embed);
            }
            message.channel.stopTyping();
            break;
    }
});
//# sourceMappingURL=online.js.map