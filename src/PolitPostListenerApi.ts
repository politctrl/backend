import { PolitContext } from './PolitContext';
import { User } from './entities/User';
import { Post } from './entities/Post';

export class PolitPostListenerApi {
  context: PolitContext;

  constructor(context: PolitContext) {
    this.context = context;
  }

  async getFetchedUsers(service: string): Promise<User[]> {
    return this.context.connection
      .getRepository(User)
      .createQueryBuilder()
      .select()
      .where('service = :service AND active = true', { service })
      .getMany();
  }

  async savePost(post: Post) {
    this.context.connection
      .getRepository(Post)
      .createQueryBuilder()
      .insert()
      .into('post')
      .values(post)
      .execute();
  }

  async savePostDeleteInfo(externalId: string, deleteTimestamp: number) {
    this.context.connection
      .getRepository(Post)
      .createQueryBuilder()
      .update()
      .where('externalId = :externalId', { externalId })
      .set({
        deleteTimestamp,
        deleted: true,
      })
      .execute();
  }
}
