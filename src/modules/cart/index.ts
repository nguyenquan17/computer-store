import type { ModuleInterface } from '@/interfaces/module'
import cartRouter from '@/modules/cart/router'

const cartModule: ModuleInterface = {
  router: cartRouter
}
export default cartModule

