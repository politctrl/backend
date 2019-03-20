import {
  JsonController,
  Authorized,
  Post as HttpPost,
  Body,
  Get,
  Param,
  QueryParam,
} from 'routing-controllers';
import { AccountOwner } from '../entities/AccountOwner';
import { getConnectionManager, Repository } from 'typeorm';

const ACCOUNT_OWNERS_PER_PAGE = 15;

@JsonController()
export class AccountOwnerController {
  accountOwnerRepository: Repository<AccountOwner>;

  constructor() {
    this.accountOwnerRepository = getConnectionManager().get().getRepository(AccountOwner);
  }

  @Get('/account_owners/all')
  getAccountOwners(@QueryParam('page') page: number) {
    return this.accountOwnerRepository
      .createQueryBuilder('account_owner')
      .innerJoinAndSelect('account_owner.accounts', 'accounts')
      .take(ACCOUNT_OWNERS_PER_PAGE)
      .skip(ACCOUNT_OWNERS_PER_PAGE * page)
      .getMany();
  }

  @Get('/account_owner/:id')
  getAccountOwnerById(@Param('id') id: number) {
    return this.accountOwnerRepository
      .createQueryBuilder('account_owner')
      .innerJoinAndSelect('account_owner.accounts', 'accounts')
      .where('account_owner.id = :id', { id })
      .getOne();
  }

  @Authorized()
  @HttpPost('/account_owner/create')
  createAccountOwner(@Body() body: AccountOwner) {
    return this.accountOwnerRepository.insert(body);
  }
}
