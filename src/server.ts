import Fastify from 'fastify';
import {
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import { confirmTrip } from './routes/confirm-trip.js';
import { createTrip } from './routes/create-trip.js';
import { getTrips } from './routes/get-trips.js';
import { env } from './env/index.js';
import { confirmParticipant } from './routes/confirm-participant.js';
import { createActivity } from './routes/create-activity.js';
import { getActivities } from './routes/get-activities.js';
import { createLink } from './routes/create-link.js';
import { getLinks } from './routes/get-links.js';

const PORT = env.PORT;

const fastify = Fastify();

fastify.register(cors, {
  origin: '*',
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(createTrip);
fastify.register(getTrips);
fastify.register(confirmTrip);
fastify.register(confirmParticipant);
fastify.register(createActivity);
fastify.register(getActivities);
fastify.register(createLink);
fastify.register(getLinks);

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
