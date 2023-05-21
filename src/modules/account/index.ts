import type { ModuleInterface } from '@/interfaces/module'
import accountRouter from '@/modules/account/router'

const accountModule: ModuleInterface = {
  router: accountRouter
}

export default accountModule