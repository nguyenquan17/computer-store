import type { ModuleInterface } from '@/interfaces/module'
import transactionRouter from './router'
const transactionModule: ModuleInterface = {
  router: transactionRouter
}

export default transactionModule
