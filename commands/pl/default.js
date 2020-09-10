const Discord = require('discord.js');
const staffList = require('../../staffList.json');
const { getPlayer } = require("../../functions/fetch");
const { PlayerP, Town } = require('../../models/models');
const { errorMessage } = require('../../functions/statusMessage');

module.exports = async (message, args, client) => {
  const data = await getPlayer(args[1]);

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'))
  message.channel.startTyping();

  let emColor = 0x003175;
  if (staffList.staffList.includes(data.data.player.username)) {
    emColor = 0x00aa00;
  }

  const player = await PlayerP.findOne({ uuid: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  let discord;
  if (player.discord) {
    client.users.fetch(player.discord).then(user => {
      discord = `\`\@${user.username}#${user.discriminator}\``;
    })
  }

  let name = data.data.player.username;
  let status = 'This player is not on the list. Scammer? Report now at [EarthMC Scams](https://discord.gg/8V6kTxW).';
  if (player) {
    if (player.status.includes('Verified')) {
      name = '<:verified:726833035999182898> ' + data.data.player.username;
    }
    status = player.status;
  }

  const location = player.lastLocation.replace(/ /, '').split(',');
  const locationString = location == "none" ? `Last location could not be found.` : `[${player.lastLocation}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`

  const desc = !player.desc ? ' ' : player.desc;

  const resEmbed = new Discord.MessageEmbed()
    .setTitle(name)
    .setDescription(desc)
    .setURL(`https://namemc.com/profile/${data.data.player.id}`)
    .setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
    .setColor(emColor)
    .addField('Status', status)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  const town = await Town.findOne({ membersArr: { $in: [data.data.player.username] } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (player.discord) {
    resEmbed.addField('Discord', discord, true);
  }
  if (player.youtube) {
    resEmbed.addField('<:youtube:731663574052896789> YouTube', `[YouTube](${player.youtube})`, true);
  }
  if (player.twitch) {
    resEmbed.addField('<:twitch:753645503601967194> Twitch', `[Twitch](${player.twitch})`, true);
  }
  if (player.twitter) {
    resEmbed.addField('<:twitter:753645695579193355> Twitter', `[Twitter](${player.twitter})`, true);
  }
  
  if (town.mayor == data.data.player.username) {
    if (town.capital == true) {
      resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`);
    } else {
      resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`);
    }
  } else {
    resEmbed.addField('Town', `${town.name} (${town.nation})`);
  }

  resEmbed.addField('Last Online', player.lastOnline, true).addField('Last Location', locationString, true);

  message.channel.send(resEmbed);

  message.channel.stopTyping();
}