import { ModuleInterface } from '@/interface/module'
import transactionNftRouters from './router'
import TransactionNftStores from '@/modules/transactionNft/store'
const transactionNftModule: ModuleInterface = {
  router: transactionNftRouters,
  stores: TransactionNftStores
}

export default transactionNftModule
