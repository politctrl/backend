import { JsonController, Get, QueryParam } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Group } from '../entities/Group';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';

const GROUPS_PER_PAGE = 15;

@JsonController()
export class GroupController {

  groupRepository: Repository<Group>;

  constructor() {
    this.groupRepository = getConnectionManager().get().getRepository(Group);
  }

  @Get('/groups/all')
  getAll(@QueryParam('page') page: number = 0) {
    return this.groupRepository
      .createQueryBuilder()
      .select()
      .take(GROUPS_PER_PAGE)
      .skip(page * GROUPS_PER_PAGE)
      .getMany();
  }

  @Get('/group/id/:id')
  getOne(@EntityFromParam('id') group: Group) {
    return group;
  }
}
