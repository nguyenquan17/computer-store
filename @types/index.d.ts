import { RoleActions } from './../src/interface/role'
import Vue from 'vue'
type LIST_MODULE =
  | 'crowd-sale'
  | 'kyc'
  | 'customer'
  | 'balance'
  | 'request'
  | 'transaction'
  | 'exception'
  | 'setting'
  | 'fee'
  | 'NFT'
  | 'report'
  | 'request-nft'
  | 'member'
  | 'inventory'
  | 'transaction-nft'
  | 'fee-nft'
  | 'staking-setup'
  | 'staking-tvl'
  | 'commission'

// type a =
//   | 'FEE-NFT'
//   | 'BALANCE'
//   | 'CROWDSALE'
//   | 'CUSTOMER'
//   | 'EXCEPTION'
//   | 'FEE'
//   | 'KYC'
//   | 'INVENTORY'
//   | 'MEMBER'
//   | 'NFT'
//   | 'REPORT'
//   | 'REQUEST'
//   | 'REQUEST-NFT'
//   | 'TRANSACTION'
//   | 'TRANSACTION-NFT'

declare module 'vue/types/vue' {
  interface Vue {
    districtId: number
    checkPemission(module: LIST_MODULE, roles: Array<RoleActions>): boolean
  }
}
