import { Module } from 'vuex'
import crowdsaleBo from './crowdsale'

const CrowdsaleStores: Record<string, Module<any, any>> = {
  crowdsaleBo
}

export default CrowdsaleStores
