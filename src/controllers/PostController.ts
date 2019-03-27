import { JsonController, Get, Param, QueryParam } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Post } from '../entities/Post';
import { Embed } from '../entities/Embed';

const POSTS_PER_PAGE = 15;

@JsonController()
export class PostController {
  private postRepository: Repository<Post>;
  private embedRepository: Repository<Embed>;

  constructor() {
    const connection = getConnectionManager().get();
    this.postRepository = connection.getRepository(Post);
    this.embedRepository = connection.getRepository(Embed);
  }

  @Get('/posts/deleted')
  getAll(@QueryParam('page') page: number = 0) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('post.deleted = true')
      .take(POSTS_PER_PAGE)
      .skip(page * POSTS_PER_PAGE)
      .orderBy('post.deleteTimestamp', 'DESC')
      .getMany();
  }

  @Get('/post/id/:id')
  getOne(@Param('id') id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('post.id = :id', { id })
      .getOne();
  }

  @Get('/post/service/:service/:externalId')
  getOneByExternalId(@Param('service') service: string, @Param('externalId') externalId: string) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('post.service = :service AND post.externalId = :externalId')
      .setParameters({ service, externalId })
      .getOne();
  }

  @Get('/posts/account/:id')
  getAllFromAccount(@Param('id') id: number, @QueryParam('page') page: number = 0) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('account.id = :id AND post.deleted = true')
      .take(POSTS_PER_PAGE)
      .skip(page * POSTS_PER_PAGE)
      .orderBy('post.deleteTimestamp', 'DESC')
      .setParameters({ id })
      .getMany();
  }

  @Get('/posts/account_owner/:id')
  getAllFromAccountOwner(@Param('id') id: number, @QueryParam('page') page: number = 0) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('account_owner.id = :id AND post.deleted = true')
      .take(POSTS_PER_PAGE)
      .skip(page * POSTS_PER_PAGE)
      .orderBy('post.deleteTimestamp', 'DESC')
      .setParameters({ id })
      .getMany();
  }
}
