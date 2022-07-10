const AWS = require('aws-sdk');
const api = new AWS.ApiGatewayManagementApi({
    endpoint: '76gebg6yz0.execute-api.us-east-1.amazonaws.com/production'
});
exports.handler = async (event) => {
    var currentUserCount = await getCounters('user');
    var connectionID = await getSocketConn();
    await replyToConnection(currentUserCount,connectionID.toString())
 }
async function getCounters(type){
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var params = {
        TableName: 'TABLE-COUNTERS',
        Key: {
            'type': {S: 'user'}
        }    };
        try{
           const data = await ddb.getItem(params).promise();
           var resp = Object.values(data.Item.count);
           return resp;
            } catch(err){   console.log("Error: ", err);    }
    }
async function getSocketConn(){
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var params = {
        TableName: 'TABLE-SOCKETS',
        Key: {
            'type': {S: 'CMS'}
        }
    };
        try{
           const data = await ddb.getItem(params).promise();
           var resp = Object.values(data.Item.id);
           return resp;
            } catch(err){
             console.log("Error: ", err);
            }
    }
async function replyToConnection(response,connectionId){
    const data = {message : response }
    const params = {
        ConnectionId:connectionId,
        Data : Buffer.from(JSON.stringify((data)))
    }
    
    return api.postToConnection(params).promise();
}