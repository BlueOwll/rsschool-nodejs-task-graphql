import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { getUserFollowers, getUserPosts, getUserProfile, getUserSubscription } from "../users/utils";

// export type UserEntity = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   subscribedToUserIds: string[];
// };
export const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: (user, args, context) => getUserFollowers(context, user),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (user, args, context) => getUserPosts(context, user),
    },
    profile: {
      type: profileType,
      resolve: (user, args, context) => getUserProfile(context, user),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: (user, args, context) => getUserSubscription(context, user),
    }
  }),
});
// export type ProfileEntity = {
//   id: string;
//   avatar: string;
//   sex: string;
//   birthday: number;
//   country: string;
//   street: string;
//   city: string;
//   memberTypeId: string;
//   userId: string;
// };
export const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLInt,
    },
    country: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
   }),
});
// export type PostEntity = {
//   id: string;
//   title: string;
//   content: string;
//   userId: string;
// };
export const postType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
});
// export type MemberTypeEntity = {
//   id: string;
//   discount: number;
//   monthPostsLimit: number;
// };
export const memberTypeType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostLimit: {
      type: GraphQLInt,
    },
  })
});
//resolver(source, args, context);
