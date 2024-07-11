import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeGetTripsUseCase } from '@/factories/makeGetTripsUseCase.js';

export async function getTrips(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips',
    {
      schema: {
        querystring: z.object({
          page: z.number().int().positive().default(1),
        }),
        tags: ['trips'],
        response: {
          200: z.object({
            trips: z.array(
              z.object({
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
                    isOwner: z.boolean().nullish(),
                  })
                ),
              })
            ),
            total: z.number().int().positive(),
          }),
        },
        summary: 'Get all trips',
      },
    },
    async (request, reply) => {
      const { page } = request.query;

      const getTripsUseCase = await makeGetTripsUseCase();
      const { trips, total } = await getTripsUseCase.execute(page);

      return reply.code(200).send({ trips, total });
    }
  );
}
