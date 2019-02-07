import { JsonController, Get, Param } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';
import { Post } from '../../entities/Post';

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
      .innerJoinAndSelect('post.author', 'user')
      .where('post.deleted = true')
      .orderBy('post.deleteTimestamp', 'DESC')
      .getMany();
  }

  @Get('/post/id/:id')
  getOne(@Param('id') id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'user')
      .where('post.id = :id')
      .setParameters({ id })
      .getOne();
  }

  @Get('/post/service/:service/:externalId')
  getOneByExternalId(@Param('service') service: string, @Param('externalId') externalId: string) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'user')
      .where('post.service = :service AND post.externalId = :externalId')
      .setParameters({ service, externalId })
      .getOne();
  }

  @Get('/posts/user/:id')
  getAllFromUser(@Param('id') id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'user')
      .where('post.author.id = :id AND post.deleted = true')
      .setParameters({ id })
      .getMany();
  }
}
