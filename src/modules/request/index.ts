import type { ModuleInterface } from '@/interfaces/module'
import requestRouter from '@/modules/request/router'
const requestModule: ModuleInterface = {
  router: requestRouter
}
export default requestModule
