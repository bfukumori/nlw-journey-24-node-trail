import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '@/env/index.js';
import { InvalidDate } from '@/errors/InvalidDate.js';
import { makeCreateTripUseCase } from '@/factories/makeCreateTripUseCase.js';
import { sendTripCreateEmail } from '@/lib/mail.js';

export async function createTrip(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request, reply) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      const createTripUseCase = await makeCreateTripUseCase();

      try {
        const { tripId } = await createTripUseCase.execute({
          destination,
          startsAt: starts_at,
          endsAt: ends_at,
          ownerName: owner_name,
          ownerEmail: owner_email,
          emailsToInvite: emails_to_invite,
        });

        const confirmationLink = `${env.API_BASE_URL}/trips/${tripId}/confirm`;

        await sendTripCreateEmail({
          destination,
          startsAt: starts_at,
          endsAt: ends_at,
          ownerName: owner_name,
          ownerEmail: owner_email,
          confirmationLink,
        });

        return reply.code(201).send({ tripId });
      } catch (error) {
        if (error instanceof InvalidDate) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
