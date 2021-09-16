var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const database = require("../db/database");

router.put('/update/:id', async (req, res) => {
    const db = await database.getDb();
    const filter = { _id: ObjectId(req.params.id) };
    const updateDocument = {
        $set: {
            name: req.body.name,
            html: req.body.html,
        }
    };

    const result = await db.collection.updateOne(
        filter,
        updateDocument,
    );

    await db.client.close();

    if (result.matchedCount !== 1) {
        res.status(400).send();
        return;
    }

    res.status(201).json(result);
});

module.exports = router;
