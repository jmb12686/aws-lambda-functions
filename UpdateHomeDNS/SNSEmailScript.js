'use strict';
var AWS = require('aws-sdk');

var SNSEmailScript = function() {};

SNSEmailScript.prototype.sendMessage = function(topicARN, subject, message) {
    // var message = {};
    var sns = new AWS.SNS();
    sns.publish({
        TopicArn: topicARN,
        Subject: subject,
        Message: message
    }, function(err, data) {
        if (err) {
            console.error('error publishing to SNS');
            // context.fail(err);
        }
        else {
            console.info('message published to SNS');
            // context.done(null, data);
        }
    });
};

exports.SNSEmailScript = SNSEmailScript;