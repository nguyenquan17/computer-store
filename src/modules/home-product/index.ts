import type { ModuleInterface } from '@/interfaces/module'
import homeProductRouter from '@/modules/home-product/router'

const marketplaceModule: ModuleInterface = {
  router: homeProductRouter
}
export default marketplaceModule
