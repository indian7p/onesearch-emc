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
const models_1 = require("../models/models");
const historyevent_1 = require("./setpl/historyevent");
const status_1 = require("./setpl/status");
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const config = require('../config.json');
const { errorMessage, successMessage } = require('../functions/statusMessage');
exports.default = {
    name: 'setpl',
    description: 'Sets player information',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle('1!setpl')
            .setDescription('Using `null` as the value will clear that type')
            .setColor(0x003175)
            .addField('1!setpl historyevent', 'Added a history event')
            .addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:726833035999182898> Verified, ⚠️ Scammer, ⛔ BANNED')
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        if (!config.BOT_ADMINS.includes(message.author.id))
            return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));
        if (!args[2])
            return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setpl [type] [player] <- Missing [value]'));
        if (!args[3])
            return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));
        const data = yield fetch_1.getPlayer(args[2]);
        const player = yield models_1.Player.findOne({ id: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
        switch (args[1]) {
            case 'historyevent':
                historyevent_1.default(message, args, player, data);
                break;
            case 'status':
                status_1.default(message, args, player, data);
                break;
            default:
                message.channel.send(helpEmbed);
                break;
        }
    })
};
//# sourceMappingURL=setpl.js.map