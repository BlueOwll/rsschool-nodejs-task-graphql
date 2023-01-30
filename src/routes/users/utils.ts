import { FastifyInstance } from 'fastify';
import { noSuchSubscriptionErrorMessage, userNotFoundErrorMessage } from '../../utils/constants';
import { UserEntity, CreateUserDTO, ChangeUserDTO } from '../../utils/DB/entities/DBUsers';
import { getMemberType } from '../member-types/utils';

export type UpdateUserDTO = Omit<ChangeUserDTO, 'subscribedToUserIds'>;

export const getUser = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.users.findOne({ key: 'id', equals: id });
  if (res === null) throw fastify.httpErrors.notFound(userNotFoundErrorMessage);
  return res;
};

export const deleteUser = async (fastify: FastifyInstance, id: string) => {
  let result: UserEntity;
  try {
    result = await fastify.db.users.delete(id);
  } catch (e) {
    throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
  }

  const profiles = await fastify.db.profiles.findMany({
    key: 'userId',
    equals: id,
  });
  if (profiles.length) {
    await fastify.db.profiles.delete(profiles[0].id);
  }

  const posts = await fastify.db.posts.findMany({ key: 'userId', equals: id });
  if (posts.length) {
    posts.forEach(async (post) => {
      await fastify.db.posts.delete(post.id);
    });
  }
  const users = await fastify.db.users.findMany({
    key: 'subscribedToUserIds',
    inArray: id,
  });
  if (users.length) {
    users.forEach(async (user) => {
      await fastify.db.users.change(user.id, {
        subscribedToUserIds: user.subscribedToUserIds.filter(
          (item) => item !== id
        ),
      });
    });
  }
  return result;
};
export const getUserPosts = async (fastify: FastifyInstance, user: UserEntity) => {
  console.log(user);
  return await fastify.db.posts.findMany({
    key: 'userId',
    equals: user.id,
  });
}

export const getUserProfile = async (fastify: FastifyInstance, user: UserEntity) => {
  return await fastify.db.profiles.findOne({
    key: 'userId',
    equals: user.id,
  });
}

export const getUserMemberType = async (fastify: FastifyInstance, user: UserEntity) => {
  const profile = await getUserProfile(fastify, user);
  if (!profile) return null;

  return await getMemberType(fastify, profile.memberTypeId);
}

export const getUserSubscription = (fastify: FastifyInstance, user: UserEntity) => {
  return fastify.db.users.findMany({
    key: 'subscribedToUserIds',
    inArray: user.id,
  });
}
  
  export const getUserFollowers = (fastify: FastifyInstance, user: UserEntity) => {
    return user.subscribedToUserIds.map((id) => getUser(fastify, id))  
  }

  export const createUser = (fastify: FastifyInstance, user: CreateUserDTO) => {
    return fastify.db.users.create(user);
  }

  export const updateUser = async (fastify: FastifyInstance, id: string, data: UpdateUserDTO) => {
    try {
      return await fastify.db.users.change(id, data);
    } catch (e) {
      throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
    }
  }
  export const subscribeTo = async (fastify: FastifyInstance, followerId: string, userId: string) => {
    if (
      !(await fastify.db.users.findOne({ key: 'id', equals: followerId }))
    ) {
      throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
    }
  
    const parentUser = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (!parentUser)
      throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
  
    const { id, ...changeDTO } = parentUser;
    if (changeDTO.subscribedToUserIds.includes(followerId)) {
      return parentUser;
    }
    changeDTO.subscribedToUserIds.push(followerId);
    return await fastify.db.users.change(id, changeDTO);
  
  };

  export const unsubscribeFrom = async (fastify: FastifyInstance, followerId: string, userId: string) => {
    
    if (!(await fastify.db.users.findOne({ key: 'id', equals: followerId }))) {
      throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
    }

    const parentId = userId;
    const parentUser = await fastify.db.users.findOne({
      key: 'id',
      equals: parentId,
    });
    if (!parentUser)
      throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);

    const { id, ...changeDTO } = parentUser;
    if (!changeDTO.subscribedToUserIds.includes(followerId)) {
      throw fastify.httpErrors.badRequest(noSuchSubscriptionErrorMessage);
    }

    return await fastify.db.users.change(parentId, {
      subscribedToUserIds: changeDTO.subscribedToUserIds.filter(
        (item) => item !== followerId
      ),
    });
  };
 
  
 