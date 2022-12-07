# Battleship_ISTE442

## Running the Client Server and Frontend
> Local Hosting
* From root, run `npm run start`

> Using PM2
* Install PM2 with `npm install -g pm2`
* Start the API from the root folder with `pm2 start npm --name "Battleship" -- start --watch`

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
- [x] See who's online, take from websocket list? Write into DB?
- [x] Move chat logic to server - Strip special characters and encode before sending to DB, change local chat option to it must come from the server instead of being directly written to the client.
- [x] Users need to be able to request to start games with other users
- [x] Game needs to be able to submit boards
- [ ] Chat needs to be added to game page
- [x] ERROR HANDLING!
- [x] Make sure XSS / SQL Injection isn't easy
- [x] Store chat messages in database
- [x] User table should have T/F "InGame" flag, tells UI to check for existing games 
- [x] Users should be disconnected from chat when they leave the chat page
- [ ] Game page needs a chat, or needs to be attached to the primary chat with filtering for users that are / are not in games
