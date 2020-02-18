const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const { getUsers } = require("./userMethods");

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    Id: { type: GraphQLString },
    Name: { type: GraphQLString },
    Email: { type: GraphQLString },
    CreatedAt: { type: GraphQLString },
    UpdatedAt: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return getUsers().then(res => res.users);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
