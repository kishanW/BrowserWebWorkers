ww = {};

$(document).ready(function(){
    if(window.Worker)
    {
        ww.AddMessage("web worker is supported");

        var myWorker = new Worker('worker.js');
        var queueworker = new Worker('queueworker.js');

        queueworker.onmessage = function (e) {
            console.log('Message received from worker');
            console.log(e.data);

            var message = e.data[0];
            var callback = e.data[1];

            ww.AddMessage("<b>" + message + "</b>")
        }
        window.queueworker = queueworker;


        myWorker.onmessage = function (e) {
            console.log('Message received from worker');
            console.log(e.data);            

            var message = e.data[0];
            var callback = e.data[1];

            if (callback)
            {
                if (callback === "AddMessage")
                {
                    ww.AddMessage(message);
                }
                else if (callback === "SetConnectionBadge")
                {
                    ww.SetConnectionBadge(message);
                }                
            }
            else
            {
                ww.AddMessage("<b>" + e.data + "</b>")
            }
        }
        window.myworker = myWorker;
    }
});

ww.SetConnectionBadge = function(status){
    var badge = $("#connectionBadge");
    badge.attr("online", status);

    ww.AddMessage(status ? "App is online" : "App is offline");
}


ww.AddMessage = function(messageString){
    var messageList = $("#messages");
    var newMessage = $("<li class='list-group-item'>" + messageString + "</li>");

    messageList.prepend(newMessage);
}

$(document).on("click", "#clearmessages", function(){
    var messageList = $("#messages");
    messageList.children().each(function(){
        $(this).slideUp(function(){
            $(this).remove();
        });
    });
});

$(document).on("click", "#sendmessage", function(){
    ww.AddMessage("sending message");
    window.setTimeout(500);

    var messageToSend = $("#messageInput").val();
    window.myworker.postMessage(["postmessage", messageToSend, "AddMessage"]);

    $("#messageInput").val("");
});

$(document).on("click", "#checkconnection", function () {
    ww.AddMessage("checking connection");
    window.setTimeout(500);

    window.myworker.postMessage(["checkconnection", "new message", "SetConnectionBadge"]);
});


$(document).on("click", "#togglequeue", function () {
    ww.AddMessage("toggling queue");
    window.setTimeout(500);

    window.queueworker.postMessage(["toggleprocess", true, "SetConnectionBadge"]);
});

$(document).on("change", "#autonetworkcheck", function(){
    //toggle the auto network check
    window.myworker.postMessage(["autoconnectioncheck", "new message", "SetConnectionBadge"]);
});