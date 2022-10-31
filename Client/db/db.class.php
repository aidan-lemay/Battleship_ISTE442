<?php
    class DB {
        private $dbh;

        function __construct() {
            try {
                $this->dbh = pg_connect('host=localhost port=3306 dbname=NAME user=NAME password=PWD');
            } catch (PDOException $pde) {
                echo $pde->getMessage();
            }
        }
        // Selects
        function getAllUsers() {
            
        }
    }
?>