import { FastifyInstance } from 'fastify';
import { profileNotFoundErrorMessage } from '../../utils/constants';

export const getProfile = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.profiles.findOne({ key: 'id', equals: id });
  if (res === null)
    throw fastify.httpErrors.notFound(profileNotFoundErrorMessage);
  return res;
};
