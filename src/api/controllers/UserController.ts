import { JsonController, Get } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';
import { User } from '../../entities/User';

@JsonController()
export class UserController {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getConnectionManager().get().getRepository(User);
  }

  @Get('/users/all')
  getAll() {
    return this.userRepository.find({ active: true });
  }

  @Get('/users/:id')
  getOne(@EntityFromParam('id') user: User) {
    return user;
  }
}
