# Battleship_ISTE442

## Running the Client Server and Frontend
> Local Hosting
* CD into `./Client/src` and run `php -S localhost:8000`
* In another terminal, also from the project root, run `php ./Client/bin/chat-server.php`
* In yet another terminal, from `./Server/`, run `npm run start`

## Styleguides and information
> Color Scheme
```
    --drkBlu: #4086AA;
    --lteBlu: #91C3DC;
    --drkGrn: #87907D;
    --lteGrn: #AAB6A2;
    --drkGry: #555555;
    --lteGry: #666666;
    --silver: #C4C4C4;
```

## ToDo List
- [ ] See who's online, take from websocket list? Write into DB?
- [ ] Move chat logic to server - Strip special characters and encode before sending to DB, change local chat option to it must come from the server instead of being directly written to the client.
- [ ] Users need to be able to request to start games with other users
- [ ] Game needs to be able to submit boards
- [ ] Chat needs to be added to game page
- [ ] ERROR HANDLING!
- [ ] Make sure XSS / SQL Injection isn't easy
- [ ] Store chat messages in database
- [ ] User table should have T/F "InGame" flag, tells UI to check for existing games 
- [ ] Users should be disconnected from chat when they leave the chat page
- [ ] Game page needs a chat, or needs to be attached to the primary chat with filtering for users that are / are not in games