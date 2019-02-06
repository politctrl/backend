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
    return this.postRepository.find({ deleted: true });
  }

  @Get('/post/id/:id')
  getOne(@EntityFromParam('id') post: Post) {
    return post;
  }

  @Get('/post/service/:service/:externalId')
  getOneByExternalId(@Param('service') service: string, @Param('externalId') externalId: string) {
    return this.postRepository.findOne({ service, externalId });
  }

  @Get('/posts/user/:id')
  getAllFromUser(@Param('id') id: number) {
    return this.postRepository.find({ author: id, deleted: true });
  }
}
