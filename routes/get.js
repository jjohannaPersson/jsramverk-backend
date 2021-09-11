var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async (req, res) => {
    const db = await database.getDb();
        const resultSet = await db.collection.find({}).toArray();

        await db.client.close();

        res.json(resultSet);
});

module.exports = router;
