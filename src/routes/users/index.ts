import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { noSuchSubscriptionErrorMessage, userNotFoundErrorMessage } from '../../utils/constants';



const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    
    return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      console.log(request.params.id);
      const res = await this.db.users.findOne({key:'id',equals:request.params.id});
      if (res === null) throw this.httpErrors.notFound(userNotFoundErrorMessage);
        return res;
      }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await this.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      let result: UserEntity;
      try {
        result = await this.db.users.delete(id);
      }catch (e){
        throw this.httpErrors.badRequest(userNotFoundErrorMessage);
      }      
      
      const profiles = await this.db.profiles.findMany({key: 'userId', equals: id});
      if(profiles.length) {
        await this.db.profiles.delete(profiles[0].id);
      }

      const posts = await this.db.posts.findMany({key: 'userId', equals: id});
      if(posts.length) {
        posts.forEach(async (post) => {
          await this.db.posts.delete(post.id);
        });               
      }
      const users = await this.db.users.findMany({key: 'subscribedToUserIds', inArray: id});
      if(users.length) {
        users.forEach(async (user) => {
          await this.db.users.change(
            user.id, 
            { 
              subscribedToUserIds: user.subscribedToUserIds.filter((item) => item !== id)
            }
          );
        });               
      }

      return result;
      

    }
    // add deleting relations - who subscribed, profile
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (!(await this.db.users.findOne({key:'id',equals:request.params.id}))){
        throw this.httpErrors.badRequest(userNotFoundErrorMessage);
      };

      const parentUser = await this.db.users.findOne({key:'id',equals:request.body.userId});
      if (!parentUser) throw this.httpErrors.badRequest(userNotFoundErrorMessage);

      const { id, ...changeDTO } = parentUser;
      if(changeDTO.subscribedToUserIds.includes(id)) {
        return parentUser;
      }
      changeDTO.subscribedToUserIds.push(request.params.id);
      return await this.db.users.change(id, changeDTO);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;
      if (!(await this.db.users.findOne({key:'id', equals: userId}))){
        throw this.httpErrors.badRequest(userNotFoundErrorMessage);
      };

      const parentId = request.body.userId;
      const parentUser = await this.db.users.findOne({key:'id', equals: parentId});
      if (!parentUser) throw this.httpErrors.badRequest(userNotFoundErrorMessage);

      const { id, ...changeDTO } = parentUser;
      if(!changeDTO.subscribedToUserIds.includes(userId)) {
        throw this.httpErrors.badRequest(noSuchSubscriptionErrorMessage);
      }     

      return await this.db.users.change(
        parentId, 
        {
          subscribedToUserIds: changeDTO.subscribedToUserIds.filter((item) => item !== userId)
        }
        );      
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      try {
        return await this.db.users.change(request.params.id, request.body);
      }catch (e){
        throw this.httpErrors.badRequest(userNotFoundErrorMessage);
      }      

    }
  );
};


export default plugin;
