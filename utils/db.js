const AWS = require("aws-sdk");

if(process.env.IS_OFFLINE=='true'){

    module.exports = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    });

} else {
    module.exports =  new AWS.DynamoDB.DocumentClient();
}