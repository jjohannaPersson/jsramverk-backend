var express = require('express');
var router = express.Router();
const database = require("../db/database");
const getAll = require("../src/get.js");

router.get('/', (req, res) => getAll.getAllDocs(res, req));

module.exports = router;
