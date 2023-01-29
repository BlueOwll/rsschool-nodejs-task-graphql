import { FastifyInstance } from "fastify";
import { memberTypeNotFoundErrorMessage } from "../../utils/constants";


export const getMemberType = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.memberTypes.findOne({key:'id',equals: id});
  if (res === null) throw fastify.httpErrors.notFound(memberTypeNotFoundErrorMessage);
  return res;
  }
