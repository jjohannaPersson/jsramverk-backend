const mongo = require("mongodb").MongoClient;
const collectionName = "doc";

let config;

try {
    config = require("./config.json");
} catch (error) {
    console.error(error);
}

const username = process.env.USERNAME || config.username;
const password = process.env.PASSWORD || config.password;

const database = {
    getDb: async function getDb() {
        let dsn = `mongodb+srv://${username}:${password}
@cluster0.drwbg.mongodb.net/documents?retryWrites=true&w=majority`;
        // let dsn = `mongodb://localhost:27017/documents`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
