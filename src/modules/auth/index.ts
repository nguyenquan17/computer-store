import type { ModuleInterface } from '@/interfaces/module'
import authRouter from '@/modules/Auth/router'
const authModule: ModuleInterface = {
  router: authRouter
}

export default authModule
