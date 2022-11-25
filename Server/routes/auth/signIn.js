const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../../db/model');

router.get('/', async (req, res) => {
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

                // save user token
                user.token = token;

                // user
                res.status(200).json({
                    "_id": user._id,
                    "token": user.token
                });
            }
            else {
                res.status(400).send("Invalid Credentials");
            }

        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;