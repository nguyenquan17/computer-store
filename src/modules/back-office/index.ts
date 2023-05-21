import type { ModuleInterface } from '@/interfaces/module'
import productManagementRouter from '@/modules/back-office/router'

const productManagementModule: ModuleInterface = {
  router: productManagementRouter
}
export default productManagementModule
