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
const models_1 = require("../models/models");
const statusMessage_1 = require("../functions/statusMessage");
const youtube_1 = require("./setprofile/youtube");
const twitter_1 = require("./setprofile/twitter");
const twitch_1 = require("./setprofile/twitch");
const desc_1 = require("./setprofile/desc");
const unlink_1 = require("./setprofile/unlink");
exports.default = {
    name: 'setprofile',
    description: 'Sets profile information',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle('1!setprofile')
            .setDescription('Using `null` as the value will clear that type')
            .setColor(0x003175)
            .addField('1!setpl historyevent', 'Added a history event')
            .addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:726833035999182898> Verified, ⚠️ Scammer, ⛔ BANNED')
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        const player = yield models_1.PlayerP.findOne({ discord: message.author.id }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (!player)
            return message.channel.send(statusMessage_1.errorMessage.setDescription('You have not linked your Minecraft account with Discord. Use 1!link to link.'));
        if (!args[1])
            return message.channel.send(helpEmbed);
        if (!args[2])
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));
        switch (args[1]) {
            case 'youtube':
                youtube_1.default(message, args, player);
                break;
            case 'twitter':
                twitter_1.default(message, args, player);
                break;
            case 'twitch':
                twitch_1.default(message, args, player);
                break;
            case 'desc':
                desc_1.default(message, args, player);
                break;
            case 'unlink':
                unlink_1.default(message, player);
                break;
        }
    })
};
//# sourceMappingURL=setprofile.js.map