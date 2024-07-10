import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeGetTripDetailsUseCase } from '@/factories/makeGetTripDetailsUseCase.js';

export async function getTripDetails(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const getTripDetailsUseCase = await makeGetTripDetailsUseCase();

      try {
        const trip = await getTripDetailsUseCase.execute(tripId);

        return reply.code(200).send(trip);
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
