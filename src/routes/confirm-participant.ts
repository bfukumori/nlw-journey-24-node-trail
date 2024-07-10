import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { makeConfirmParticipantUseCase } from '@/factories/makeConfirmParticipantUseCase.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';

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

        return reply.redirect(`http://localhost:3000/trips/${tripId}`);
      } catch (error) {
        if (error instanceof ParticipantNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        if (error instanceof ParticipantAlreadyConfirmed) {
          return reply.redirect(`http://localhost:3000/trips`);
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
