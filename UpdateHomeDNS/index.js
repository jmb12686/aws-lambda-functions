'use strict';

console.log('Loading UpdateHomeDNS() function');
const updateDnsScript = require("./UpdateDNSScript");
const script = new updateDnsScript.UpdateDNSScript();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err,res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : res,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    global.done = done;


    switch (event.httpMethod){
        case 'PUT':
            var requestBody = JSON.parse(event.body);
            var homeIp = requestBody['homeIp'];

            script.updateRecordSet(process.env.DNS_HOST_NAME,homeIp);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));

    }
};
