<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);

require_once("./assets/db/db.class.php");
$db = new DB();

$error = "";

include_once("./assets/secrets.php");

$name = $_POST['fname'] . " " . $_POST['lname'];
$submit = $_POST['sub'];

if (isset($_SESSION['name'])) {
    header("location: index.php");
}

if (isset($submit)) {
    if (!empty($_POST['email']) && !empty($_POST['pwd'])) {
        $pwd = $db -> signIn($_POST['email']);
        
        if (!$pwd) {
            $error = "Email Not Found In Our Database";
        }
        else {

            if (password_verify($_POST['pwd'], $pwd[0][0])) {
                $_SESSION['name'] = $pwd[0][1] . " " . $pwd[0][2];
                $_SESSION['uid'] = $uid;
                header("location: index.php");
            }
            else {
                $error = "Incorrect Password";
            }
        }

    } else {
        $error = "All input fields must be filled out!";
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Battleship - Login</title>
    <script src="jquery.min.js"></script>
    <link rel="stylesheet" href="./assets/css/signPages.css"></link>
</head>

<body>
    <div id="nameBox">
        <h2>Welcome! Please type your name below to begin chatting.</h2>
        <form method="post" action="">
            <input class="inputT" type="text" name="email" placeholder="Email" />
            <input class="inputT" type="password" name="pwd" placeholder="Password" />
            <br />
            <input class="inputS" type="submit" name="sub" value="Start chatting!" />
        </form>
        <div id="signIn" class="signIn">
            <a href="signUp.php" class="inputI">Sign Up with New Account Instead!</a>
        </div>
        <div id="error" class="error"><?php echo $error ?></div>
    </div>
</body>

</html>