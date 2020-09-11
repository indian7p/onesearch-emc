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
const statusMessage_1 = require("../functions/statusMessage");
const fetch_1 = require("../functions/fetch");
exports.default = {
    name: "queue",
    description: 'Shows current queue info',
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        message.channel.startTyping();
        let server = yield fetch_1.getPlayerCount();
        if (server.players.now < 0) {
            message.channel.send(statusMessage_1.errorMessage.setDescription('Error getting server info.'));
        }
        const mapData = yield fetch_1.getMapData().catch(err => {
            message.channel.stopTyping();
            message.channel.send(statusMessage_1.errorMessage.setDescription('Error occurred while getting map data.'));
            return;
        });
        const betaMapData = yield fetch_1.getBetaMap().catch(err => {
            message.channel.stopTyping();
            message.channel.send(statusMessage_1.errorMessage.setDescription('Error occurred while getting map data.'));
            return;
        });
        const classicMapData = yield fetch_1.getClassicMap().catch(err => {
            message.channel.stopTyping();
            message.channel.send(statusMessage_1.errorMessage.setDescription('Error occurred while getting map data.'));
            return;
        });
        const queue = server.players.now - mapData.currentcount - betaMapData.currentcount - classicMapData.currentcount < 0 ? 0 : server.players.now - mapData.currentcount;
        let queueEmbed = new Discord.MessageEmbed()
            .setTitle('Queue')
            .setColor(0x003175)
            .setThumbnail('https://cdn.bcow.tk/logos/EarthMC.png')
            .addField('Server Total', `${server.players.now}/${server.players.max}`)
            .addField('In Queue for Towny', queue)
            .addField('Towny', `${mapData.currentcount >= 100 ? `**FULL** ${mapData.currentcount}` : mapData.currentcount}/100`, true)
            .addField('Beta', `${betaMapData.currentcount >= 60 ? `**FULL** ${betaMapData.currentcount}` : betaMapData.currentcount}/60`, true)
            .addField('Classic', `${classicMapData.currentcount >= 100 ? `**FULL** ${classicMapData.currentcount}` : classicMapData.currentcount}/100`, true)
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(queueEmbed);
        message.channel.stopTyping();
    })
};
//# sourceMappingURL=queue.js.map