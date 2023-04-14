import { Module } from 'vuex'
import beCommission from './commission'

const commissionStore: Record<string, Module<any, any>> = {
  beCommission
}

export default commissionStore
