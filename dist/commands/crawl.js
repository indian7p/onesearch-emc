"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const config = require("../config.json");
const search = require("youtube-search");
const statusMessage_1 = require("../functions/statusMessage");
const metaget = require("metaget");
const models_1 = require("../models/models");
exports.default = {
    name: 'crawl',
    description: 'Gets OpenGraph tags from a website and create a new result.',
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (!config.BOT_ADMINS.includes(message.author.id))
            return message.channel.send(statusMessage_1.errorMessage.setDescription('You do not have permission to use this command.'));
        function sendPreview() {
            return __awaiter(this, void 0, void 0, function* () {
                let query = message.content.slice(8);
                const data = yield models_1.Result.findOne({ link: query }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
                let resEmbed = new Discord.MessageEmbed()
                    .setTitle(data.name).setURL(data.link)
                    .setDescription(data.desc)
                    .setThumbnail(data.imgLink)
                    .setColor(0x003175)
                    .setFooter(`Result Preview | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
                message.channel.send(resEmbed);
            });
        }
        let meta;
        try {
            meta = yield metaget.fetch(message.content.slice(8));
        }
        catch (_a) {
            return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
        }
        if (meta['og:title'] == null)
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Missing og:title tag.'));
        if (meta['og:description'] == null)
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Missing og:description tag.'));
        if (meta['og:image'] == null)
            message.channel.send(statusMessage_1.errorMessage.setDescription('Missing og:image tag.'));
        if (!meta['og:site_name']) {
            if (!meta['og:image']) {
                let newResult = new models_1.Result({
                    name: `${meta['og:title']}`,
                    desc: meta['og:description'],
                    link: message.content.slice(8)
                });
                yield newResult.save();
                sendPreview();
            }
            else {
                let newResult = new models_1.Result({
                    name: `${meta['og:title']}`,
                    desc: meta['og:description'],
                    imgLink: meta['og:image'].url.replace('https://', 'https://cdn.statically.io/img/'),
                    link: message.content.slice(8)
                });
                yield newResult.save();
                sendPreview();
            }
        }
        else {
            if (meta['og:site_name'].includes('YouTube')) {
                search(meta['og:title'], { maxResults: 1, key: config.YT_API_KEY }, function (err, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            return console.log(err);
                        let newResult = new models_1.Result({
                            name: `${meta['og:title']} - ${result[0].channelTitle} - ${meta['og:site_name']}`,
                            desc: meta['og:description'],
                            themeColor: 'ff0000',
                            imgLink: result[0].thumbnails.medium.url,
                            link: message.content.slice(8)
                        });
                        yield newResult.save();
                        sendPreview();
                    });
                });
            }
            else {
                if (!meta['og:image']) {
                    let newResult = new models_1.Result({
                        name: `${meta['og:title']} - ${meta['og:site_name']}`,
                        desc: meta['og:description'],
                        link: message.content.slice(8)
                    });
                    yield newResult.save();
                    sendPreview();
                }
                else {
                    let newResult = new models_1.Result({
                        name: `${meta['og:title']} - ${meta['og:site_name']}`,
                        desc: meta['og:description'],
                        imgLink: meta['og:image'].url.replace('https://', 'https://cdn.statically.io/img/'),
                        link: message.content.slice(8)
                    });
                    yield newResult.save();
                    sendPreview();
                }
            }
        }
    })
};
//# sourceMappingURL=crawl.js.map