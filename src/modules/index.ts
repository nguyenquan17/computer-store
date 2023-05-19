import type { ModuleInterface } from '@/interfaces/module'
import authModule from '@/modules/auth'
import requestModule from '@/modules/request'
import marketplaceModule from '@/modules/home-product'
import cartModule from '@/modules/cart'

const listModule: Record<string, ModuleInterface> = {
  authModule,
  requestModule,
  marketplaceModule,
  cartModule
}

export default listModule
