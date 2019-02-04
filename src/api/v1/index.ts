import { FastifyInstance } from 'fastify';
import db from '../../database';

export default async (fastify: FastifyInstance, opts, next: () => void) => {
  fastify.get('/deleted_posts', (request, reply) => {
    try {
      db.query(`SELECT * FROM post_archive
        INNER JOIN post_deletes ON (post_deletes.post_id = post_archive.post->'id_str')`)
      .then(dbres => reply.send(dbres.rows));
    } catch (e) {
      reply.code(500).send({
        data: null,
        error: {
          code: 500,
          message: 'Don\'t know why this happened? We too.',
        },
      });
    }
  });
  next();
};
