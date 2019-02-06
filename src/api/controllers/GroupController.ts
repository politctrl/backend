import { JsonController, Get } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Group } from '../../entities/Group';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';

@JsonController()
export class GroupController {

  groupRepository: Repository<Group>;

  constructor() {
    this.groupRepository = getConnectionManager().get().getRepository(Group);
  }

  @Get('/groups/all')
  getAll() {
    return this.groupRepository.find();
  }

  @Get('/group/id/:id')
  getOne(@EntityFromParam('id') group: Group) {
    return group;
  }
}
