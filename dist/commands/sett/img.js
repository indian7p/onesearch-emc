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
const models_1 = require("../../models/models");
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, args, town, townp) => __awaiter(void 0, void 0, void 0, function* () {
    if (args[3] == 'null') {
        if (townp) {
            townp.imgLink = null;
            townp.save();
        }
        message.channel.send(statusMessage_1.successMessage.setDescription(`Cleared the town's image.`));
    }
    let imgLink = message.content.slice(9 + args[1].length + args[2].length).replace(/^(http|https):\/\//, 'https://cdn.statically.io/img/');
    if (!townp) {
        let newDoc = new models_1.TownP({
            name: town.name,
            imgLink: imgLink
        });
        newDoc.save(function (err) {
            if (err)
                return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
            message.channel.send(statusMessage_1.successMessage.setDescription(`Successfully set the town's image.`));
        });
    }
    else {
        townp.imgLink = imgLink;
        townp.save();
        message.channel.send(statusMessage_1.successMessage.setDescription(`Successfully set the town's image.`));
    }
});
//# sourceMappingURL=img.js.map