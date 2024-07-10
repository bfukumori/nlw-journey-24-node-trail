import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeConfirmTripUseCase } from '@/factories/makeConfirmTripUseCase.js';
import { TripAlreadyConfirmed } from '@/errors/TripAlreadyConfirmed.js';
import { sendTripConfirmationEmail } from '@/lib/mail.js';

export async function confirmTrip(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const confirmTripUseCase = await makeConfirmTripUseCase();

      try {
        const { participants, destination, endsAt, startsAt } =
          await confirmTripUseCase.execute(tripId);

        await Promise.all(
          participants.map(async (participant) => {
            const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

            return await sendTripConfirmationEmail({
              destination,
              startsAt,
              endsAt,
              participantEmail: participant.email,
              confirmationLink,
            });
          })
        );
        return reply.redirect(`http://localhost:3000/trips/${tripId}`);
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        if (error instanceof TripAlreadyConfirmed) {
          return reply.redirect(`http://localhost:3000/trips/${tripId}`);
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
