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
const statusMessage_1 = require("../../functions/statusMessage");
const models_1 = require("../../models/models");
exports.default = (message, args, nation, nationp) => __awaiter(void 0, void 0, void 0, function* () {
    let AMNTString = message.content.slice(9 + args[1].length + args[2].length).replace(':NehterPortal:', '<a:NetherPortal:696081909167423567>');
    if (args[3] == 'null') {
        if (nationp) {
            nationp.amenities = null;
            nationp.save();
        }
        message.channel.send(statusMessage_1.successMessage.setDescription(`Cleared the nation's amenities`));
        return;
    }
    if (!nationp) {
        let newDoc = new models_1.NationP({
            name: nation.nameLower,
            amenities: AMNTString
        });
        newDoc.save(function (err) {
            if (err)
                return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
            message.channel.send(statusMessage_1.successMessage.setDescription(`Set set the nation's amenities to ${AMNTString}`));
        });
    }
    else {
        nationp.amenities = AMNTString;
        nationp.save();
        message.channel.send(statusMessage_1.successMessage.setDescription(`Set set the nation's amenities to ${AMNTString}`));
    }
});
//# sourceMappingURL=amenities.js.map