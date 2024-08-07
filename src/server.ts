import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { env } from './env/index.js';
import { errorHandler } from './errors/error-handler.js';
import { confirmParticipant } from './routes/confirm-participant.js';
import { confirmTrip } from './routes/confirm-trip.js';
import { createActivity } from './routes/create-activity.js';
import { createInvite } from './routes/create-invite.js';
import { createLink } from './routes/create-link.js';
import { createTrip } from './routes/create-trip.js';
import { getActivities } from './routes/get-activities.js';
import { getLinks } from './routes/get-links.js';
import { getParticipantDetails } from './routes/get-participant-details.js';
import { getParticipants } from './routes/get-participants.js';
import { getTripDetails } from './routes/get-trip-details.js';
import { getTrips } from './routes/get-trips.js';
import { updateTrip } from './routes/update-trip.js';

const PORT = env.PORT;

const fastify = Fastify();

fastify.register(cors, {
  origin: '*',
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Planner API documentation',
      description: 'API documentation for the Planner app',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

fastify.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

fastify.setErrorHandler(errorHandler);

fastify.register(createTrip);
fastify.register(getTrips);
fastify.register(getTripDetails);
fastify.register(confirmTrip);
fastify.register(updateTrip);

fastify.register(createActivity);
fastify.register(getActivities);

fastify.register(createLink);
fastify.register(getLinks);

fastify.register(getParticipants);
fastify.register(getParticipantDetails);
fastify.register(confirmParticipant);

fastify.register(createInvite);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.swagger();
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
