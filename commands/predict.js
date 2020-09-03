const Discord = require('discord.js');
const tf = require('@tensorflow/tfjs-node');
const {errorMessage} = require('../functions/statusMessage');

module.exports = {
  name: "predict",
  description: 'Shows current queue info',
  execute: async (message) => {
    const timeNow = new Date().getTime();
    const model = await tf.loadLayersModel('file://./models/queueForecastModel/model.json');

    const prediction = await model.predict(tf.tensor2d([timeNow+300000], [1, 1])).mul(10);
    console.log(Array.from(prediction.dataSync()));
  }
}