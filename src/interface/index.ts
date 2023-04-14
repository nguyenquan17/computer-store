export interface IQuery {
  page: number
  limit?: number
  search?: string
  [x: string]: any
}

export interface PaginationInterface {
  status?: number | null
  total: number
  page: number
  limit: number
  [x: string]: any
}

// export interface IBodyApiVerifyCode {
//   email?: string | (string | null)[]
//   phone?: string | (string | null)[]
//   reason?: string | (string | null)[]
//   verificationCode: number | string
//   [x: string]: any
// }
export interface IBodyApiVerify {
  email?: string | (string | null)[]
  password?: string | (string | null)[]
  phone?: string | (string | null)[]
  reason?: string | (string | null)[]
  verificationCodeEmail?: string | number
  verificationCodeSms?: string | number
  verificationCodeGa?: string | number
  verificationCode?: string | number
  [x: string]: any
}

export interface IBodyApiLogin {
  email: string
  password: string
}

export interface IDetailRequestNft {
  id: number
  accountName: string
  accountUsername: string
  itemThumb: string
  itemName: string
  itemCode: string
  quantity: number
  note: string
  status: string
  phoneNumber: string
  categoryName: string
  description: string
  emailContent: string
}

export interface IAssetNetwork {
  chainId: number
  currency: string
  currencyName: string
  externalWalletAddress: string
  gasLimit: number
  gasLimitHex: string
  id: number
  network: string
  networkName: string
  platformDepositFee: number
  platformWithdrawFee: number
  spenderWalletAddress: string
  icon: string
  transferFee: number
  withdrawMin: number
  withdrawFee: number
  depositMin: number
  depositMinPercent: number
}

export interface IQueryStakingSetup {
  search?: string
  currency: string
  durationType: string
  startDuration: string
  endDuration: string
  startAPRPercent: string
  endAPRPercent: string
  interestType?: string
  orderBy?: string
  page?: number
  limit?: number
  total?: number
}

export interface IQueryStakingLvt {
  search?: string
  currency?: string
  transactionType?: string
  planId?: number | string
  durationType?: string
  fromDuration: string
  toDuration: string
  fromAPRPercent: string
  toAPRPercent: string
  interestType?: string
  fromTransactionDate?: string
  toTransactionDate?: string
  fromEndStakeDate?: string
  toEndStakeDate?: string
  orderBy?: string
  page?: number
  limit?: number
  total?: number
}

export interface IAssetToken {
  baseCurrency: string
  currency: string
  currencyName: string
  decimals: number
  iconUrl: string
  id: number
  network: string
  stableCurrency: string
  systemCurrency: boolean
  type: string
  rounding: number
}
