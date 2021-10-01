var express = require('express');
var router = express.Router();
const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;

router.post('/create', async (req, res) => {
    const db = await database.getDb();
    const doc = {
        name: req.body.name,
        html: req.body.html,
        allowed_users: []
    };

    const result = await db.collection.insertOne(doc);

    await db.client.close();

    res.status(201).json(result);
    return result;
});

router.delete('/del/:id', async (req, res) => {
    const db = await database.getDb();
    console.log(req.params.id);
    const filter = { _id: ObjectId(req.params.id) };

    const result = await db.collection.deleteOne(filter);

    await db.client.close();
    res.status(204).send();

    res.status(201).json(result);
    return result;
});

module.exports = router;
