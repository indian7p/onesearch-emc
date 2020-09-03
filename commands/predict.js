const Discord = require('discord.js');
const tf = require('@tensorflow/tfjs-node');
const {errorMessage} = require('../functions/statusMessage');
const { QueueData } = require('../models/models');
const {getData} = require('../functions/queueForecast');

module.exports = {
  name: "predict",
  description: 'Shows current queue info',
  execute: async (message) => {
    const timeNow = new Date().getTime();
    const model = await tf.loadLayersModel('file://./models/queueForecastModel/model.json');

    let inputs = await getData();
    let X = inputs.labels.slice(0, Math.floor(70 / 100 * inputs.labels.length));

    const prediction = await model.predict(tf.tensor2d(X, [X.length, 1])).mul(100);
    console.log(Array.from(prediction.dataSync()));
  }
}