<?php
    class DB {
        
        private $conn;

        function __construct() {

            // Create connection
            $conn = new mysqli("localhost", "battleship_usr", "B@TTLESH1P");

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
        }
        // Selects
        function checkUser($email) {
            // return pg_query_params($this->conn,"SELECT uid FROM users WHERE email = $1",array($email));

            $sql = "SELECT uid FROM users WHERE email = ?"; // SQL with parameters
            $stmt = $this->conn->query($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result(); // get the mysqli result
            $isUser = $result->fetch_assoc(); // fetch data

            if ($isUser == "") {
                return false;
            }
            else {
                return true;
            }
        } // End checkUser

        // Inserts
        function createUser($fname, $lname, $email, $hpass) {
            if(!$this->checkUser($email)) {
                $params = array($fname, $lname, $email, $hpass);
                return pg_query_params($this->conn,"INSERT INTO users (fname, lname, email, hpass) VALUES($1,$2,$3,$4)",$params);
            } else {
                return false;
            }
        } // End createUser
        function newMessage() {

        } // End newMessage
    }