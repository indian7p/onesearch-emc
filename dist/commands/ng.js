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
const paginator_1 = require("../functions/paginator");
exports.default = {
    name: 'ng',
    description: 'Gets info about nation groups.',
    execute: (message, args, NationGroup, client) => __awaiter(void 0, void 0, void 0, function* () {
        const query = message.content.slice(args[0].length + 3).toLowerCase();
        if (!args[1]) {
            let embeds = [];
            const nationGroups = yield NationGroup.find({}).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
            for (var i = 0; i < nationGroups.length; i++) {
                const nationGroup = nationGroups[i];
                let resEmbed = new Discord.MessageEmbed()
                    .setTitle(nationGroup.name)
                    .setURL(nationGroup.link)
                    .setColor(0x003175)
                    .setDescription(nationGroup.desc)
                    .setThumbnail(nationGroup.imgLink)
                    .addField('Leader', `\`\`\`${nationGroup.leader}\`\`\``, true)
                    .addField('Size', nationGroup.size, true)
                    .addField(`Members`, nationGroup.members, true)
                    .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
                    .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
                embeds.push(resEmbed);
            }
            message.channel.send(embeds[0]).then((m) => paginator_1.paginator(message.author.id, m, embeds, 0));
        }
        else {
            let embeds = [];
            const nationGroups = yield NationGroup.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
            for (var i = 0; i < nationGroups.length; i++) {
                const nationGroup = nationGroups[i];
                let resEmbed = new Discord.MessageEmbed()
                    .setTitle(nationGroup.name)
                    .setURL(nationGroup.link)
                    .setColor(0x003175)
                    .setDescription(nationGroup.desc)
                    .setThumbnail(nationGroup.imgLink)
                    .addField('Leader', `\`\`\`${nationGroup.leader}\`\`\``, true)
                    .addField('Size', nationGroup.size, true)
                    .addField(`Members`, nationGroup.members, true)
                    .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
                    .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
                embeds.push(resEmbed);
            }
            if (embeds.length == 0) {
                message.channel.send(statusMessage_1.errorMessage.setDescription('No results found.'));
            }
            else {
                message.channel.send(embeds[0]).then((m) => paginator_1.paginator(message.author.id, m, embeds, 0));
            }
        }
    })
};
//# sourceMappingURL=ng.js.map