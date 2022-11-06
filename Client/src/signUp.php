<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);

require_once("./assets/db/db.class.php");
$db = new DB();

include_once("./assets/secrets.php");

$name = $_POST['fname'] . " " . $_POST['lname'];
$submit = $_POST['sub'];

if (isset($_SESSION['name'])) {
    header("location: index.php");
}

if (isset($submit)) {
    if (!empty($_POST['fname']) && !empty($_POST['lname']) && !empty($_POST['email']) && !empty($_POST['pwd'])) {
        $pwd = password_hash($_POST['pwd'], PASSWORD_BCRYPT);
        $db -> createUser($_POST['fname'], $_POST['lname'], $_POST['email'], $pwd);
        $_SESSION['name'] = $name;
        header("location: index.php");
    } else {
        $error = "Sorry, you must type at least 1 character for your name";
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Battleship - Login</title>
    <script src="jquery.min.js"></script>
    <style type="text/css">
        body {
            background: #edeff1;
            font-family: sans-serif;
        }

        #nameBox {
            padding: 50px 15px;
            background: #fff;
            box-shadow: 0px 0px 8px #c5c5c5;
            border-radius: 2px;
            width:50%;
            text-align: center;
            margin: auto;
            margin-top: 10%;
        }

        .inputT {
            padding: 8px 15px;
            outline: none;
            border: none;
            box-shadow: 0px 0px 21px #cad6e2;
            border-radius: 100px;
            width: 300px;
            margin: 15px 0px;
        }

        .inputS {
            border: none;
            background: #399cff;
            color: #fff;
            padding: 8px 15px;
            border-radius: 100px;
            text-decoration: none;
            box-shadow: 0px 0px 21px #3a81c7;
            outline: none;
        }

        .inputS:hover,
        .inputS:focus {
            text-decoration: none;
            outline: none;
            color: #fff;
            cursor: pointer;
            background: #357bc1;
        }
    </style>
</head>

<body>
    <div id="nameBox">
        <h2>Welcome! Please type your name below to begin chatting.</h2>
        <form method="post" action="">
            <input class="inputT" type="text" name="fname" placeholder="First Name" />
            <input class="inputT" type="text" name="lname" placeholder="Last Name" />
            <input class="inputT" type="text" name="email" placeholder="Email" />
            <input class="inputT" type="text" name="pwd" placeholder="Password" />
            <input class="inputS" type="submit" name="sub" value="Start chatting!" />
        </form>
        <p style="color: red;"><?php echo $error; ?></p>
    </div>
</body>

</html>