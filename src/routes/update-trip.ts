import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { InvalidDate } from '@/errors/InvalidDate.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeUpdateTripUseCase } from '@/factories/makeUpdateTripUseCase.js';

export async function updateTrip(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().put(
    '/trips/:tripId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          destination: z.string().min(4).optional(),
          starts_at: z.coerce.date().optional(),
          ends_at: z.coerce.date().optional(),
        }),
        tags: ['trips'],
        response: {
          204: z.void(),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'Update a trip',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { destination, starts_at, ends_at } = request.body;

      const updateTripUseCase = await makeUpdateTripUseCase();

      try {
        await updateTripUseCase.execute({
          destination,
          startsAt: starts_at,
          endsAt: ends_at,
          tripId,
        });

        return reply.code(204).send();
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        if (error instanceof InvalidDate) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
