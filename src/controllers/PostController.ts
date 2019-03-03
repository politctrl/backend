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
  getAllFromUser(@Param('id') id: number, @QueryParam('page') page: number = 0) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .leftJoinAndSelect('post.embeds', 'embeds')
      .where('account.id = :id AND post.deleted = true')
      .take(POSTS_PER_PAGE)
      .skip(page * POSTS_PER_PAGE)
      .setParameters({ id })
      .getMany();
  }

  // no route specified -> unavailable from web
  save(post: Post[]) {
    const embeds = post.map(e => e.embeds).flat();
    if (embeds) {
      this.embedRepository.save(embeds);
    }
    this.postRepository.save(post);
  }

  // no route specified -> unavailable from web
  async updateDeleteInfo(service: string, externalId: string, deleteTimestamp: number) {
    const post = await this.postRepository.findOne({ service, externalId });
    if (!post) {
      return;
    }
    post.deleted = true;
    post.deleteTimestamp = deleteTimestamp;
    this.postRepository.save(post);
  }
}
