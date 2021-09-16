/* globals resolve */

const database = require("../db/database.js");

// import {resolve} from '@jest/globals';

const setupDb = {
    createNew: async function() {
        const db = await database.getDb();

        db.collection.insertOne(
            {
                "name": "test",
                "html": "test-html",
            }
        );
        let res = await db.collection.find({"name": "test"} ).toArray();
        let result = {};

        result.id = res[0]._id.toString();
        result.data = res[0];

        return result;
    },
    befores: async function() {
        const db = await database.getDb();

        db.db.listCollections(
            { name: "test-docs" }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
                resolve();
            });
    }
};


module.exports = setupDb;
