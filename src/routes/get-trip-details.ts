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
        tags: ['trips'],
        response: {
          200: z.object({
            id: z.string().uuid(),
            destination: z.string(),
            startsAt: z.date(),
            endsAt: z.date(),
            createdAt: z.date(),
            isConfirmed: z.boolean(),
            participants: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string().nullish(),
                email: z.string(),
                isConfirmed: z.boolean().nullish(),
                isOwner: z.boolean().nullish(),
                tripId: z.string().uuid().nullish(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'Get details of a trip',
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
