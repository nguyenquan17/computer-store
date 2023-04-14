import { ModuleInterface } from '@/interface/module'
import StakingRoute from './router'
import stakingStores from './store'
const stakingModule: ModuleInterface = {
  router: StakingRoute,
  stores: stakingStores
}

export default stakingModule
