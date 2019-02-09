import { JsonController, Get, Param } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';
import { Account } from '../../entities/Account';

@JsonController()
export class AccountController {
  private accountRepository: Repository<Account>;

  constructor() {
    this.accountRepository = getConnectionManager().get().getRepository(Account);
  }

  @Get('/accounts/all')
  getAll() {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .getMany();
  }

  @Get('/account/:id')
  getOne(@Param('id') id: number) {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .getOne();
  }
}
