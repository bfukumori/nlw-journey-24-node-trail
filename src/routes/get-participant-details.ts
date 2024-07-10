import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeGetParticipantDetailsUseCase } from '@/factories/makeGetParticipantDetailsUseCase.js';

export async function getParticipantDetails(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participantId',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
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
        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
