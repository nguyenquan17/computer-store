import type { ModuleInterface } from '@/interfaces/module'
import balanceRouter from '@/modules/balance/router'
const balanceModule: ModuleInterface = {
  router: balanceRouter
}
export default balanceModule
