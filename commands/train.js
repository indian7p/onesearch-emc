const tf = require('@tensorflow/tfjs-node-gpu');
const { getQueueTrainingData } = require('../functions/fetch');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'train',
  description: 'Sets player information',
  execute: async (message) => {
    if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

    const processedData = await getQueueTrainingData();

    const input_layer_shape = 1;
    const input_layer_neurons = 100;

    const rnn_input_layer_features = 10;
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

    const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
    const rnn_output_neurons = 20;

    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1;

    const model = tf.sequential();

    let X = processedData.labels;
    let Y = processedData.features;

    const xs = tf.tensor2d(X, [X.length, 1]).div(tf.scalar(10));
    const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10));

    model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));
    model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

    let lstm_cells = [];
    for (let index = 0; index < 20; index++) {
      lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
    }

    model.add(tf.layers.rnn({
      cell: lstm_cells,
      inputShape: rnn_input_shape,
      returnSequences: false
    }));

    model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    const hist = await model.fit(xs, ys, {
      batchSize: 32, epochs: 50, callbacks: {
        onTrainBegin: async (logs) => {
          let embed = new Discord.MessageEmbed()
          .setTitle('Queue Forecasting - Training')
          .setThumbnail('https://cdn.bcow.tk/logos/TensorFlow.png')
          .setColor(0x003175)
          .setDescription('Started training!')
          .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

          message.channel.send(embed);
        },
        onTrainEnd: async (logs) => {
          let embed = new Discord.MessageEmbed()
          .setTitle('Queue Forecasting - Training')
          .setThumbnail('https://cdn.bcow.tk/logos/TensorFlow.png')
          .setColor(0x003175)
          .setDescription('Training Finished!')
          .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

          message.channel.send(embed);
        },
        onEpochEnd: async (epoch, log) => {
          let embed = new Discord.MessageEmbed()
          .setTitle('Queue Forecasting - Training')
          .setThumbnail('https://cdn.bcow.tk/logos/TensorFlow.png')
          .setColor(0x003175)
          .addField('Epoch', epoch+1, true)
          .addField('Loss', log.loss, true)
          .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

          message.channel.send(embed);
        }
      }
    });

    model.save('file://./models/queueForecastModel');
  }
};
