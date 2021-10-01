const mongo = require("mongodb").MongoClient;
const collectionName = "doc";
const collectionNameUsers = "users";

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
        console.log(password);
        console.log(username);
        let dsn = `mongodb+srv://texteditor:${password}
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
        const collectionUsers = await db.collection(collectionNameUsers);

        return {
            db: db,
            collection: collection,
            collectionUsers: collectionUsers,
            client: client,
        };
    }
};

module.exports = database;
