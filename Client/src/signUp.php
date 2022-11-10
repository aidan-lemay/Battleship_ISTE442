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
    if (!empty($_POST['fname']) && !empty($_POST['lname']) && !empty($_POST['email']) && !empty($_POST['pwd'])) {
        $hpwd = password_hash($_POST['pwd'], PASSWORD_BCRYPT);
        $uid = $db -> createUser($_POST['fname'], $_POST['lname'], $_POST['email'], $hpwd);
        if (!$uid) {
            $error = "You Have Already Been Signed Up";
        }
        else {
            $_SESSION['name'] = $name;
            $_SESSION['uid'] = $uid;
            header("location: index.php");
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
            <input class="inputT" type="text" name="fname" placeholder="First Name" />
            <input class="inputT" type="text" name="lname" placeholder="Last Name" />
            <br />
            <input class="inputT" type="text" name="email" placeholder="Email" />
            <input class="inputT" type="text" name="pwd" placeholder="Password" />
            <br />
            <input class="inputS" type="submit" name="sub" value="Start chatting!" />
        </form>
        <div id="signIn" class="signIn">
            <a href="signIn.php" class="inputI">Sign In with Existing Account Instead!</a>
        </div>
        <div id="error" class="error"><?php echo $error ?></div>
    </div>
</body>

</html>