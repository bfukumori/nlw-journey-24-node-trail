import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { makeCreateLinkUseCase } from '@/factories/makeCreateLinkUseCase.js';
import { TripNotFound } from '@/errors/TripNotFound.js';

export async function createLink(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/links',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, url } = request.body;

      const createLinkUseCase = await makeCreateLinkUseCase();

      try {
        const { linkId } = await createLinkUseCase.execute({
          title,
          url,
          tripId,
        });

        return reply.code(201).send({ linkId });
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
