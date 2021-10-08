const database = require("../db/database.js");

const docs = {
    getAllDocs: async function getAllDocs(
        res=undefined,
        req=undefined
    ) {
        if (req === undefined) {
            console.log("req is undefined");
        }

        const db = await database.getDb();
        const resultSet = await db.collection.find({}).toArray();

        if (res === undefined) {
                return resultSet;
            }

        await db.client.close();

        res.json(resultSet);
    }
};

module.exports = docs;
