import { FastifyInstance } from "fastify";
import { postNotFoundErrorMessage } from "../../utils/constants";

export const getPost = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.posts.findOne({key:'id',equals: id});
  if (res === null) throw fastify.httpErrors.notFound(postNotFoundErrorMessage);
    return res;
  
  }
