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
    name: 'link',
    description: 'Generates a link code for Discord and Minecraft link.',
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        let code = Math.floor(100000 + Math.random() * 900000);
        const codeDoc = yield models_1.LinkCode.findOne({ code: code }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (codeDoc)
            code = Math.floor(100000 + Math.random() * 900000);
        const document = new models_1.LinkCode({
            code: code,
            id: message.author.id,
        });
        document.save();
        if (message.channel.type !== 'dm') {
            const embed1 = new Discord.MessageEmbed()
                .setTitle('Link To Minecraft')
                .setColor(0x003175)
                .setDescription('We sent a message to your DMs with instructions.')
                .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
            message.channel.send(embed1);
        }
        const embed2 = new Discord.MessageEmbed()
            .setTitle('Link To Minecraft')
            .setColor(0x003175)
            .addField('Step 1 - Connect to server', 'Connect to \`verify.bcow.xyz\`, version 1.8.8-1.16.2')
            .addField('Step 2 - Link account', `Do not share your code with anyone else, the code expires in 10 minutes. Use the command \`/link ${code}\` on the Minecraft server.`)
            .addField('Step 3 - Done!', 'You should receive a message if it was successful.')
            .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.author.send(embed2);
    })
};
//# sourceMappingURL=link.js.map