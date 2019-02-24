import { JsonController, Get, Param } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Account } from '../entities/Account';

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

  @Get('/accounts/service/:service')
  getAllByService(@Param('service') service: string) {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('service = :service AND active = true', { service })
      .getMany();
  }

  @Get('/account/:id')
  getOne(@Param('id') id: number) {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('account.id = :id')
      .setParameters({ id })
      .getOne();
  }

  @Get('/account/service/:service/:externalId')
  getOneByExternalId(@Param('service') service: string, @Param('externalId') externalId: string) {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('account.service = :service AND account.externalId = :externalId')
      .setParameters({ service, externalId })
      .getOne();
  }
}
