import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '@/env/index.js';
import { TripAlreadyConfirmed } from '@/errors/TripAlreadyConfirmed.js';
import { makeConfirmTripUseCase } from '@/factories/makeConfirmTripUseCase.js';
import { sendTripConfirmationEmail } from '@/lib/mail.js';

export async function confirmTrip(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        tags: ['trips'],
        response: {
          200: z.void(),
          422: z.object({
            message: z.string(),
          }),
        },
        summary: 'Confirm a trip',
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
            const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

            return await sendTripConfirmationEmail({
              destination,
              startsAt,
              endsAt,
              participantEmail: participant.email,
              confirmationLink,
            });
          })
        );
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
      } catch (error) {
        if (error instanceof TripAlreadyConfirmed) {
          return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
        }
      }
    }
  );
}
