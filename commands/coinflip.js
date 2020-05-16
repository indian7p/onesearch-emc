const Discord = require("discord.js");

module.exports = {
    name: "coinflip",
    description: "Flips a coin",
    execute(message) {
        let x = Math.floor(Math.random() * 2) + 1;
        if (x == 1) {
            const coinEmbedHeads = new Discord.RichEmbed()
                .setTitle('Coin Flip')
                .addField('Result', 'Heads')
                .setColor(0xfefefe)
                .setThumbnail('https://cdn.bcow.tk/assets/heads.png')
                .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png')
            message.channel.send(coinEmbedHeads)
        } else {
            const coinEmbedTails = new Discord.RichEmbed()
                .setTitle('Coin Flip')
                .addField('Result', 'Tails')
                .setColor(0xfefefe)
                .setThumbnail('https://cdn.bcow.tk/assets/tails.png')
                .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png')
            message.channel.send(coinEmbedTails)
        }
    }
};