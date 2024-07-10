import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { makeGetParticipantsUseCase } from '@/factories/makeGetParticipantsUseCase.js';

export async function getParticipants(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/participants',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const getParticipantsUseCase = await makeGetParticipantsUseCase();

      try {
        const participants = await getParticipantsUseCase.execute(tripId);

        return reply.code(200).send(participants);
      } catch (error) {
        if (error instanceof ParticipantNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
