import { Module } from 'vuex'
import memberKyc from './member'

const MemberStores: Record<string, Module<any, any>> = {
  memberKyc
}

export default MemberStores
