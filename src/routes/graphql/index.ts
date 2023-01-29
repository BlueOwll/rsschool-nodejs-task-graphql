import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { user, profile, post, memberType } from './ggl-types';
import { graphqlBodySchema } from './schema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      //--
      const RootQuery = new GraphQLObjectType({
        name: 'query',
        fields: {
          users: {
            type: new GraphQLList(user),
            resolve () {
              return fastify.db.users.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(profile),
            resolve() {
              return fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(post),
            resolve() {
              return fastify.db.posts.findMany();
            },
          },
          memberTypes: {
            type: new GraphQLList(memberType),
            resolve() {
              return fastify.db.memberTypes.findMany();
            },
          },
        }}
      ); 
      const schema = new GraphQLSchema({ query: RootQuery })
      console.log("schema");
      return await graphql({ schema, source: request.body.query! });
    }
  );
      //--
    }

// GraphQLFieldResolver<TSource, { [argName: string]: any }, TContext> 
export default plugin;
