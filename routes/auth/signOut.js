const express = require('express');
const router = express.Router();

// GET Login for rendering HTML page in DOM
router.get('/', async (req, res) => {
    res.writeHead(302, {"set-cookie": ["token=", "name=", "uid="], "Location": '/signIn' });
    return res.end();
});

module.exports = router;