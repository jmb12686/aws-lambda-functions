'use strict';

console.log('Loading EchoCallerIP() function');

exports.handler = (event, context, callback) => {
    const done = (err,res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : res,
        headers: {
            'Content-Type': 'text/plain',
        },
    });

    switch (event.httpMethod){
        case 'GET':
            var sourceIP = event['requestContext']['identity']['sourceIp'];
            console.log("Received GET request from IP ",sourceIP);
            done(null, sourceIP);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }

};
