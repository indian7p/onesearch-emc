const Discord = require("discord.js");

module.exports = {
    name: "info",
    description: "Shows bot information",
    execute(message, args) {
        const helpEmbed = new Discord.RichEmbed()
          .setTitle("Info")
          .setDescription('Find towns, nations, and discords with OneSearch for EarthMC.')
          .setThumbnail('https://cdn.bcow.tk/assets/logo.png')
          .setColor(0x0071bc)
          .addField('Bot Invite', 'https://l.bcow.tk/osbot/')
          .addField('GitHub', 'https://github.com/imabritishcow/onesearch-emc')
          .addField('Trello', 'https://trello.com/b/LVy0jGYg/onesearch')
          .addField('Feedback', 'https://forms.gle/ZEzk1tTBhcK7iFJn7')
          .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png')
        message.channel.send(helpEmbed)
    }
};