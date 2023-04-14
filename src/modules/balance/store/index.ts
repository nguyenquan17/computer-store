import { Module } from 'vuex'
import bcBalance from './balance'

const BalanceStores: Record<string, Module<any, any>> = {
  bcBalance
}

export default BalanceStores
