const Discord = require('discord.js');

module.exports = {
	name: 'stats',
	description: 'Shows bot stats',
	execute(message, client, Town, Nation, Result) {
		message.channel.startTyping();
		Town.find({}, async function(err, towns) {
      let counter = 0;
      let resCount = [];
			towns.forEach((town) => {
        town.membersArr.forEach(member => {
          resCount.push(1)
        })
        counter++
        if(counter == towns.length) {
          Nation.find({}, function(err, nations) {
            Result.find({}, function(err, results) {
              let statsEmbed = new Discord.MessageEmbed()
                .setTitle('Stats')
                .setThumbnail('https://cdn.bcow.tk/assets/logo-new.png')
                .setColor(0x003175)
                .addField('**Towny Stats**', '⠀', false)
                .addField('Nations', nations.length, true)
                .addField('Towns', towns.length, true)
                .addField('Residents', resCount.length, true)
                .addField('**Bot Stats**', '⠀', false)
                .addField('Servers', client.guilds.cache.size, true)
                .addField('Users', client.users.cache.size, true)
                .addField('Search Items', results.length, true)
                .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
              message.channel.send(statsEmbed);
              message.channel.stopTyping();
            });
          });
        }
			});
		});
	}
};
