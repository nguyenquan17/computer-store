import { ModuleInterface } from '@/interface/module'
import metamartRouters from './router'
import MetamartStores from './store'
const MetamartModule: ModuleInterface = {
  router: metamartRouters,
  stores: MetamartStores
}

export default MetamartModule
