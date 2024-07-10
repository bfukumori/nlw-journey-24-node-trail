import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { makeGetTripsUseCase } from '@/factories/makeGetTripsUseCase.js';

export async function getTrips(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/trips',
    {
      schema: {
        querystring: z.object({
          page: z.number().int().positive().default(1),
        }),
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
