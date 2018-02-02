var workerSpace = {
    IsAutoCheckOn : false,
    AutoNetworkCheckInterval: {}
};

onmessage = function (e) {
    var requestType = e.data[0];
    var message = e.data[1];
    var callback = e.data[2];

    if (requestType === "checkconnection")
    {   
        var isOnline = self.navigator.onLine;       
        var postbackMsg = "We are " + (isOnline ? "Online" : "Offline");
        console.log(postbackMsg);
        PostBackMessage(isOnline, callback);
    }
    if (requestType === "autoconnectioncheck") {
        workerSpace.IsAutoCheckOn = !workerSpace.IsAutoCheckOn;
        if (!workerSpace.IsAutoCheckOn)
        {
            clearInterval(workerSpace.AutoNetworkCheckInterval);
            PostBackMessage("Stopped auto network check", "AddMessage");
            return;
        }

        workerSpace.AutoNetworkCheckInterval = setInterval(function () {
            var isOnline = self.navigator.onLine;
            var postbackMsg = "We are " + (isOnline ? "Online" : "Offline");
            console.log(postbackMsg);
            PostBackMessage(isOnline, callback);
        }, 500)        
    }
    else if(requestType === "postmessage")
    {
        console.log("message received:");
        console.log(message);
        console.log("\n\n");
        var postbackMsg = "message received --- " + message;
        PostBackMessage(postbackMsg, callback);
    }   
    
    
    
}


function PostBackMessage(message, callback){
    postMessage([message, callback]);
}