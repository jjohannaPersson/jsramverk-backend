const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocumentType = require("./documents.js");
const UserType = require("./users.js");
const getDocs = require("../src/get.js");
const getUsers = require("../src/auth.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        documents: {
            type: GraphQLList(DocumentType),
            description: "Get all documents",
            resolve: async function() {
                return await getDocs.getAllDocs();
            }
        },
        document: {
            type: DocumentType,
            description: 'Get one document by name',
            args: {
                name: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let documents = await getDocs.getAllDocs();

                return documents.find(doc => doc.name === args.name);
            }
        },
        users: {
            type: GraphQLList(UserType),
            description: "Get all users",
            resolve: async function() {
                return await getUsers.getAllUsers();
            }
        },
        user: {
            type: UserType,
            description: 'Get one user by email',
            args: {
                email: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let users = await getUsers.getAllUsers();

                return users.find(user => user.email === args.email);
            }
        }
    })
});

module.exports = RootQueryType;
