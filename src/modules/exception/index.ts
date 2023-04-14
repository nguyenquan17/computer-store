import { ModuleInterface } from '@/interface/module'
import exceptionRouters from './router'
import ExceptionStores from './store'
const exceptionModule: ModuleInterface = {
  router: exceptionRouters,
  stores: ExceptionStores
}

export default exceptionModule
