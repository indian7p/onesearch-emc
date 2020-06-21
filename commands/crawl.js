const Discord = require('discord.js');
const config = require("../config.json");
const ogs = require('open-graph-scraper');

module.exports = {
	name: 'crawl',
	description: 'Gets OpenGraph tags from a website and create a new result.',
	execute(message, Result) {
    let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
    if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));
    
    const options = { url: message.content.slice(8) };
    
    function sendPreview() {
      let query = message.content.slice(8);
			Result.findOne({ link: query }, function(err, data) {
				if (err) throw err;
				let resEmbed = new Discord.MessageEmbed()
					.setTitle(data.name)
					.setURL(data.link)
					.setDescription(data.desc)
					.setThumbnail(data.imgLink)
					.setColor(0x003175)
          .setFooter(`Result Preview | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
        message.channel.send(resEmbed)
			});
    }

		ogs(options, async (error, results, response) => {
			if (error) return message.channel.send(errorMessage.setDescription('An error occurred.'));
			console.log('results:', results);

			if (results.ogTitle == null) return message.channel.send(errorMessage.setDescription('Missing og:title tag.'));
			if (results.ogDescription == null) return message.channel.send(errorMessage.setDescription('Missing og:description tag.'));
			if (results.ogImage == null) return message.channel.send(errorMessage.setDescription('Missing og:image tag.'));

			if (!results.ogSiteName) {
				if (!results.imgLink) {
					let newResult = new Result({
						name: `${results.ogTitle}`,
						desc: results.ogDescription,
						link: message.content.slice(8)
					});
          await newResult.save();
          sendPreview();
				} else {
					let newResult = new Result({
						name: `${results.ogTitle}`,
						desc: results.ogDescription,
						imgLink: results.ogImage.replace("https://", "https://cdn.statically.io/img/"),
						link: message.content.slice(8)
					});
          await newResult.save();
          sendPreview();
				}
			} else {
				if (!results.imgLink) {
					let newResult = new Result({
						name: `${results.ogTitle} - ${results.ogSiteName}`,
						desc: results.ogDescription,
						link: message.content.slice(8)
					});
          await newResult.save();
          sendPreview();
				} else {
					let newResult = new Result({
						name: `${results.ogTitle} - ${results.ogSiteName}`,
						desc: results.ogDescription,
						imgLink: results.ogImage.replace("https://", "https://cdn.statically.io/img/"),
						link: message.content.slice(8)
					});
          await newResult.save();
          sendPreview();
				}
			}
		});
	}
};