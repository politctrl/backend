import {
  JsonController,
  Get,
  Param,
  QueryParam,
  Post as HttpPost,
  Authorized,
  Body,
} from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Account } from '../entities/Account';
import { AccountOwner } from '../entities/AccountOwner';

const ACCOUNTS_PER_PAGE = 15;

@JsonController()
export class AccountController {
  private accountRepository: Repository<Account>;
  private accountOwnerRepository: Repository<AccountOwner>;

  constructor() {
    const connection = getConnectionManager().get();
    this.accountRepository = connection.getRepository(Account);
    this.accountOwnerRepository = connection.getRepository(AccountOwner);
  }

  @Get('/accounts/all')
  getAll(@QueryParam('page') page: number = 0) {
    return this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .take(ACCOUNTS_PER_PAGE)
      .skip(page * ACCOUNTS_PER_PAGE)
      .getMany();
  }

  @Get('/accounts/service/:service')
  getAllByService(
    @Param('service') service: string,
    @QueryParam('page') page: number = 0,
    forService?: boolean) {

    const query = this.accountRepository
      .createQueryBuilder('account')
      .innerJoinAndSelect('account.owner', 'account_owner')
      .where('account.service = :service AND account.active = true', { service });
    // selecting all if method called by post listener service,
    // or paginating if called by http request
    if (!forService) {
      query
        .take(ACCOUNTS_PER_PAGE)
        .skip(page * ACCOUNTS_PER_PAGE);
    }
    return query.getMany();
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

  @Authorized()
  @HttpPost('/account/create')
  async createAccount(@Body() body: Account) {
    const owner = await this.accountOwnerRepository.findOne({ id: body.owner.id });
    if (!owner) {
      throw new Error('No account owner found');
    }
    const account = body;
    account.owner = owner;
    return this.accountRepository.insert(body);
  }
}
