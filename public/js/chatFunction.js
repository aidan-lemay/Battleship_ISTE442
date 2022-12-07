let myID = "";

function startChatClient() {
    "use strict";  // for better performance - to avoid searching in DOM
    let content = document.getElementById('messages');
    let input = document.getElementById('msgField');
    let status = document.getElementById('status');
    let userName = document.getElementById('userName');
    let startButton = document.getElementById('gameStartBtn');
    let usersOnline = document.getElementById('game-zone');

    startButton.hidden = true;
    usersOnline.hidden = true;

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
    let uid = parseCookie(document.cookie)['uid'];

    userName.insertAdjacentText('beforeend', name);

    window.WebSocket = window.WebSocket || window.MozWebSocket;  // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        status.innerText = 'Sorry, but your browser doesn\'t support WebSocket.';
        return;
    }  // open connection
    let connection = new WebSocket('ws://127.0.0.1:1337'); connection.onopen = function () {

    };
    connection.onerror = function (error) {
        status.innerText = 'Sorry, but there\'s some problem with your connection or the server is down.';
    };
    connection.onmessage = function (message) {

        let json;
        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }    // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (const element of json.data) {
                if (element.author == name) {
                    addMessage(true, element.author, element.text, new Date(element.time));
                }
                else {
                    addMessage(false, element.author, element.text, new Date(element.time));
                }

            }
        } else if (json.type === 'message') { // it's a single message
            // let the user write another message
            if (json.data.author == name) {
                addMessage(true, json.data.author, json.data.text, new Date(json.data.time));
            }
            else {
                addMessage(false, json.data.author, json.data.text, new Date(json.data.time));
            }

        } else {
            console.log('Hmm..., I\'ve never seen JSON like this:', json);
        }
    };
    /**
     * Send message when user presses Enter key
     */
    input.onkeydown = (function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let msg = input.value;
            // Fix Error Handling so Empty Messages Don't Go Through
            if (msg.length == 0 || msg == "\n") {
                return;
            }
            else {
                if (!msg) {
                    return;
                }
                // send the message as an ordinary text
                let msgContent = {
                    "uid": uid,
                    "name": name,
                    "date": new Date(),
                    "msg": msg
                };
                console.log(msgContent);
                connection.send(JSON.stringify(msgContent));
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
    }, 10000);  /**
     * Add message to the chat window
     */
    function addMessage(fromMe, author, message, dt) {
        if (fromMe) {
            content.insertAdjacentHTML('beforeend', (`<p class='fromMe'>${author}: ${message}</p>`));
        }
        else {
            content.insertAdjacentHTML('beforeend', (`<p class='fromOther'>${author}: ${message}</p>`));
        }
    }

    window.onbeforeunload = function(){
        connection.close();
    };

    // Get Currently Pending Requests
    setInterval(async () => {
        (async () => {
            const response = await fetch('http://localhost:3000/requestGame', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json(); //extract JSON from the http response

            if (response.status == 200) {
                // Pop Up Modal?
                let confirm = "";
                let name = (`${myJson[0].fName} ${myJson[0].lName}`);
                if (window.confirm(`${name} Has Requested To Start A Game With You! Accept?`)) {
                    confirm = true;
                } else {
                    confirm = false;
                }

                if (confirm) {
                    // Make Request to /startGame
                    const myBody = {
                        uid: myJson[0]._id
                    };
                    (async () => {
                        const decRes = await fetch('http://localhost:3000/startGame', {
                            method: 'POST',
                            body: JSON.stringify(myBody), // string or object
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (decRes.status == 302) {
                            location.href = '/game';
                        }
                    })();
                }
                else {
                    // Make some kind of request to a declination endpoint
                    (async () => {
                        const decRes = await fetch('http://localhost:3000/requestGame/decline', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        const myJson = await decRes.json();

                        if (decRes.status == 200) {
                            if (myJson.error != undefined) {
                                alert(myJson.error);
                            }
                        }
                    })();
                }
            }
        })();
    }, 1000);
};

function startGame(psuid) {
    alert('Request Sent! Please Wait For Response');
    
    // make call to requestGame
    const myBody = {
        "uid": psuid
    };

    (async () => {
        const response = await fetch('http://localhost:3000/requestGame', {
            method: 'PUT',
            body: JSON.stringify(myBody), // string or object
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();

        if (response.status == 200) {
            if (myJson.error != undefined) {
                alert(myJson.error);
            }
        }
    })();
};