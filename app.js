const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const getAll = require('./routes/get');
const getOne = require('./routes/getOne');
const createDoc = require('./routes/create');
const updateDoc = require('./routes/update');
const auth = require("./routes/auth");
const mail = require("./routes/mail");
const httpServer = require("http").createServer(app);

//graphql
const visual = false;
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema
} = require("graphql");
const RootQueryType = require("./graphql/root.js");

const port = process.env.PORT || 1337;

app.use(cors());

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.sockets.on('connection', function(socket) {
    socket.on('create', function(room) {
        socket.join(room);
    });

    socket.on("doc", function (data) {
        socket.to(data["_id"]).emit("doc", data);
    });
});

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

const schema = new GraphQLSchema({
    query: RootQueryType
});

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', getAll);
app.use('/', getOne);
app.use('/', createDoc);
app.use('/', updateDoc);
app.use('/', auth);
app.use('/', mail);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual,
}));


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
