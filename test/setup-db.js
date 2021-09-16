const database = require("../db/database.js");

const setupDb = {
    createNew: async function() {
        const db = await database.getDb();
        db.collection.insertOne(
            {
                "name" : "test",
                "html" : "test-html",
            }
         )
        let res = await db.collection.find({"name": "test"} ).toArray();
        let result = {};

        result.id = res[0]._id.toString();
        result.data = res[0];

        return result;
    },
    find: async function(title) {
       const db = await database.getDb();
       let res = await db.collection.find({"html": `${name}`} ).toArray();
       return res;
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
}


module.exports = setupDb;
