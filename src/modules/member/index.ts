import { ModuleInterface } from '@/interface/module'
import memberRouters from './router'
import MemberStores from './store'
const MemberModule: ModuleInterface = {
  router: memberRouters,
  stores: MemberStores
}

export default MemberModule
