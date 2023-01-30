import { FastifyInstance } from "fastify";
import { memberTypeNotFoundErrorMessage } from "../../utils/constants";
import { ChangeMemberTypeDTO } from "../../utils/DB/entities/DBMemberTypes";


export const getMemberType = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.memberTypes.findOne({key:'id',equals: id});
  if (res === null) throw fastify.httpErrors.notFound(memberTypeNotFoundErrorMessage);
  return res;
  }

  export const updateMemberType = async (fastify: FastifyInstance, id: string, data: ChangeMemberTypeDTO) => {
    try {
      return await fastify.db.memberTypes.change(id, data);
    }catch (e){
      throw fastify.httpErrors.badRequest(memberTypeNotFoundErrorMessage);
    }    
  }
