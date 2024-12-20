const tf = require('@tensorflow/tfjs-node');

async function predictDiagnosis(model, image) {
    const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const diagnosis = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

    let suggestion

    if (diagnosis === 'Cancer') {
        suggestion = 'Segera periksa ke dokter!';
    } else {
        suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { confidenceScore, diagnosis, suggestion };
}

module.exports = predictDiagnosis;
