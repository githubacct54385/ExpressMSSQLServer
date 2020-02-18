const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = require("graphql");
const validator = require("validator");
const { getUsers, addUser, deleteUser, updateUser } = require("./userMethods");

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    Id: { type: GraphQLString },
    Name: { type: GraphQLString },
    Email: { type: GraphQLString },
    CreatedAt: { type: GraphQLString },
    UpdatedAt: { type: GraphQLString },
    Error: { type: GraphQLString }
  })
});

const AddUserPayload = new GraphQLObjectType({
  name: "AddUserPayload",
  fields: () => ({
    HasError: { type: GraphQLBoolean },
    Field: { type: GraphQLString },
    Msg: { type: GraphQLString }
  })
});

const DeleteUserPayload = new GraphQLObjectType({
  name: "DeleteUserPayload",
  fields: () => ({
    HasError: { type: GraphQLBoolean },
    Msg: { type: GraphQLString }
  })
});

const UpdateUserPayload = new GraphQLObjectType({
  name: "UpdateUserPayload",
  fields: () => ({
    HasError: { type: GraphQLBoolean },
    Msg: { type: GraphQLString }
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

// Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updateUser: {
      type: UpdateUserPayload,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        }
      },
      async resolve(parentValue, args) {
        if (args.id === null || args.id === "") {
          return {
            HasError: true,
            Msg: "Id argument cannot be empty or null"
          };
        }

        if (!validator.isUUID(args.id)) {
          return {
            HasError: true,
            Msg: "Id is not a Guid."
          };
        }

        if (!args.name && !args.email) {
          return {
            HasError: true,
            Msg:
              "Neither name or email was selected for update.  You must choose at least one."
          };
        }

        const updateResult = await updateUser(args.id, args.name, args.email);
        if (updateResult.success) {
          return { HasError: false, Msg: "" };
        } else {
          return { HasError: true, Msg: updateResult.msg };
        }
      }
    },
    deleteUser: {
      type: DeleteUserPayload,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(parentValue, args) {
        if (args.id === null || args.id === "") {
          return {
            HasError: true,
            Msg: "Id argument cannot be empty or null."
          };
        }
        const { success, msg } = await deleteUser(args.id);
        if (success) {
          return { HasError: false, Msg: "" };
        } else {
          return { HasError: true, Msg: msg };
        }
      }
    },
    addUser: {
      type: AddUserPayload,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(parentValue, args) {
        // input validation
        if (args.name === null || args.name === "") {
          return {
            HasError: true,
            Field: "Name",
            Msg: "Name argument cannot be empty."
          };
        }

        if (args.email === null || args.email === "") {
          return {
            HasError: true,
            Field: "Email",
            Msg: "Name argument cannot be empty."
          };
        }

        if (validator.isEmail(args.email) === false) {
          return {
            HasError: true,
            Field: "Email",
            Msg: "Email argument is not an email."
          };
        }

        const { user } = await addUser(args.name, args.email);
        if (user !== null) {
          return { HasError: false, Field: "", Msg: "" };
        } else {
          return { HasError: true, Field: "Unknown", Msg: "Server Error!" };
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
