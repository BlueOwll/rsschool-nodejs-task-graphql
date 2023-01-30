import { FastifyInstance } from 'fastify';
import {
  postNotFoundErrorMessage,
  userNotFoundErrorMessage,
} from '../../utils/constants';
import { CreatePostDTO } from '../../utils/DB/entities/DBPosts';

export const getPost = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.posts.findOne({ key: 'id', equals: id });
  if (res === null) throw fastify.httpErrors.notFound(postNotFoundErrorMessage);
  return res;
};

export const createPost = async (
  fastify: FastifyInstance,
  post: CreatePostDTO
) => {
  if (!(await fastify.db.users.findOne({ key: 'id', equals: post.userId }))) {
    throw fastify.httpErrors.badRequest(userNotFoundErrorMessage);
  }
  return await fastify.db.posts.create(post);
};
