import type { ModuleInterface } from '@/interfaces/module'
import authModule from '@/modules/Auth'
import customerModule from './customer'
import transactionModule from './transaction'
import balanceModule from '@/modules/balance'
import requestModule from '@/modules/request'
import feeModule from './fee'
const listModule: Record<string, ModuleInterface> = {
  authModule,
  customerModule,
  balanceModule,
  transactionModule,
  requestModule,
  feeModule
}

export default listModule
