const { Firestore } = require('@google-cloud/firestore');

function storeData(id, data) {
  const db = new Firestore({
    projectId: 'submissionmlgc-pramudya-200601'
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data)
}

module.exports = storeData;