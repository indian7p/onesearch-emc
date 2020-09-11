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
const amenities_1 = require("./setn/amenities");
const amenities_2 = require("./setn/amenities");
const img_1 = require("./sett/img");
const status_1 = require("./setpl/status");
const config = require("../config.json");
const statusMessage_1 = require("../functions/statusMessage");
exports.default = {
    name: 'setn',
    description: 'Sets nation information',
    execute: (message, args, Nation, NationP) => __awaiter(void 0, void 0, void 0, function* () {
        if (!config.BOT_ADMINS.includes(message.author.id))
            return message.channel.send(statusMessage_1.errorMessage.setDescription('You do not have permission to use this command.'));
        if (!args[2])
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Missing username or UUID. Command usage: 1!setn [type] [nation] <- Missing [value]'));
        if (args[1] == 'delete') {
        }
        else {
            if (!args[3])
                return message.channel.send(statusMessage_1.errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setn [type] [nation] [value] <- Missing'));
        }
        let query = args[2].toLowerCase();
        const nation = yield Nation.findOne({ nameLower: query }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (!nation)
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Nation not found'));
        const nationp = yield NationP.findOne({ name: nation.nameLower }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        switch (args[1]) {
            case 'amenities':
                amenities_1.default(message, args, nation, nationp);
                break;
            case 'link':
                amenities_2.default(message, args, nation, nationp);
                break;
            case 'img':
                img_1.default(message, args, nation, nationp);
                break;
            case 'status':
                status_1.default(message, args, nation, nationp);
                break;
        }
    })
};
//# sourceMappingURL=setn.js.map