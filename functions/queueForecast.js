const tf = require('@tensorflow/tfjs-node');
const { QueueData } = require('../models/models');

async function getData(callback) {
  const qdatas = await QueueData.find({}).exec().catch(err => {});

  let labels = [];
  let features = [];

  for(var i=0; i<qdatas.length; i++) {
    let qdata = qdatas[i];

    labels.push(qdata.timestamp);
    features.push(qdata.queue);
  }

  return {labels: labels, features: features}
}

async function trainModel() {

  // Get queue data.
  const processedData = await getData();

  let inputs = processedData.labels;
  let outputs = processedData.features;

  // The amount of data to use for training (%), the rest is used for validation.
  let trainingsize = 70;

  const input_layer_shape  = 1;
  const input_layer_neurons = 100;

  const rnn_input_layer_features = 10;
  const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

  const rnn_input_shape  = [rnn_input_layer_features, rnn_input_layer_timesteps];
  const rnn_output_neurons = 20;

  const rnn_batch_size = 1;

  const output_layer_shape = rnn_output_neurons;
  const output_layer_neurons = 1;

  const model = tf.sequential();

  let X = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
  let Y = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length));

  const xs = tf.tensor2d(X, [X.length, 1]).div(tf.scalar(10));
  const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10));

  model.add(tf.layers.dense({units: input_layer_neurons, inputShape: [input_layer_shape]}));
  model.add(tf.layers.reshape({targetShape: rnn_input_shape}));

  let lstm_cells = [];
  for (let index = 0; index < 20; index++) {
    lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons}));
  }

  model.add(tf.layers.rnn({
    cell: lstm_cells,
    inputShape: rnn_input_shape,
    returnSequences: false
  }));

  model.add(tf.layers.dense({units: output_layer_neurons, inputShape: [output_layer_shape]}));

  model.compile({
    optimizer: tf.train.adam(0.1),
    loss: 'meanSquaredError'
  });

  const hist = await model.fit(xs, ys,
    { batchSize: rnn_batch_size, epochs: 25, callbacks: {
      onEpochEnd: async (epoch, log) => {
        //callback(epoch, log);
      }
    }
  });

  return { model: model, stats: hist };
}

module.exports = {
  trainModel: trainModel,
  getData: getData
}