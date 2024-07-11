import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeGetActivitiesUseCase } from '@/factories/makeGetActivitiesUseCase.js';

export async function getActivities(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/activities',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        tags: ['activities'],
        response: {
          200: z.object({
            activities: z.array(
              z.object({
                date: z.date(),
                activities: z.array(
                  z.object({
                    id: z.string().uuid(),
                    title: z.string(),
                    occursAt: z.date(),
                  })
                ),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'List all activities for a trip',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const getActivitiesUseCase = await makeGetActivitiesUseCase();

      try {
        const { activities } = await getActivitiesUseCase.execute(tripId);

        return reply.code(200).send({ activities });
      } catch (error) {
        if (error instanceof TripNotFound) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
