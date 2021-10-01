var express = require('express');
var router = express.Router();
const auth = require("../src/auth.js");

router.post('/login', (req, res) => auth.login(res, req));
router.post('/signup', (req, res) => auth.register(res, req));

module.exports = router;
