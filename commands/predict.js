const Discord = require('discord.js');
const tf = require('@tensorflow/tfjs-node-gpu');
const {errorMessage} = require('../functions/statusMessage');

module.exports = {
  name: "predict",
  description: 'Shows current queue info',
  execute: async (message) => {
    const timeNow = new Date();
    const newTimestamp = `${4}${timeNow.getMonth()+1}${timeNow.getDate()}${8}${timeNow.getMinutes()}`;

    const model = await tf.loadLayersModel('file://./models/queueForecastModel/model.json');

    const prediction = await model.predict(tf.tensor([newTimestamp*1]));

    console.log(`${newTimestamp} ${prediction.dataSync()[0] * 10}`);
  }
}