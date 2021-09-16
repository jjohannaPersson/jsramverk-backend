var express = require('express');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();
const database = require("../db/database");

router.get('/update/:id', async (req, res) => {
    let objectID;

    try {
        objectID = new ObjectId(req.params.id);
    } catch (error) {
        res.status(406).send();
        return;
    }

    const db = await database.getDb();
    const resultSet = await db.collection.findOne({_id: objectID});

    await db.client.close();

    if (!resultSet) {
        res.status(406).send();
        return;
    }

    res.json(resultSet);
});

module.exports = router;
