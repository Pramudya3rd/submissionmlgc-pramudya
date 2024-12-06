require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    // Muat model TensorFlow
    const model = await loadModel();
    server.app.model = model;

    // Menambahkan routes ke server
    server.route(routes);

    // Menangani respons error global
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            }).code(response.output.statusCode);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
})();
