import { ModuleInterface } from '@/interface/module'
import commissionRoute from './router'
// import stakingStores from './store'
const commissionModule: ModuleInterface = {
  router: commissionRoute
  //   stores: stakingStores
}

export default commissionModule
