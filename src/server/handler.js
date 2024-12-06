const crypto = require('crypto');
const predictDiagnosis = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const { diagnosis, suggestion } = await predictDiagnosis(model, image);
        
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": diagnosis,
            "suggestion": suggestion,
            "createdAt": createdAt
        };

        await storeData(id, data);
        
        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',  // Pesan tetap sama
            data
        }).code(201); // Status 201: Created
    } catch (error) {
        console.error('Prediction error:', error);

        // Jika terjadi error selama proses prediksi
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400); // Status 400: Bad Request
    }
}

const db = new Firestore({
    projectId: 'submissionmlgc-pramudya-200601',
})
async function getHistoryHandler(request, h) {
    try {
        const snapshots = await db.collection('predictions').get();
        
        // Jika koleksi kosong, kembalikan status sukses dengan array kosong
        if (snapshots.empty) {
            return h.response({
                status: 'success',
                data: []
            }).code(200); // Status 200: OK
        }

        // Memetakan setiap dokumen menjadi format yang sesuai
        const histories = snapshots.docs.map((doc) => {
            const data = doc.data(); // Ambil data dokumen
            return {
                id: doc.id, // id dokumen
                history: {
                    result: data.result, // hasil prediksi
                    createdAt: data.createdAt, // waktu prediksi dibuat
                    suggestion: data.suggestion, // saran berdasarkan hasil prediksi
                    id: doc.id // id dokumen
                }
            };
        });

        // Mengembalikan respons dengan data yang ditemukan
        return h.response({
            status: 'success',
            data: histories
        }).code(200); // Status 200: OK
    } catch (error) {
        // Menangani kesalahan
        console.error('Error fetching history:', error.message);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam mengambil riwayat prediksi'
        }).code(500); // Status 500: Internal Server Error
    }
}

module.exports = { postPredictHandler, getHistoryHandler };
