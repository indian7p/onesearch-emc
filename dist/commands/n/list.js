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
const paginator_1 = require("../../functions/paginator");
const models_1 = require("../../models/models");
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, sortingOpts) => __awaiter(void 0, void 0, void 0, function* () {
    const nations = yield models_1.Nation.find({}).sort(sortingOpts).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!nations)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('The database may be updating. Try again later.'));
    let nationList = [];
    for (var i = 0; i < nations.length; i++) {
        const nation = nations[i];
        nationList.push(`${nation.name.replace(/_/g, '\_')} - Members: ${nation.residents} - Area: ${nation.area}`);
    }
    let pages = nationList.map(() => nationList.splice(0, 10)).filter(a => a);
    let embeds = [];
    for (var i = 0; i < pages.length; i++) {
        const page = pages[i];
        let list = page.toString().replace(/,/g, '\n');
        let embed = new Discord.MessageEmbed()
            .setTitle('Nation List')
            .setDescription(`\`\`\`${list}\`\`\``)
            .setColor(0x003175)
            .setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
        embeds.push(embed);
    }
    message.channel.send(embeds[0]).then((m) => {
        paginator_1.paginator(message.author.id, m, embeds, 0);
    });
    message.channel.stopTyping();
});
//# sourceMappingURL=list.js.map