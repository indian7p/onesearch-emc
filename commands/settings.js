const Discord = require('discord.js');

module.exports = {
  name: 'settings',
  description: 'OneSearch Settings',
  execute: (message, Setting) => {
    let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

    Setting.findOne({ id: message.author.id }, function (err, doc) {
      let enabled;
      if(doc){
        enabled = doc.spellCheck == true ? 'ENABLED': 'DISABLED'
      }else{
        enabled = 'DISABLED'
      }
      let settings = new Discord.MessageEmbed()
        .setTitle('OneSearch Settings')
        .setColor(0x003175)
        .setThumbnail('https://cdn.bcow.tk/assets/logo-new.png')
        .addField(`<:lightcheckmark:687794562638413844> Spell Check [${enabled}]`, 'Spell check uses the Bing Spell Check API, your searches will be sent to Microsoft ([Privacy Policy](https://www.microsoft.com/en-us/trust-center/privacy)) for processing. React with :white_check_mark: to enable/disable. It is disabled by default.')
        .setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
      message.channel.send(settings).then(async m => {
        let author = message.author.id
        m.react('✅')
        let reaction = await m.awaitReactions((reaction, user) => user.id == author && ['✅'].includes(reaction.emoji.name), { time: 240 * 1000, max: 1, errors: ['time'] }).catch(() => { })
        if (!reaction) return m.reactions.removeAll().catch(() => { })
        reaction = reaction.first()
        if (reaction) {
          if (doc) {
            if (doc.spellCheck == true) {
              doc.spellCheck = false;
              doc.save();
              message.channel.send(successMessage.setDescription('Disabled spellcheck.'))
            } else {
              doc.spellCheck = true;
              doc.save();
              message.channel.send(successMessage.setDescription('Enabled spellcheck.'))
            }
          } else {
            let newDoc = new Setting({
              id: message.author.id,
              spellCheck: true
            })
            newDoc.save()
            message.channel.send(successMessage.setDescription('Enabled spellcheck.'))
          }
        }
      })
    });
  }
};