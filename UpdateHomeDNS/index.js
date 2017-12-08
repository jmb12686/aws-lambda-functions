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
            
    /*
    TODO: Email if IP changes!!
var message = {};
var sns = new AWS.SNS();
sns.publish({
    TopicArn: "<your SNS topic ARN>",
    Message: JSON.stringify(message)
}, function(err, data) {
    if(err) {
        console.error('error publishing to SNS');
        context.fail(err);
    } else {
        console.info('message published to SNS');
        context.done(null, data);
    }
});    
    
    */
  
};
