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
const models_1 = require("../models/models");
exports.default = {
    name: 'stats',
    description: 'Shows bot stats',
    execute: (message, client) => __awaiter(void 0, void 0, void 0, function* () {
        message.channel.startTyping();
        const towns = yield models_1.Town.find({}).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        const nations = yield models_1.Nation.find({}).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        const results = yield models_1.Result.find({}).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        let resCount = [];
        for (var i = 0; i < towns.length; i++) {
            const town = towns[i];
            for (var i = 0; i < town.membersArr.length; i++) {
                resCount.push(1);
            }
        }
        const statsEmbed = new Discord.MessageEmbed()
            .setTitle('Stats')
            .setThumbnail('https://cdn.bcow.xyz/assets/onesearch.png')
            .setColor(0x003175)
            .addField('**Towny Stats**', '⠀', false)
            .addField('Nations', nations.length, true)
            .addField('Towns', towns.length, true)
            .addField('Residents', resCount.length, true)
            .addField('**Bot Stats**', '⠀', false)
            .addField('Servers', client.guilds.cache.size, true)
            .addField('Users', client.users.cache.size, true)
            .addField('Search Items', results.length, true)
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(statsEmbed);
        message.channel.stopTyping();
    })
};
//# sourceMappingURL=stats.js.map