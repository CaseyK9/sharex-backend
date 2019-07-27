var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
};

var dynamodb = new AWS.DynamoDB();

