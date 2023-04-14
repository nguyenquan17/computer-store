import { ModuleInterface } from '@/interface/module'
import homeRouters from './router'
import KycStores from './store'
const homeModule: ModuleInterface = {
  router: homeRouters,
  stores: KycStores
}

export default homeModule
