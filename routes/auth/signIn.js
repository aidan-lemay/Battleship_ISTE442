const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../../db/model');

// GET Login for rendering HTML page in DOM
router.get('/', async (req, res) => {
    res.sendFile(__dirname + "/pageAssets/signIn.html");
});

// POST Login for generating and validating token and authentication data
router.post('/', async (req, res) => {
    try {
        // Get user input
        const { email, hPass } = req.body;

        // Validate user input
        if (!(email && hPass)) {
            res.status(400).send("All input is required");
        }
        else {
            // Validate if user exist in our database
            const user = await Users.findOne({ email });

            if (user && (await bcrypt.compare(hPass, user.hPass))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // Update token in DB
                await Users.updateOne({"_id": user._id}, {$set: {token: token}});

                // user
                // res.status(200).json({
                //     "_id": user._id,
                //     "token": user.token,
                //     "fName": user.fName,
                //     "lName": user.lName
                // });
                res.writeHead(301, { "set-cookie": ["token=" + token, "name=" + user.fName + " " + user.lName],  "Location": '/chat' });
                return res.end();
            }
            else {
                res.status(401).send("Invalid Credentials");
            }

        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;