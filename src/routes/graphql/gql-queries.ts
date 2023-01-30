import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { getMemberType, updateMemberType } from '../member-types/utils';
import { createPost, getPost, updatePost } from '../posts/utils';
import { createProfile, getProfile, updateProfile } from '../profiles/utils';
import { createUser, getUser, subscribeTo, unsubscribeFrom, updateUser } from '../users/utils';
import { changeMemberTypeDTOType, changePostDTOType, changeProfileDTOType, createPostDTOType, createProfileDTOType, createUserDTOType, updateUserDTOType } from './gql-input-types';
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
const rootMutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        user: {
          type: createUserDTOType,
        },
      },
      resolve: (_source, { user }, context) => createUser(context, user),
    },
  
    createProfile: {
      type: profileType,
      args: {
        profile: {
          type: createProfileDTOType,
        },
      },
      resolve: (_source, { profile }, context) => createProfile(context, profile),
    },
    createPost: {
      type: postType,
      args: {
        post: {
          type: new GraphQLNonNull(createPostDTOType),
        },
      },
      resolve: (_source, { post }, context) => createPost(context, post),
    },
    updateUser: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        data: {
          type: new GraphQLNonNull(updateUserDTOType),
        }
      },
      resolve: (_source, { id, data }, context) => updateUser(context, id, data),
    },
    updateProfile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        data: {
          type: new GraphQLNonNull(changeProfileDTOType),
        }
      },
      resolve: (_source, { id, data }, context) => updateProfile(context, id, data),
    },
    updatePost: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        data: {
          type: new GraphQLNonNull(changePostDTOType),
        }
      },
      resolve: (_source, { id, data }, context) => updatePost(context, id, data),
    },
    updateMemberType: {
      type: memberTypeType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        data: {
          type: new GraphQLNonNull(changeMemberTypeDTOType),
        }
      },
      resolve: (_source, { id, data }, context) => updateMemberType(context, id, data),
    },
    subscribeTo: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (_source, { id, userId }, context) => subscribeTo(context, id, userId),
    },
    unsubscribeFrom: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (_source, { id, userId }, context) => unsubscribeFrom(context, id, userId),
    },

  },
});
export const rootSchema = new GraphQLSchema({ query: rootQuery, mutation: rootMutation });
