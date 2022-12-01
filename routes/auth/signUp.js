const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../../db/model');

// GET Login for rendering HTML page in DOM
router.get('/', async (req, res) => {
    res.sendFile(__dirname + "/pageAssets/signUp.html");
});

router.post('/', async (req, res) => {

    try {
        // Get user input
        const { fName, lName, email, hPass } = req.body;

        // Validate user input
        if (!(email && hPass && fName && lName)) {
            res.status(400).send("All input is required");
        }
        else {
            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await Users.findOne({ email });

            if (oldUser) {
                return res.status(409).send("Users Already Exist. Please Login");
            }
            else {
                //Encrypt user hPass
                let encryptedPassword = await bcrypt.hash(hPass, 10);

                // Create user in our database
                const user = await Users.create({
                    fName,
                    lName,
                    email: email.toLowerCase(), // sanitize: convert email to lowercase
                    hPass: encryptedPassword
                });

                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // Update token in DB
                await Users.updateOne({"_id": user._id}, {$set: {token: token}})

                // return new user
                // res.status(201).json({
                //     "_id": user._id,
                //     "token": user.token,
                //     "fName": user.fName,
                //     "lName": user.lName
                // });
                res.writeHead(301, { "set-cookie": "token=" + token, "Location": '/chat' });
                return res.end();
            }
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;