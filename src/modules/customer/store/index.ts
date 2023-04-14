import { Module } from 'vuex'
import customerKyc from './customer'

const CustomerStores: Record<string, Module<any, any>> = {
  customerKyc
}

export default CustomerStores
