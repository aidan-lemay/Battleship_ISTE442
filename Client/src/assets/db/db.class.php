<?php
    class DB {
        public $dbh;

        function __construct(){
            $this->dbh = mysqli_connect("localhost", "battleship_usr", "B@TTLESH1P", "442Battleship");
            if($this->dbh->connect_error){
                die("Connection failed: " . $this->dbh->connect_error);
            }
        }//end constructor

        // SELECT
        function checkUser($email){
            $data = array();
            $stmt = mysqli_prepare($this->dbh, "SELECT UID FROM Users WHERE email = ?");
            $stmt->bind_param("s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_all($result)){
               $data = $row;
            }

            if (count($data) == 0) {
                return false;
            }
            else {
                return true;
            }
        }//end checkUser

        function signIn($email) {
            $data = array();
            $stmt = mysqli_prepare($this->dbh, "SELECT hPass, fname, lname FROM Users WHERE email = ?");
            $stmt->bind_param("s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_all($result)){
               $data = $row;
            }

            if (count($data) == 0) {
                return false;
            }
            else {
                return $data;
            }
        } // end signIn

        //  INSERT
        function createUser($fname, $lname, $email, $hpass) {
            if ($this->checkUser($email)) {
                return false;
            }
            else {
                $stmt = $this->dbh->prepare("INSERT INTO Users (fname, lname, email, hpass) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssss",$fname, $lname, $email, $hpass);
                $res = mysqli_stmt_execute($stmt);
                echo $res;
                return $res;
            }
            
        }//end createUser

    }//end class DB
?>