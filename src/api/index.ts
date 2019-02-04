import Fastify from 'fastify';

import v1Router from './v1';

const fastify = Fastify();

fastify.register(v1Router, { prefix: '/v1' });

fastify.listen(parseInt(process.env.HTTP_PORT || '2137', 10));
