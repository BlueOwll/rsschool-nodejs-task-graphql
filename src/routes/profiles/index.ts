import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { invalidMemberTypeErrorMessage, profileExistsErrorMessage, profileNotFoundErrorMessage } from '../../utils/constants';



const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const res = await this.db.profiles.findOne({key:'id',equals:request.params.id});
      if (res === null) throw this.httpErrors.notFound(profileNotFoundErrorMessage);
        return res;
      }
    
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if((await this.db.profiles.findMany({key: 'userId', equals: request.body.userId})).length) {
        throw this.httpErrors.badRequest(profileExistsErrorMessage);
      }
      if(!(await this.db.memberTypes.findOne({key: 'id', equals: request.body.memberTypeId}))) {
        throw this.httpErrors.badRequest(invalidMemberTypeErrorMessage);
      }
      return await this.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await this.db.profiles.delete(request.params.id);
      }catch (e){
        throw this.httpErrors.badRequest(profileNotFoundErrorMessage);
      }      
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await this.db.profiles.change(request.params.id, request.body);
      }catch (e){
        throw this.httpErrors.badRequest(profileNotFoundErrorMessage);
      }      
    }
  );
};

export default plugin;
