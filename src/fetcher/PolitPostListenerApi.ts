import { PolitContext } from './PolitContext';
import { Observable } from 'rxjs';
import { PolitPost } from '../models';

export class PolitPostListenerApi {
  context: PolitContext;

  constructor(context: PolitContext) {
    this.context = context;
  }

  async getFetchedUsers(service: string): Promise<string[]> {
    return this.context.database.query(
      'SELECT external_id FROM users WHERE service = $1 AND active = true',
      [service],
    ).then(result => result.rows.map(e => e.external_id));
  }

  async savePost(post: PolitPost) {
    this.context.database.query(
      `INSERT INTO posts (service, external_id, author, content,
        create_timestamp, embeds, deleted)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        post.author.service,
        post.id,
        post.author.external_id,
        post.content,
        post.createTimestamp,
        post.embeds,
        false,
      ],
    );
  }

  async savePostDeleteInfo(externalId: string, deleteTimestamp: number) {
    this.context.database.query(
      `UPDATE posts SET deleted = true, delete_timestamp = $1
        WHERE external_id = $2`,
      [deleteTimestamp, externalId],
    );
  }
}
