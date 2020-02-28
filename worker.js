var workerSpace = {
  IsAutoCheckOn: false,
  AutoNetworkCheckInterval: {}
};

onmessage = function(e) {
  var requestType = e.data[0];
  var message = e.data[1];
  var callback = e.data[2];

  console.log("[worker.js] request message received: ", e);

  if (requestType === "checkconnection") {
    var isOnline = self.navigator.onLine;
    var postbackMsg = "We are " + (isOnline ? "Online" : "Offline");
    console.log(postbackMsg);
    PostBackMessage(isOnline, callback);
    return;
  }
  if (requestType === "autoconnectioncheck") {
    workerSpace.IsAutoCheckOn = !workerSpace.IsAutoCheckOn;
    if (!workerSpace.IsAutoCheckOn) {
      clearInterval(workerSpace.AutoNetworkCheckInterval);
      PostBackMessage("Stopped auto network check", "AddMessage");
      return;
    }

    workerSpace.AutoNetworkCheckInterval = setInterval(function() {
      var isOnline = self.navigator.onLine;
      var postbackMsg = "We are " + (isOnline ? "Online" : "Offline");
      console.log(postbackMsg);
      PostBackMessage(isOnline, callback);
    }, 500);

    return;
  } else if (requestType === "postmessage") {
    console.log("message received:");
    console.log(message);
    console.log("\n\n");
    var postbackMsg = "message received --- " + message;
    PostBackMessage(postbackMsg, callback);

    return;
  } else if (requestType === "hugetask") {
    PostBackMessage("worker.js - starting huge task", callback);
    console.log("worker.js - starting huge task");
    for (var i = 0; i < 1000000000; i++) {
      Math.random();
      //PostBackMessage("worker.js - status - " + i, callback);
    }
    console.log("worker.js - huge task done.");
    console.log("\n\n");
    var postbackMsg = "worker.js completed huge task";
    PostBackMessage(postbackMsg, callback);

    return;
  }
};

function PostBackMessage(message, callback) {
  postMessage([message, callback]);
}
