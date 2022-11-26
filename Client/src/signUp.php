<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);

require_once("./assets/db/db.class.php");
$db = new DB();

$error = "";
$url = "localhost:3000/signUp";

include_once("./assets/secrets.php");

$submit = $_POST['sub'];

if (isset($_SESSION['name'])) {
    header("location: index.php");
}

if (isset($submit)) {
    if (!empty($_POST['fName']) && !empty($_POST['lName']) && !empty($_POST['email']) && !empty($_POST['pwd'])) {

        if (strpos($_POST['email'], "@") !== false && strpos($_POST['email'], ".") !== false){
            $ch = curl_init( $url );
            # Setup request to send json via POST.
            $payload = json_encode( array( 'fName' => $_POST['fName'], 'lName' => $_POST['lName'], 'email' => $_POST['email'], 'hPass' => $_POST['pwd'] ) );
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
            curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            # Return response instead of printing.
            curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
            # Send request.
            $result = curl_exec($ch);
            curl_close($ch);

            if ($result == "Users Already Exist. Please Login") {
                $error = $result;
            }
            else {
                $result = json_decode($result, true);

                $_SESSION['token'] = $result['token'];
                $_SESSION['name'] = "{$result['fName']} {$result['lName']}";
                $_SESSION['uid'] = $result['_id'];
                header("location: index.php");
            }
        } else{
            $error = "Email Must Contain both an @ and a .";
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
            <input class="inputT" type="text" name="fName" placeholder="First Name" />
            <input class="inputT" type="text" name="lName" placeholder="Last Name" />
            <br />
            <input class="inputT" type="text" name="email" placeholder="Email" />
            <input class="inputT" type="password" name="pwd" placeholder="Password" />
            <br />
            <input class="inputS" type="submit" name="sub" value="Start chatting!" />
        </form>
        <div id="signIn" class="signIn">
            <a href="signIn.php" class="inputI">Sign In with Existing Account Instead!</a>
        </div>
        <br /><br />
        <div id="error" class="error"><?php echo $error ?></div>
    </div>
</body>

</html>