const AWS = require('aws-sdk');
const api = new AWS.ApiGatewayManagementApi({
    endpoint: '76gebg6yz0.execute-api.us-east-1.amazonaws.com/production'
});

exports.handler = async (event) => {
   const socketRoute = event.requestContext.routeKey;
   const connectionId = event.requestContext.connectionId;
   switch(socketRoute){
        case '$connect':
            console.log(' Connected Successfully. ', connectionId);
            await addConnection2DB('CMS',connectionId,'open')
            break;
        case '$disconnect':
            // Can delete the connection details from dynamodb on disconnection
            console.log(' Disconnected Successfully for ' + connectionId + ' : ' + Date.now());
            break;
        case 'message':
            const data = JSON.parse(event.body)
            console.log(data.action);
            break;
        case '$default':
            console.log('Unknown route hit');
            }
            
    return { 
        statusCode: 200, 
        body: JSON.stringify({ msg: 'connected'}) 
    };
};

async function addConnection2DB(type,connectionId,status){
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var params = {
      TableName: 'TABLE-SOCKETS',
      Item: {
          'type' : {S : type },
        'id' : {S: connectionId},
        'status' : {S: status}
      }
    };
   try{
    const data = await ddb.putItem(params).promise();
    console.log("Item entered successfully:", data);
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
