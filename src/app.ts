import fastify from 'fastify';

import { checkInsRoutes } from './http/controllers/check-ins/routes';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';

import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() });
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
});
