onmessage = function (e) {
    var requestType = e.data[0];
    var message = e.data[1];
    var callback = e.data[2];

    if (requestType === "toggleprocess") {
        q.toggleprocessing();
        console.log("queue status set to: " + message === true);
    }
    else if (requestType === "startqueue") {
        var isOnline = self.navigator.onLine;
        var postbackMsg = "We are " + (isOnline ? "Online" : "Offline");
        console.log(postbackMsg);
        PostBackMessage(isOnline, callback);
    }
}

q = {
    isprocessing : false        
};

q.toggleprocessing = function(){
    q.isprocessing = !q.isprocessing;
    q.process();
};

q.process = function(){
    if (!q.isprocessing)
    {
        if (q.batch)
        {
            clearInterval(q.batch);
            q.PostBackMessage(["queue stopped", null]);
        }
        return;
    }

    q.PostBackMessage(["queue starting", null]);

    var item = 0;
    
    q.batch = self.setInterval(function () {
        item = item + 1;
        q.PostBackMessage(["queue processing item: " + item, null]);
    }, 1000);

    q.PostBackMessage(["queue exiting. processed: " + item, null]);
};


q.PostBackMessage = function (message, callback) {
    postMessage([message, callback]);
}

q.isapponline = function(){
    var isOnline = self.navigator.onLine;
    return isOnline;
};