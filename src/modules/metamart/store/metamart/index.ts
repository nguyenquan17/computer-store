import { ITabInfo, ITabSetting, IMetaTypes, ITabBlockchain, ITabInterest } from './../../interface/index'
import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
export interface IAuth {
  listReason: Array<Record<string, any>>
  initInfo: ITabInfo
  initBlockchain: ITabBlockchain
  initSetting: ITabSetting
  initInterRest: ITabInterest
  initMetaData: Record<string, any>
  listCollection: Array<Record<string, any>>
  listOriginCollection: Array<Record<string, any>>
  listCategory: Array<Record<string, any>>
  metaTypes: IMetaTypes[]
  metaDatas: Array<Record<string, any>>
  template: Record<string, any>
  isShowInterest: boolean
}

const state: IAuth = {
  listReason: [],
  initInfo: {
    itemName: '',
    avatar: '',
    avatarType: 'IMAGE',
    productCode: '',
    thumb: '',
    medias: [],
    collectionId: null,
    categoryId: null,
    shortDescription: '',
    description: ''
  },
  initBlockchain: {
    totalSupply: '',
    totalMint: '',
    contractAddress: '',
    tokenId: '',
    network: '',
    networkName: '',
    creatorName: '',
    creatorUsername: '',
    creatorId: 0
  },
  initMetaData: {
    description: ''
  },
  initSetting: {
    serviceFee: '',
    creatorFee: '',
    hotPosition: '',
    topPosition: '',
    isTop: 'NO',
    isHot: 'NO',
    isNftVoucher: 'NO'
  },
  listCollection: [],
  listOriginCollection: [],
  listCategory: [],
  metaTypes: [],
  metaDatas: [],
  template: {
    status: '',
    metaDatas: [],
    metaTypes: [
      {
        displayType: 'FIXED',
        metaType: 'INFO',
        metaTypeId: null,
        metaTypeName: 'NFT Info',
        metaTypePosition: 1,
        templateId: null
      }
    ],
    apiBody: { templateName: '', metaTypes: [] }
  },
  isShowInterest: false,
  initInterRest: {
    nftMinQuantity: '',
    nftInterestPrice: '',
    startDate: '',
    endDate: '',
    interestYear1: '',
    interestYear2: '',
    interestYear3: '',
    interestYear4: '',
    interestYear5: '',
    interestYear6: '',
    interestYear7: '',
    interestYear8: '',
    interestYear9: '',
    interestYear10: ''
  }
}

const bcNft: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

export default bcNft
