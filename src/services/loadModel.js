const tf = require('@tensorflow/tfjs-node');


async function loadModel() {
    const model = await tf.loadGraphModel(process.env.MODEL_URL);

    return model;
}

module.exports = loadModel;