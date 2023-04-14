import { Module } from 'vuex'
import transactionNft from './transactionNft'

const TransactionNftStores: Record<string, Module<any, any>> = {
  transactionNft
}

export default TransactionNftStores
