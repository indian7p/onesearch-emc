"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const config = require("./config.json");
const models_1 = require("./models/models");
const client = new Discord.Client();
mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
let commands = {};
const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.name] = command;
}
client.login(config.TOKEN);
const PREFIX = '1!';
client.on('ready', () => {
    let statuses = ['Search towns, nations, discords and players fast. 1!s [nation/town/anything] or 1!pl [username or UUID]', 'Statuspage: bcow.statuspage.io', 'Invite me! l.bcow.tk/osbot', 'github.com/imabritishcow/onesearch-emc'];
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status);
    }, 60000);
    console.log('Bot is online.');
});
client.on('message', (message) => {
    const args = message.content.substring(PREFIX.length).split(' ');
    if (!message.content.includes(PREFIX))
        return;
    if (message.content.startsWith(PREFIX) == false)
        return;
    switch (args[0]) {
        case 'crawl':
            commands['crawl'].execute(message, models_1.Result, client);
            break;
        case 'help':
            commands['help'].execute(message, client);
            break;
        case 'info':
            commands['info'].execute(message, client);
            break;
        case 'link':
            commands['link'].execute(message);
            break;
        case 'listaudit':
            commands['listaudit'].execute(message, models_1.Nation, models_1.NationP);
            break;
        case 'n':
        case 'nation':
            commands['n'].execute(message, args, models_1.Nation, models_1.NationP, models_1.Town, models_1.PlayerP, client);
            break;
        case 'ng':
            commands['ng'].execute(message, args, models_1.NationGroup, client);
            break;
        case 'nonation':
            commands['nonation'].execute(message, args, models_1.Town, models_1.Nation, client);
            break;
        case 'notown':
            commands['notown'].execute(message, models_1.Town, client);
            break;
        case 'pl':
        case 'player':
            commands['pl'].execute(message, args, client);
            break;
        case 'queue':
            commands['queue'].execute(message, client);
            break;
        case 's':
        case 'search':
            commands['s'].execute(message, args, models_1.Nation, models_1.NationGroup, models_1.NationP, models_1.Result, models_1.Town, models_1.TownP, client);
            break;
        case 'setn':
            commands['setn'].execute(message, args, models_1.Nation, models_1.NationP);
            break;
        case 'setpl':
            commands['setpl'].execute(message, args, models_1.Player, client);
            break;
        case 'setprofile':
            commands['setprofile'].execute(message, args);
            break;
        case 'sett':
            commands['sett'].execute(message, args, models_1.Town, models_1.TownP, client);
            break;
        case 'stats':
            commands['stats'].execute(message, client, models_1.Town, models_1.Nation, models_1.Result);
            break;
        case 'stopTyping':
            message.channel.stopTyping();
            break;
        case 't':
        case 'town':
            commands['t'].execute(message, args, models_1.Town, models_1.Nation, models_1.TownP, models_1.PlayerP, client);
            break;
        // For converting Player to PlayerP
        /*case 'merge':
            Player.find({}, function (err, players) {
                for (var i = 0; i < players.length; i++) {
                    const player = players[i];

                    PlayerP.findOne({uuid: player.id}, function(err, playerp) {
                        if (playerp) {
                            playerp.history = player.history;
                            playerp.status = player.status;
                            playerp.save();
                        } else {
                            const doc = new PlayerP({
                                uuid: player.id,
                                lastLocation: 'none',
                                lastOnline: 'No data.',
                                history: player.history,
                                status: player.status
                            })

                            doc.save();
                        }
                    })
                }
            })
            break;*/
    }
});
//# sourceMappingURL=app.js.map