import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeGetLinksUseCase } from '@/factories/makeGetLinksUseCase.js';

export async function getLinks(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/links',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        tags: ['links'],
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                url: z.string().url(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'List all links for a trip',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const getLinksUseCase = await makeGetLinksUseCase();

      try {
        const { links } = await getLinksUseCase.execute(tripId);

        return reply.code(200).send({ links });
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
