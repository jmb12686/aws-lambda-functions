# aws-lambda-functions
#Repository for all my AWS Lambda functions.  

##Dynamic DNS for Home
I am currently using the two Lambda functions (**_EchoCallerIP_** and **_UpdateHomeDNS_**) to 
effectively replace a DDNS provider.  I have setup my own domain in Route 53 and exposed endpoints via AWS API Gateway to invoke these Lambda functions.  

For convenience, I setup a "Custom Domain Name" in API Gateway to point the exposed API, and secured it with valid HTTPS certs with AWS Certificate Manager.  This allows a clean and concise
domain name, that I own, to point to my API.

Please note, the API Gateway endpoint that exposes the UpdateHomeDNS Lambda function is **secured** via API Key authentication on the API Gateway. 

 
