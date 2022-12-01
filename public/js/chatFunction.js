function startChatClient() {
    "use strict";  // for better performance - to avoid searching in DOM
    let content = document.getElementById('messages');
    let input = document.getElementById('msgField');
    let status = document.getElementById('status');
    // my name sent to the server
    let myName = false;  // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;  // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        content.innerHTML = 'Sorry, but your browser doesn\'t support WebSocket.';
        input.hide();
        document.getElementById('status').style = "hide";
        return;
    }  // open connection
    let connection = new WebSocket('ws://127.0.0.1:1337'); connection.onopen = function () {
        // first we want users to enter their names
        input.disabled = false;
        status.innerText = 'Choose name: ';
    }; connection.onerror = function (error) {
        // just in there were some problems with connection...
        content.innerHTML = 'Sorry, but there\'s some problem with your connection or the server is down.';
    };  // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server
        // always returns JSON this should work without any problem but
        // we should make sure that the massage is not chunked or
        // otherwise damaged.
        let json;
        try {
            json = JSON.parse(message.data);
            console.log(json);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }    // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (let i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            // let the user write another message
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this:', json);
        }
    };  /**
     * Send message when user presses Enter key
     */
    input.onkeydown = (function (e) {
        if (e.key === 'Enter') {
            let msg = input.value;
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            input.innerText = "";
            // disable the input field to make the user wait until server
            // sends back response
            if (myName === false) {
                myName = msg;
            }
        }
    });  /**
     * This method is optional. If the server wasn't able to
     * respond to the in 3 seconds then show some error message 
     * to notify the user that something is wrong.
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.insertAdjacentText('beforeend', 'Unable to communicate with the WebSocket server.');
        }
    }, 3000);  /**
     * Add message to the chat window
     */
    function addMessage(author, message, dt) {
        content.insertAdjacentHTML('beforeend', ('<p>' + author + '</span> @ ' + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ': ' + message + '</p>'));
    }
};