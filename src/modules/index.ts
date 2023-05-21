import type { ModuleInterface } from '@/interfaces/module'
import authModule from '@/modules/auth'
import productManagementModule from '@/modules/back-office'
import marketplaceModule from '@/modules/home-product'
import cartModule from '@/modules/cart'
import accountModule from '@/modules/account'

const listModule: Record<string, ModuleInterface> = {
  authModule,
  productManagementModule,
  marketplaceModule,
  cartModule,
  accountModule
}

export default listModule
