const Discord = require('discord.js');

module.exports = {
	name: 'calculator',
	description: 'Does what it says',
	execute(message, args) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('Command usage: 1!calculator [number1] [operator] [number2]'));
		if (!args[2]) return message.channel.send(errorMessage.setDescription('Command usage: 1!calculator [number1] [operator] [number2]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Command usage: 1!calculator [number1] [operator] [number2]'));
		if (!isFinite(args[1])) return message.channel.send(errorMessage.setDescription('Command usage: 1!calculator [number1] <- Needs to be a number [operator] [number2]'));
		if (!isFinite(args[3])) return message.channel.send(errorMessage.setDescription('Command usage: 1!calculator [number1] [operator] [number2] <- Needs to be a number'));
		if (args[2] === '+') var num = args[1] * 1 + args[3] * 1;
		if (args[2] === '-') var num = args[1] * 1 - args[3] * 1;
		if (args[2] === 'x') var num = args[1] * 1 * (args[3] * 1);
		if (args[2] === '÷') var num = args[1] * 1 / (args[3] * 1);
		if (args[2] === '*') var num = args[1] * 1 * (args[3] * 1);
		if (args[2] === '/') var num = args[1] * 1 / (args[3] * 1);
		if (args[2] === '^') var num = (args[1] * 1) ** (args[3] * 1);
		if (args[1] === '0' && args[2] === '/' && args[3] === '0')
			var num = `Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn't make sense. And Cookie Monster is sad that there are no cookies. And you are sad that you have no friends.`;
		const calcEmbed = new Discord.MessageEmbed()
			.setTitle('Calculator')
			.addField('Input', args[1] + args[2] + args[3])
			.addField('Answer', num)
			.setColor(0xfefefe)
			.setThumbnail('https://cdn.bcow.tk/assets/calculator.png')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		message.channel.send(calcEmbed);
	}
};
