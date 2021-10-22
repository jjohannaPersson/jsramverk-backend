var express = require('express');
var router = express.Router();
const mail = require("../src/mail.js");

router.get('/mail/send/:user',
    (req, res) => mail.sendMail(req.params.user)
);

module.exports = router;
