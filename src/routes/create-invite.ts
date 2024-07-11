import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '@/env/index.js';
import { makeCreateInviteUseCase } from '@/factories/makeCreateInviteUseCase.js';
import { makeGetTripDetailsUseCase } from '@/factories/makeGetTripDetailsUseCase.js';
import { sendTripConfirmationEmail } from '@/lib/mail.js';

export async function createInvite(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invites',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
        tags: ['invites'],
        response: {
          200: z.void(),
          422: z.object({
            message: z.string(),
          }),
        },
        summary: 'Create an invite for a participant',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const createInviteUseCase = await makeCreateInviteUseCase();
      const getTripDetails = await makeGetTripDetailsUseCase();

      const { email: participantEmail } = await createInviteUseCase.execute({
        email,
        tripId,
      });

      const { destination, startsAt, endsAt } = await getTripDetails.execute(
        tripId
      );

      const confirmationLink = `${env.API_BASE_URL}/participants/${tripId}/confirm`;

      await sendTripConfirmationEmail({
        destination,
        startsAt,
        endsAt,
        participantEmail,
        confirmationLink,
      });

      return reply.code(204).send();
    }
  );
}
