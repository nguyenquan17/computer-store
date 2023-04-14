import { Module } from 'vuex'
import beStaking from './staking'

const stakingStores: Record<string, Module<any, any>> = {
  beStaking
}

export default stakingStores
