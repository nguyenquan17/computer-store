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

export interface ICategory {
  id: number
  name: string
  description: string
  status: number
  createdAt: string
  updatedAt: string

  [x: string]: any
}

export interface IImage {
  image_link: string
}

export interface IProduct {
  brand: string
  categoryId: string | number | any
  discount: number
  imageList: IImage[]
  latestPrice: number
  productId: number
  productName: string
  retailPrice: number
  warranty: number
}

// export interface IProductDetail {
//   productId: number
//   categoryId: number
//   categoryName: string
//   productName: string
//   imageList: IImage[]
//   brand: string
//   retailPrice: number
//   latestPrice: number
//   discount: number
//   quantity: number
//   sold: number
//   status: number
//   featured: number
//   warranty: number
//   createdAt: string
//   color: null
//   sizeDescription: null
//   battery: null
//   weight: null
//   numberOfButtons: null
//   mouseType: null
//   mouseHandType: null
//   mouseConnectionType: null
//   cpuModel: null
//   cpuSeries: null
//   cpuSpeed: null
//   cpuSocket: null
//   cpuNumberOfProcessors: null
//   cpuNumberOfProcessingThreads: null
//   ramModel: null
//   ramSeries: null
//   ramBus: null
//   ramTiming: null
//   ramVoltage: null
//   ramCapacity: null
//   monitorModel: null
//   monitorSize: null
//   monitorResolution: null
//   monitorPanel: null
//   monitorType: null
//   monitorBrightness: null
//   monitorRefreshRate: null
//   monitorResponseTime: null
//   hardDiskModel: null
//   hardDiskSeries: null
//   hardDiskType: null
//   hardDiskCapacity: null
//   hardDiskConnectionType: null
//   hardDiskReadingSpeed: null
//   hardDiskWritingSpeed: null
//   vgaModel: null
//   keyboardModel: null
//   laptopStorage: null
//   laptopOperatingSystem: null
//   laptopSeries: null
//   laptopMaxNumberOfStoragePorts: null
//   laptopConnectionPort: null
//   laptopOutputPort: null
// }

export interface IUser {
  userId: number
  firstName: string
  lastName: string
  fullName: string
  displayName: string
  email: string
  login2faEnabled: number
  avatar: string
  userType: string
  phoneVerified: number
  emailVerified: number
  roles: string[]
  roundsUserCanBuy: number[]
  affiliationCode: string
}

export interface ITab {
  title: string
  value: string
}

export interface ISort {
  title: string
  value: string | number
}

export interface IQuery {
  page: number
  limit: number
  total: number

  [x: string]: any
}

export interface ICustomer {
  userId: number
  fullName: string
  email: string
  createdDate: string
  avatar: string
  referrerCode: string
  referrerName: string
  affiliationCode: string
  lastTimeLogin: string
  level: string
  birthday: string
  userStatus: string
  phoneVerified: string
  emailVerified: string
  walletAddress: string
  username: string
  twitterId: string
  twitter: string
  telegramId: string
  telegram: string
  discordId: string
  discord: string
  isVerified: string
  lastTransaction: string
}

export interface IBalance {
  availableBalance: number
  availableBalanceUSD: number
  availableTrading: number
  availableTradingUSD: number
  balance: number
  balanceUSD: number
  countryCode: string | number
  currency: string
  currencyName: string
  email: string
  emailVerified: number
  exchangeRate: number
  fullName: string
  id: number
  lastTimeLogin: string | number | any
  lastTransaction: string
  latestRate: number
  phone: string | number
  phoneVerified: number
  totalLockedAmount: number
  totalLockedAmountUSD: number
  userName: string
}

export interface ITransaction {
  id: number | any
  transactionCode: string | any
  transactionType: string | any
  refTransactionCode: string | any
  transactionDate: string | any
  transactionDay: string | any
  transactionMillisecond: string | any
  userId: number | any
  description: string | any
  status: string | any
  createdAt: string | any
  updatedAt: string | any
  amount: number | any
  amountDisplay: string | any
  amountToUsd: number | any
  tokenUsdExchangeRate: number | any
  fee: number | any
  feeCurrency: string | any
  feeRate: number | any
  fromAddress: string | any
  toAddress: string | any
  transactionAmount: number | any
  transactionAmountToUsd: number | any
  transactionFee: number | any
  transactionFeeToUsd: number | any
  currency: string | any
  username: string | any
  fullName: string | any
  email: string | any
  phone: string | any
  phoneCode: string
}

export interface IBalanceDetail {
  balance: number
  balanceDisplay: string
  createdAt: string
  createdBy: number
  creditAddress: string
  creditAmount: number
  creditAmountDisplay: string
  creditAmountToUsd: number
  creditCurrency: string
  creditFee: number
  creditNetwork: string
  creditUsdExchangeRate: number
  debitAddress: string
  debitAmount: number
  debitAmountDisplay: string
  debitAmountToUsd: number
  debitCurrency: string
  debitFee: number
  debitNetwork: string
  debitUsdExchangeRate: number
  description: string
  id: number
  locked: number
  lockedDisplay: string
  refTransactionCode: string
  status: string
  transactionCode: string
  transactionDate: string
  transactionDay: string
  transactionMillisecond: number
  transactionType: string
  updatedAt: string
  updatedBy: number
  userId: number
}

export interface ISummaryBalanceDetail {
  openBalance: string
  closeBalance: string
  totalCreditAmount: string
  totalDebitAmount: string
}

export interface IQueryBalanceDetail {
  currency?: string
  transactionType?: string
  userId?: number
  page?: number
  limit?: number
  search?: string
  orderBy: string | number
  total: number
  type?: string | null | undefined
}

export interface ISummaryRequest {
  transactionType: string
  feeCurrency?: number
  totalAmount: number
  totalAmountUsd: number
  totalFee?: number
  totalFeeUsd?: number
}

export interface ITransactionWithdraw {
  id: number | string
  transactionType: string
  transactionDate: string
  transactionDay: string
  transactionMillisecond: number
  currency: string
  currencyName: string
  network: string
  networkName: string
  userId: number
  fromAddress: string
  toAddress: string
  transactionHash: string | any
  amount: number
  amountDisplay: string
  transactionFee: number
  amountToUsd: number
  nonce: number
  description: string
  status: string
  accountTransactionId: number | any
  tokenUsdExchangeRate: number
  createdAt: string
  updatedAt: string | any
  rejectedAt: string | any
  rejectedReason: string | any
  isLimitAmount: number
  username: string
  fullName: string
  email: string
}

export interface IFee {
  id: number
  transactionType: string
  transactionDate: string
  transactionDay: string
  transactionMillisecond: number
  userId: number
  currency: string
  currencyName: string
  network: string
  networkName: string
  spenderAddress: string
  fromAddress: string
  toAddress: string
  transactionHash: string
  amount: number
  totalFee: number
  totalAmountUsd: number
  extraFee: number
  networkFee: number
  tokenUsdExchangeRate: number
  feeCurrency: string
  feeRate: number
  nonce: string
  gasLimit: number
  gasPrice: number
  gasPriceMax: string
  description: string
  status: string
  createdBy: string
  updatedBy: string
  fullName: string
  username: string
  email: string
  numOfRetry: number
  accountTransactionId: string
  completedAt: string
  processedAt: string
  approvedAt: string
  createdAt: string
  updatedAt: string
  rejectedAt: string
  rejectedReason: string
  amountDisplay: string
  amountToUsd: number
  transactionAmount: number
  transactionAmountToUsd: number
  totalFeeToUsd: number
  totalFeeDisplay: string
}
