"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
exports.default = {
    name: 'help',
    description: 'Shows bot commands',
    execute(message) {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('Join my [discord](https://discord.gg/mXrTXhB)!')
            .setThumbnail('https://cdn.bcow.xyz/assets/onesearch.png')
            .setColor(0x003175)
            .addField('1!info', 'Shows bot info')
            .addField('1!queue', 'Shows current queue info.')
            .addField('1!s [search term]', 'Search OneSearch for towns, nations, discords, and more.')
            .addField('1!n [nation]', 'Finds nation information')
            .addField('1!nonation', 'Gets towns without a nation')
            .addField('1!t [town]', 'Finds town information')
            .addField('1!notown', 'Gets towns without a nation')
            .addField('1!pl [username or UUID]', 'Gets player information')
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(helpEmbed);
    }
};
//# sourceMappingURL=help.js.map