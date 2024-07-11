import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeGetParticipantDetailsUseCase } from '@/factories/makeGetParticipantDetailsUseCase.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';

export async function getParticipantDetails(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participantId',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
        tags: ['participants'],
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string().nullish(),
            email: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'Get the details of a participant in a trip',
      },
    },

    async (request, reply) => {
      const { participantId } = request.params;

      const getParticipantDetailsUseCase =
        await makeGetParticipantDetailsUseCase();

      try {
        const participant = await getParticipantDetailsUseCase.execute(
          participantId
        );

        return reply.code(200).send(participant);
      } catch (error) {
        if (error instanceof ParticipantNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
