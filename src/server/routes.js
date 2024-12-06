const { postPredictHandler, getHistoryHandler } = require('../server/handler');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1000000
            }
        }
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getHistoryHandler
    }
];

module.exports = routes;
