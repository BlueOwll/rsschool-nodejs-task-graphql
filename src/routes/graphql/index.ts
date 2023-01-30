import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';

import { rootSchema } from './gql-queries';
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
 
      return await graphql(
        { 
          schema: rootSchema, 
          source: request.body.query!,
          contextValue: fastify,
          variableValues: request.body.variables
        });
    }
  );
      //--
    }

// GraphQLFieldResolver<TSource, { [argName: string]: any }, TContext> 
export default plugin;
