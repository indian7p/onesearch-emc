const Discord = require("discord.js");

module.exports = {
    name: "randomnumber",
    description: "Generates a random number",
    execute(message, args) {
        let errorMessage = new Discord.RichEmbed().setTitle(":x: **Error**").setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo%20450.png');
        var range1 = args[1];
        var range2 = args[2];
        if (!args[1]) var range1 = 1;
        if (!args[2]) var range2 = 100;
        if (!isFinite(range1)) return message.channel.send(errorMessage.setDescription('Command usage: 1!randomnumber [min] <- Needs to be a number [max]'))
        if (!isFinite(range2)) return message.channel.send(errorMessage.setDescription('Command usage: 1!randomnumber [min] [max] <- Needs to be a number'))
        let rng1 = Math.floor(Math.random() * (range2 - range1 + 1) + range1);
        const rngEmbed1 = new Discord.RichEmbed()
          .setTitle('Random Number')
          .setColor(0xfefefe)
          .addField('Range', range1 + '-' + range2)
          .addField('Number', rng1)
          .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png')
        message.channel.send(rngEmbed1);
    }
};