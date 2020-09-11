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
    const mapData = yield fetch_1.getMapData().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('Error getting map data.')));
    ;
    const playerData = yield fetch_1.getPlayer(args[2]);
    if (playerData.success == false)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Invalid username/UUID.'));
    let playerList = [];
    let location = 'Unable to get the players location. Make sure they are not under a block, invisible, or underwater.';
    for (var i = 0; i < mapData.players.length; i++) {
        const player = mapData.players[i];
        playerList.push(player.account);
        if (player.account == playerData.data.player.username) {
            if (player.world != 'earth')
                return;
            location = `[${player.x}, ${player.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${player.x}&y=64&z=${player.z})`;
        }
    }
    if (!playerList.includes(playerData.data.player.username))
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Player is not online.'));
    const embed = new Discord.MessageEmbed()
        .setTitle(playerData.data.player.username)
        .setThumbnail(`https://crafatar.com/avatars/${playerData.data.player.raw_id}?overlay`)
        .addField('Location', location)
        .setColor(0x003175)
        .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
    message.channel.send(embed);
});
//# sourceMappingURL=location.js.map