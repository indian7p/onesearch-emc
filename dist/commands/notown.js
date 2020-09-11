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
const fetch_1 = require("../functions/fetch");
const statusMessage_1 = require("../functions/statusMessage");
exports.default = {
    name: 'notown',
    description: 'Finds players with no town',
    execute: (message, Town) => __awaiter(void 0, void 0, void 0, function* () {
        message.channel.startTyping();
        const data = yield fetch_1.getMapData();
        let townless = [];
        for (var i = 0; i < data.players.length; i++) {
            const player = data.players[i];
            const town = yield Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => {
                message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
                message.channel.stopTyping();
            });
            if (town == null) {
                townless.push(player.account);
            }
        }
        let resEmbed = new Discord.MessageEmbed()
            .setTitle('Townless Players')
            .setColor(0x003175)
            .setDescription(`**Players [${townless.length}]**\n` + '```' + townless.toString().replace(/,/g, ', ') + '```')
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(resEmbed);
        message.channel.stopTyping();
    })
};
//# sourceMappingURL=notown.js.map