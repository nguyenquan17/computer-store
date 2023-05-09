import type { ModuleInterface } from '@/interfaces/module'
import authModule from '@/modules/auth'
import customerModule from './customer'
import transactionModule from './transaction'
import balanceModule from '@/modules/balance'
import requestModule from '@/modules/request'
import feeModule from './fee'
import marketplaceModule from '@/modules/home-product'

const listModule: Record<string, ModuleInterface> = {
  authModule,
  customerModule,
  balanceModule,
  transactionModule,
  requestModule,
  feeModule,
  marketplaceModule
}

export default listModule
