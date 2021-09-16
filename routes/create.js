var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/create', async (req, res) => {
    const db = await database.getDb();
    const doc = {
        name: req.body.name,
        html: req.body.html,
    };

    const result = await db.collection.insertOne(doc);

    await db.client.close();

    res.status(201).json(result);
    return result;
});

module.exports = router;
