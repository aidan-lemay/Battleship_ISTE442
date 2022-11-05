<?php
    class DB {
        private $conn;

        function __construct() {
            $servername = "localhost";
            $username = "battleship_usr";
            $password = "B@TTLESH1P";

            // Create connection
            $conn = new mysqli($servername, $username, $password);

            // Check connection
            if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
            }
        }
        // Selects
        function getAllUsers() {
            
        }
    }
