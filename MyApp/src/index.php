<?php
    namespace MyApp;
    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;
    include_once "./classes/db.class.php";
    include_once "./classes/variables.php";
    // $db = new DB();
    class Chat implements MessageComponentInterface {
        protected $clients;
    
        public function __construct() {
            $this->clients = new \SplObjectStorage;
        }
    
        public function onOpen(ConnectionInterface $conn) {
            // Store the new connection to send messages to later
            $this->clients->attach($conn);
    
            echo "New connection! ({$conn->resourceId})\n";
        }
    
        public function onMessage(ConnectionInterface $from, $msg) {
            $numRecv = count($this->clients) - 1;
            echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
                , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
    
            foreach ($this->clients as $client) {
                if ($from !== $client) {
                    // The sender is not the receiver, send to each client connected
                    $client->send($msg);
                }
            }
        }
    
        public function onClose(ConnectionInterface $conn) {
            // The connection is closed, remove it, as we can no longer send it messages
            $this->clients->detach($conn);
    
            echo "Connection {$conn->resourceId} has disconnected\n";
        }
    
        public function onError(ConnectionInterface $conn, \Exception $e) {
            echo "An error has occurred: {$e->getMessage()}\n";
    
            $conn->close();
        }
    }
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <link rel="stylesheet" href="">
    </head>
    <body>
        <?php
            if (isset($_COOKIE['gameID'])) {
                echo `Game Set`;
            }
            else {
                echo $chatPage;
            }
        ?>
    </body>
</html>