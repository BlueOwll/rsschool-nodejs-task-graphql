import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

/* export type UserEntity = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   subscribedToUserIds: string[];
// };
// type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
// type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>;
*/
export const createUserDTOType = new GraphQLInputObjectType({
  name: 'createUserDTOType',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
});
/*export type PostEntity = {
//   id: string;
//   title: string;
//   content: string;
//   userId: string;
// };
// export type CreatePostDTO = Omit<PostEntity, 'id'>;
// export type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>;
*/
export const createPostDTOType = new GraphQLInputObjectType({
  name: 'createPostDTOType',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }
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
// export type CreateProfileDTO = Omit<ProfileEntity, 'id'>;
// export type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>;
export const createProfileDTOType = new GraphQLInputObjectType({
  name: 'createProfileDTOType',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }
});