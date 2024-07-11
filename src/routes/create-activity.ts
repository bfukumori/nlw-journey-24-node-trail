import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { InvalidDate } from '@/errors/InvalidDate.js';
import { makeCreateActivityUseCase } from '@/factories/makeCreateActivityUseCase.js';

export async function createActivity(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activities',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
        tags: ['activities'],
        response: {
          201: z.object({
            activityId: z.string().uuid(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        summary: 'Create an activity in a trip',
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, occurs_at } = request.body;

      const createActivityUseCase = await makeCreateActivityUseCase();

      try {
        const { activityId } = await createActivityUseCase.execute({
          title,
          occursAt: occurs_at,
          tripId,
        });

        return reply.code(201).send({ activityId });
      } catch (error) {
        if (error instanceof InvalidDate) {
          return reply.code(error.code).send({ message: error.message });
        }

        return reply.code(500).send({ message: 'Server error' });
      }
    }
  );
}
