import { Module } from 'vuex'
import bcKyc from './kyc'

const KycStores: Record<string, Module<any, any>> = {
  bcKyc
}

export default KycStores
