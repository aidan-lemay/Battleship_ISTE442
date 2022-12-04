function startChatClient() {
    "use strict";  // for better performance - to avoid searching in DOM
    let content = document.getElementById('messages');
    let input = document.getElementById('msgField');
    let status = document.getElementById('status');

    // <p class='fromSystem'><?php echo $name; ?> Has Joined The Chat</p>
    // <p class='fromMe'>Me: ${msgField}</p>
    // <p class='fromOther'><?php echo $name; ?>: " + msgField + </p>

    const parseCookie = str =>
        str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});

    let name = parseCookie(document.cookie)['name'];

    window.WebSocket = window.WebSocket || window.MozWebSocket;  // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        status.innerText = 'Sorry, but your browser doesn\'t support WebSocket.';
        input.hide();
        document.getElementById('input').style = "hide";
        return;
    }  // open connection
    let connection = new WebSocket('ws://127.0.0.1:1337'); connection.onopen = function () {

    }; connection.onerror = function (error) {
        status.innerText = 'Sorry, but there\'s some problem with your connection or the server is down.';
        connection.onmessage = function (message) {

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
                    if (json.data[i].author == name) {
                        addMessage(true, json.data[i].author, json.data[i].text, new Date(json.data[i].time));
                    }
                    else {
                        addMessage(false, json.data[i].author, json.data[i].text, new Date(json.data[i].time));
                    }

                }
            } else if (json.type === 'message') { // it's a single message
                // let the user write another message
                if (json.data.author == name) {
                    return;
                }
                else {
                    addMessage(false, json.data.author, json.data.text, new Date(json.data.time));
                }

            } else {
                console.log('Hmm..., I\'ve never seen JSON like this:', json);
            }
        };  /**
     * Send message when user presses Enter key
     */
        input.onkeydown = (function (e) {
            if (e.key === 'Enter') {
                let msg = input.value;
                if (msg.length == 0) {
                    return;
                }
                else {
                    if (!msg) {
                        return;
                    }
                    // send the message as an ordinary text
                    let msgContent = {
                        "name": name,
                        "date": new Date(),
                        "msg": msg
                    };
                    console.log(msgContent);
                    connection.send(JSON.stringify(msgContent));
                    addMessage(true, name, msg, new Date());
                    input.innerText = "";
                    input.value = null;
                }
            }
        });  /**
     * This method is optional. If the server wasn't able to
     * respond to the in 3 seconds then show some error message 
     * to notify the user that something is wrong.
     */
        setInterval(function () {
            if (connection.readyState !== 1) {
                status.text = 'Unable to communicate with the WebSocket server.';
            }
        }, 3000);  /**
     * Add message to the chat window
     */
        function addMessage(fromMe, author, message, dt) {
            if (fromMe) {
                console.log('me');
                content.insertAdjacentHTML('beforeend', (`<p class='fromMe'>${dt} ${author}: ${message}</p>`));
            }
            else {
                content.insertAdjacentHTML('beforeend', (`<p class='fromOther'>${dt} ${author}: ${message}</p>`));
            }
        }
    }
};