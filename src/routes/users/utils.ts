import { FastifyInstance } from 'fastify';
import { userNotFoundErrorMessage } from '../../utils/constants';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

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
