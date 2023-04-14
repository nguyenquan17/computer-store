import { ModuleInterface } from '@/interface/module'
import inventoryRouters from './router'
import inventoryStores from './store'
const inventoryModule: ModuleInterface = {
  router: inventoryRouters,
  stores: inventoryStores
}

export default inventoryModule
