import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeGetParticipantsUseCase } from '@/factories/makeGetParticipantsUseCase.js';

export async function getParticipants(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/participants',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        tags: ['participants'],
        response: {
          200: z.object({
            participants: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string().nullish(),
                email: z.string(),
                isConfirmed: z.boolean().nullish(),
              })
            ),
          }),
          422: z.object({
            message: z.string(),
          }),
        },
        summary: 'List all participants in a trip',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const getParticipantsUseCase = await makeGetParticipantsUseCase();

      const participants = await getParticipantsUseCase.execute(tripId);

      return reply.code(200).send(participants);
    }
  );
}
