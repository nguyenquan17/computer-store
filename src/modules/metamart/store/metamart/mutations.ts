import { ITabBlockchain, ITabInfo, ITabSetting, IMetaTypes, ITabInterest } from './../../interface/index'
import { cloneDeep, filter, forEach, map } from 'lodash'
import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_INIT_NFT: (state, data) => {
    state.initInfo = data
  },
  SET_INIT_METADATA: (state, { data, type }) => {
    state.initMetaData[type] = data
  },
  SET_LIST_COLLECTION: (state, data) => {
    state.listCollection = data
  },
  SET_LIST_ORIGIN_COLLECTION: (state, data) => {
    state.listOriginCollection = data
  },
  SET_LIST_CATEGORY: (state, data) => {
    state.listCategory = data
  },
  SET_INIT_FORM_BLOCKCHAIN: (state, collection: ITabBlockchain) => {
    state.initBlockchain = {
      totalSupply: '',
      totalMint: '',
      contractAddress: collection.contractAddress,
      tokenId: '',
      network: collection.network,
      networkName: collection.networkName,
      creatorName: collection.creatorName,
      creatorUsername: collection.creatorUsername,
      creatorId: collection.creatorId
    }
  },
  SET_LIST_META: (state, data) => {
    forEach(data.metaTypes, type => {
      const listData = filter(data.metaDatas, data => type.metaTypeId === data.metaTypeId)
      type.typeTab = listData.length ? listData[0].metaValueType : ''
    })
    const language = localStorage.getItem('bc-lang') || ''
    forEach(data.metaDatas, elm => {
      if (elm.metaValueType === 'TEXT' || elm.metaValueType === 'HTML') {
        const parseJson = JSON.parse(elm.metaValue)
        elm.metaValue = parseJson[language]
      }
    })

    state.isShowInterest = filter(data.metaTypes, elm => elm.metaType === 'POLICY').length ? true : false

    state.metaDatas = data.metaDatas
    state.metaTypes = filter(data.metaTypes, elm => elm.metaType !== 'INFO')
  },
  SET_LIST_METADATA: (state, data) => {
    state.metaDatas = data
  },

  SET_DETAIL_NFT: (
    state,
    data: {
      initInfo: ITabInfo
      initBlockchain: ITabBlockchain
      initSetting: ITabSetting
      metaTypes: Array<Record<string, any>>
      metaDatas: IMetaTypes[]
      initInterest: ITabInterest
    }
  ) => {
    const { initInfo, initBlockchain, initSetting, metaTypes, metaDatas, initInterest } = data

    state.initInfo = initInfo
    state.initBlockchain = initBlockchain
    state.initSetting = initSetting

    const listId = map(metaDatas, meta => meta.metaTypeId)
    const listIdType = map(metaTypes, meta => meta.metaTypeId)
    console.log(listId)
    console.log(listIdType)

    forEach(metaTypes, type => {
      const listData = filter(metaDatas, data => type.metaTypeId === data.metaTypeId)
      console.log('listData', listData)

      type.typeTab = listData.length ? listData[0].metaValueType : ''
    })

    const language = localStorage.getItem('bc-lang') || ''
    forEach(metaDatas, elm => {
      if (elm.metaValueType === 'TEXT' || elm.metaValueType === 'HTML') {
        const parseJson = JSON.parse(elm.metaValue)
        elm.metaValue = parseJson[language]
      }
    })

    state.metaDatas = metaDatas
    state.metaTypes = filter(metaTypes, elm => elm.metaType !== 'INFO') as IMetaTypes[]

    //interest

    if (initInterest) {
      state.initInterRest = {
        ...initInterest,
        startDate: new Date(initInterest.startDate).getTime(),
        endDate: new Date(initInterest.endDate).getTime()
      }
    }

    state.isShowInterest = filter(metaTypes, elm => elm.metaType === 'POLICY').length ? true : false
  },

  RESET_INIT: state => {
    state.initInfo = {
      collectionId: state.listCollection[0].id,
      itemName: '',
      avatar: '',
      avatarType: '',
      productCode: '',
      thumb: '',
      medias: [],
      categoryId: null,
      shortDescription: '',
      description: ''
    }
    state.initBlockchain = {
      totalSupply: '',
      totalMint: '',
      contractAddress: '',
      tokenId: '',
      network: '',
      networkName: '',
      creatorName: '',
      creatorUsername: '',
      creatorId: 0
    }
    state.initSetting = {
      serviceFee: '',
      creatorFee: '',
      hotPosition: '',
      topPosition: '',
      isTop: 'NO',
      isHot: 'NO',
      isNftVoucher: 'NO'
    }
    state.initInterRest = {
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
  },
  STORE_TEMPLATE: (state, payload: Record<string, any>) => {
    const lang = window.localStorage.getItem('bc-lang') || ''
    state.template.metaDatas = payload.metaDatas.map((metaData: Record<string, any>, index: number): Record<string, any> => {
      if (metaData.metaValueType === 'HTML' || metaData.metaValueType === 'TEXT') {
        const values = JSON.parse(metaData.metaValue)
        return {
          ...metaData,
          metaValue: values[lang],
          id: index
        }
      } else {
        return {
          ...metaData,
          id: index
        }
      }
    })
    state.template.metaTypes = payload.metaTypes.map((metaType: Record<string, any>): Record<string, any> => {
      const names = JSON.parse(metaType.metaTypeName)
      return {
        ...metaType,
        metaTypeName: names[lang]
      }
    })
  },
  MUTATE_META_TYPES: (state, payload: Array<Record<string, any>>): void => {
    state.template.metaTypes = payload.map((metaType: Record<string, any>): Record<string, any> => metaType)
  },
  CHANGE_TYPE_NAME: (state, payload: { type: string; value: string }): void => {
    const active = state.template.metaTypes.find((metaType: Record<string, any>): boolean => {
      return metaType.metaType === payload.type
    })
    if (active) {
      active.metaTypeName = payload.value
    }
  },
  CHANGE_TEMPLATE_NAME: (state, templateName: string): void => {
    state.template.apiBody.templateName = templateName
  },
  LOG_STATUS: (state, status: string) => {
    state.template.status = status
  },
  BUILD_BODY: state => {
    if (state.template.status === 'EDIT' || state.template.status === 'DUPLICATE') {
      const data: Array<Record<string, any>> = state.template.metaTypes.map((item: Record<string, any>): Record<string, any> => {
        return {
          metaTypePosition: item.metaTypePosition,
          metaType: item.metaType,
          metaName: item.metaTypeName,
          metaDatas: []
        }
      })
      data.forEach((item: Record<string, any>): void => {
        state.template.metaDatas.forEach((metaData: Record<string, any>): void => {
          if (metaData.metaType === item.metaType) {
            const { metaName, metaValueType, metaIcon, metaValue, metaStaticValue, metaAnnotation, metaMinimum, metaMaximum, metaDescription } = metaData
            item.metaDatas.push({
              metaName,
              metaValueType,
              metaIcon,
              metaValue,
              metaStaticValue,
              metaAnnotation,
              metaMinimum,
              metaMaximum,
              metaDescription
            })
          }
        })
      })
      data.sort((a: Record<string, any>, b: Record<string, any>) => {
        return a.metaTypePosition - b.metaTypePosition
      })
      state.template.apiBody.metaTypes = data
    } else if (state.template.status === 'NEW') {
      const data: Array<Record<string, any>> = state.template.apiBody.metaTypes.filter((type: Record<string, any>): boolean => {
        return state.template.metaTypes.some((item: Record<string, any>): boolean => {
          return item.metaType === type.metaType
        })
      })
      data.forEach((type: Record<string, any>): void => {
        state.template.metaTypes.forEach((item: Record<string, any>): void => {
          if (type.metaType === item.metaType) {
            type.metaTypePosition = item.metaTypePosition
            type.metaName = item.metaTypeName
          }
        })
      })
      data.sort((a: Record<string, any>, b: Record<string, any>) => {
        return a.metaTypePosition - b.metaTypePosition
      })
      state.template.apiBody.metaTypes = data
    }
  },
  CHANGE_META_DATA: (state, payload: Record<string, any>) => {
    const newMetaType = payload.metaType
    const checker = state.template.apiBody.metaTypes.some((metaType: Record<string, any>): boolean => {
      return metaType.metaType === newMetaType
    })
    if (!checker) {
      const position = state.template.apiBody.metaTypes.length
      state.template.apiBody.metaTypes.push({
        ...payload,
        metaTypePosition: position + 1
      })
    } else {
      state.template.apiBody.metaTypes = state.template.apiBody.metaTypes.map((metaType: Record<string, any>, position: number): Record<string, any> => {
        if (metaType.metaType === newMetaType) {
          return { ...payload, metaTypePosition: position + 1 }
        } else {
          return { ...metaType, metaTypePosition: position + 1 }
        }
      })
    }
  },
  ADD_TABS: (state, payload: Record<string, any>) => {
    state.template.metaTypes.push(payload)
  },
  CHANGE_DATAS: (state, payload: Record<string, any>) => {
    const checker = state.template.metaDatas.some((metaData: Record<string, any>): boolean => {
      return metaData.id === payload.data.id
    })
    if (!checker) {
      state.template.metaDatas.push({
        ...payload.data
      })
    } else {
      if (payload.action === 'EDIT') {
        state.template.metaDatas = state.template.metaDatas.map((item: Record<string, any>): Record<string, any> => {
          if (item.id === payload.data.id) {
            return payload.data
          } else {
            return item
          }
        })
      } else if (payload.action === 'DELETE') {
        state.template.metaDatas = state.template.metaDatas.filter((item: Record<string, any>): boolean => {
          return item.id !== payload.data.id
        })
      }
    }
  },
  RESET_TEMPLATE: state => {
    state.template = {
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
    }
  }
}
export default mutations
