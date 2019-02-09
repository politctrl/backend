import { PolitContext } from './PolitContext';
import { Account } from './entities/Account';
import { Post } from './entities/Post';

export class PolitPostListenerApi {
  context: PolitContext;

  constructor(context: PolitContext) {
    this.context = context;
  }

  async getFetchedAccounts(service: string): Promise<Account[]> {
    return this.context.connection
      .getRepository(Account)
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
