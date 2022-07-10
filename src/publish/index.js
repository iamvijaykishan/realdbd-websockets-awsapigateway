
var userCount = 0;
function startWebsocket() {
  console.log('Inside the websocket creation function' + Date.now());
  const socket = new WebSocket('wss://76gebg6yz0.execute-api.us-east-1.amazonaws.com/production');

  socket.addEventListener('open', e => {
    console.log('web socket connection established');
  })

  socket.addEventListener('close', e => {
    try {
      console.log('connection closed' + Date.now());
      socket.close();
      console.log('Socket object closed to reconnect');
      setTimeout(startWebsocket, 5000)
    } catch (error) {
      console.log(error);
    }

  })
  socket.addEventListener('error', e => console.log('connection errored out'))

  socket.addEventListener('message', e => {
    console.log('Message is : ', JSON.parse(e.data).message)
    userCount = JSON.parse(e.data).message;
  })
}
startWebsocket();
setInterval(function () {
  var count = document.getElementById("counter");
  count.innerHTML = userCount;
}, 1000);

window.ask = function () {
  const payLoad = {
    action: 'message',
    Y: 'Hello'
  }
  socket.send(JSON.stringify({ action: 'message', Y: 'hello' }));
  console.log(payLoad);
}


