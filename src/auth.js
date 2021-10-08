const database = require("../db/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let config;

try {
    config = require("../db/config.json");
} catch (error) {
    console.error(error);
}

const jwtSecret = process.env.JWT_SECRET || config.secret;

const auth = {
    login: async function(res, req) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email eller lösenord saknas",
                    detail: "Email eller lösenord saknas i request"
                }
            });
        }

        let db;
        let user;

        try {
            db = await database.getDb();
            user = await db.collectionUsers.findOne({email: req.body.email});
            if (user) {
                return auth.comparePasswords(
                    res,
                    password,
                    user,
                );
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch(e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: function(res, password, user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Fel lösenord",
                    detail: "Lösenordet är fel."
                }
            });
        });
    },

    register: async function(res, req) {
        const saltRounds = 5;
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/signup",
                    title: "Email eller lösenord saknas",
                    detail: "Email eller lösenord saknas i request"
                }
            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/signup",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let db;

            try {
                db = await database.getDb();

                let users = {
                    email: email,
                    password: hash,
                };

                await db.collectionUsers.insertOne(users);

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/signup",
                        title: "Database error",
                        detail: err.message
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    checkToken: function(req, res, next) {
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    },
    getAllUsers: async function (
        res=undefined,
        req=undefined
    ) {
        const db = await database.getDb();
        const resultSet = await db.collectionUsers.find({}).toArray();

        if (res === undefined) {
                return resultSet;
            }

        await db.client.close();

        res.json(resultSet);
    }
};

module.exports = auth;
