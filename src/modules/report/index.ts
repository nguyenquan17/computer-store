import { ModuleInterface } from '@/interface/module'
import reportRouters from './router'
import MemberStores from './store'
const ReportModule: ModuleInterface = {
  router: reportRouters,
  stores: MemberStores
}

export default ReportModule
