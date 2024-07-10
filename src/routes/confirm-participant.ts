import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '@/env/index.js';
import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { makeConfirmParticipantUseCase } from '@/factories/makeConfirmParticipantUseCase.js';

export async function confirmParticipant(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participantId/confirm',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;

      const confirmParticipantUseCase = await makeConfirmParticipantUseCase();

      try {
        const { tripId } = await confirmParticipantUseCase.execute(
          participantId
        );

        return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
      } catch (error) {
        if (error instanceof ParticipantNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        if (error instanceof ParticipantAlreadyConfirmed) {
          return reply.redirect(`${env.WEB_BASE_URL}/trips`);
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
