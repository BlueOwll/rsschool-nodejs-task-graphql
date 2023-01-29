import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { getMemberType } from '../member-types/utils';
import { getPost } from '../posts/utils';
import { getProfile } from '../profiles/utils';
import { getUser } from '../users/utils';
// import { getUser } from "../users/user_utils";
import { userType, profileType, postType, memberTypeType } from './gql-types';

const rootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    users: {
      type: new GraphQLList(userType),
      resolve(source, args, context) {
        return context.db.users.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve(source, args, context) {
        return context.db.profiles.findMany();
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve(source, args, context) {
        return context.db.posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      resolve(source, args, context) {
        return context.db.memberTypes.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context) => getUser(context, id),
    },
    profile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context) => getProfile(context, id),
    },
    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context) => getPost(context, id),
    },
    memberType: {
      type: memberTypeType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context) => getMemberType(context, id),
    },
  },
});
export const rootSchema = new GraphQLSchema({ query: rootQuery });
