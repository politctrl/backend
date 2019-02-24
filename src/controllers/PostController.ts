import { JsonController, Get, Param } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';
import { Post } from '../entities/Post';

@JsonController()
export class PostController {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = getConnectionManager().get().getRepository(Post);
  }

  @Get('/posts/deleted')
  getAll() {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('post.deleted = true')
      .orderBy('post.deleteTimestamp', 'DESC')
      .getMany();
  }

  @Get('/post/id/:id')
  getOne(@Param('id') id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('post.id = :id', { id })
      .getOne();
  }

  @Get('/post/service/:service/:externalId')
  getOneByExternalId(@Param('service') service: string, @Param('externalId') externalId: string) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account', 'account_owner')
      .where('post.service = :service AND post.externalId = :externalId')
      .setParameters({ service, externalId })
      .getOne();
  }

  @Get('/posts/account/:id')
  getAllFromUser(@Param('id') id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('post.author.id = :id AND post.deleted = true')
      .setParameters({ id })
      .getMany();
  }

  // no route specified -> unavailable from web
  save(post: Post | Post[]) {
    return this.postRepository
      .createQueryBuilder()
      .insert()
      .into('post')
      .values(post)
      .execute();
  }

  // no route specified -> unavailable from web
  updateDeleteInfo(service: string, externalId: string, deleteTimestamp: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .update()
      .set({ deleteTimestamp })
      .where('post.service = :service AND post.externalId = :externalId')
      .setParameters({ service, externalId })
      .execute();
  }
}
