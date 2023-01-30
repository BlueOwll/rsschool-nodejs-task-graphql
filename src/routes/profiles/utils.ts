import { FastifyInstance } from 'fastify';

import {
  invalidMemberTypeErrorMessage,
  profileExistsErrorMessage,
  profileNotFoundErrorMessage,
} from '../../utils/constants';
import { ChangeProfileDTO, CreateProfileDTO } from '../../utils/DB/entities/DBProfiles';

export const getProfile = async (fastify: FastifyInstance, id: string) => {
  const res = await fastify.db.profiles.findOne({ key: 'id', equals: id });
  if (res === null)
    throw fastify.httpErrors.notFound(profileNotFoundErrorMessage);
  return res;
};

export const createProfile = async (
  fastify: FastifyInstance,
  profile: CreateProfileDTO
) => {
  if (
    (
      await fastify.db.profiles.findMany({
        key: 'userId',
        equals: profile.userId,
      })
    ).length
  ) {
    throw fastify.httpErrors.badRequest(profileExistsErrorMessage);
  }
  if (
    !(await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: profile.memberTypeId,
    }))
  ) {
    throw fastify.httpErrors.badRequest(invalidMemberTypeErrorMessage);
  }
  return fastify.db.profiles.create(profile);
};

export const updateProfile = async (fastify: FastifyInstance, id: string, data: ChangeProfileDTO) => {
  try {
    return await fastify.db.profiles.change(id, data);
  }catch (e){
    throw fastify.httpErrors.badRequest(profileNotFoundErrorMessage);
  }  
}
