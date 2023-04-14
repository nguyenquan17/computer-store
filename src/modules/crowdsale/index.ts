import { ModuleInterface } from '@/interface/module'
import crowdsaleRoute from './router'
import CrowdsaleStores from './store'
const crowdsaleModule: ModuleInterface = {
  router: crowdsaleRoute,
  stores: CrowdsaleStores
}

export default crowdsaleModule
