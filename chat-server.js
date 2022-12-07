"use strict";// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';// Port where we'll run the websocket server
let webSocketsServerPort = 1337;// websocket and http servers
let webSocketServer = require('websocket').server;
let http = require('http');
const { Chats, Users } = require('./db/model');
const { ObjectId } = require('mongodb');
/**
 * Global variables
 */
// latest 100 messages
let history = [];
// list of currently connected clients (users)
let clients = [];/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * HTTP server
 */
let server = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});

server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
let wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', async function (request) {
    // console.log((new Date()) + ' Connection from origin ' + request.origin + '.');  // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    let connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    let index = clients.push(connection) - 1;
    let userName = false;
    let userColor = false;
    console.log((new Date()) + ' New Connection Accepted.');
    // send back chat history
    if (history.length == 0) {

        (async () => {
            for await (const doc of Chats.find()) {
                // use `doc`
                const result = await Users.findOne({_id: doc.fromUser});
                let obj = {
                    time: new Date(doc.timeStamp),
                    text: htmlEntities(doc.msg),
                    author: `${result.fName} ${result.lName}`
                };
                history.push(obj);
            }
    
            console.log(history);
    
            connection.sendUTF(JSON.stringify({ type: 'history', data: history }));
        })();
    }  // user sent some message
    connection.on('message', function (message) {
            // ENCODE MESSAGE BEFORE LOGGING OR SENDING
            let msgPrs = JSON.parse(message.utf8Data);

            let sanitizeHTML = function (str) {
                return str.replace(/[^\w. ]/gi, function (c) {
                    return '&#' + c.charCodeAt(0) + ';';
                });
            };
            msgPrs.msg = sanitizeHTML(msgPrs.msg);

            console.log((new Date()) + ' Received Message from ' + msgPrs.name + ': ' + msgPrs.msg);
            
            // Log sent message to DB via endpoint
            (async () => {
                if (msgPrs.uid == null || msgPrs.msg == null) {}
                else {
                    await Chats.create({
                        fromUser: ObjectId(msgPrs.uid),
                        msg: msgPrs.msg,
                        timeStamp: new Date()
                    });

                    let obj = {
                        time: (new Date()).getTime(),
                        text: htmlEntities(msgPrs.msg),
                        author: msgPrs.name,
                    };
                    let json = JSON.stringify({ type: 'message', data: obj });
                    for (const element of clients) {
                        element.sendUTF(json);
                    }
                }
            })();
    });
    connection.on('close', function (connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");      // remove user from the list of connected clients
            clients.splice(index, 1);
        }
    });
});  // user disconnected