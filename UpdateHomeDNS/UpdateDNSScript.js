'use strict';

var AWS = require('aws-sdk');
const route53 = new AWS.Route53();
const SNSEmailScript = require("./SNSEmailScript").SNSEmailScript;
const emailScript = new SNSEmailScript();


function updateRecordSetIfIPChanged(dnsName, newIp, currentIp) {
    console.log("UpdateDNSScript.updateRecordSetIfIPChanged() - Compairing newIp: "+newIp+" and currentIp: "+currentIp);
    if(newIp == currentIp) {
        console.log("UpdateDNSScript.updateRecordSetIfIPChanged() - IP has not changed for dnsName: ["+dnsName+"], exiting...");
        emailScript.sendMessage(process.env.TOPIC_ARN, "UpdateHomeDNS Lambda Function", "Successful call, No IP Changed for home.belisleonline.com");
        global.done(null,"Success - No Change");
    } else {
        console.log("UpdateDNSScript.updateRecordSetIfIPChanged() - IP has changed for dnsName: ["+dnsName+"], issuing recordSet UPSERT");
        update(dnsName, newIp);
    }
}

function update(dnsName, newIp){
    // console.log("UpdateDNSScript class is updating IP to "+ip);
    var params = {
        "HostedZoneId": '/hostedzone/'+process.env.HOSTED_ZONE_ID, // My HostedZoneID
        "ChangeBatch": {
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": dnsName,
                        "Type": "A",
                        "TTL": 3600,
                        "ResourceRecords": [
                            {
                                "Value": newIp
                            }
                        ]
                    }
                }
            ]
        }
    };

    route53.changeResourceRecordSets(params, function(err,data) {
        if(err) {
            console.log(err,err.stack);
            emailScript.sendMessage(process.env.TOPIC_ARN,"UpdateHomeDNS Lambda Function", "Failed - See Logs");
            global.done(new Error('Failed - See logs'));
        } else {
            console.log("Successfully changed ["+dnsName+"] IP to "+newIp+".  Result from route53 changeResourceRecordSets:"+JSON.stringify(data, null, 2));
            emailScript.sendMessage(process.env.TOPIC_ARN, "UpdateHomeDNS Lambda Function", "Success - Changed ["+dnsName+"] IP to "+newIp);
            global.done(null,"Success - Changed ["+dnsName+"] IP to "+newIp);
        }

    });

}

module.exports.UpdateDNSScript = class UpdateDNSScript {
    constructor(){}


    updateRecordSet(name,newIp) {

        //first get record set name, check if requested IP is different then current IP in route53
        console.log("UpdateDNSScript.updateRecordSet() - querying Route53 for record set with name: "+name);
        var params = {
            HostedZoneId: process.env.HOSTED_ZONE_ID, /* required */
            StartRecordName: name,
            MaxItems: '1'
        };
        route53.listResourceRecordSets(params, function(err,data) {
            if(err) {
                console.log(err,err.stack);
                global.done(new Error('Failed to query route53 - See logs'));
            } else {
                // console.log("UpdateDNSScript.updateRecordSet - returned following data:"+JSON.stringify(data, null, 2)); 
                console.log("UpdateDNSScript.updateRecordSet() - Current IP = "+data.ResourceRecordSets[0].ResourceRecords[0].Value);
                updateRecordSetIfIPChanged(name, newIp, data.ResourceRecordSets[0].ResourceRecords[0].Value);
            }

        });
    }
};
