import type { ModuleInterface } from '@/interfaces/module'
import authRouter from '@/modules/auth/router'

const authModule: ModuleInterface = {
  router: authRouter
}

export default authModule
