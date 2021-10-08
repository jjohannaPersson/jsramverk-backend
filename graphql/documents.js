const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: 'Documents',
    description: 'All documents',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        html: { type: GraphQLNonNull(GraphQLString) },
        allowed_users: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
    })
});

module.exports = DocumentType;
