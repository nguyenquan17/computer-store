import { UserRoleInterface } from '@/interface/role'
export type ROLE_TYPE = {
  SYSTEMADMIN: 'SYSTEMADMIN'
  SUPERADMIN: 'SUPERADMIN'
  ADMIN: 'ADMIN'
  SUPPORT: 'SUPPORT' //NV HỖ TRỢ
  MARKETING: 'MARKETING' //Quyền nhân viên marketing
  ACCOUNTANT: 'ACCOUNTANT' //Quyền kế toán
  BOOKING: 'BOOKING'
  SETUPNFT: 'SETUPNFT'
  MARKETPLACEADMIN: 'MARKETPLACEADMIN'
  NONE: 'NONE'
}
export const ROLE_CODE: ROLE_TYPE = {
  SYSTEMADMIN: 'SYSTEMADMIN',
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT',
  MARKETING: 'MARKETING',
  ACCOUNTANT: 'ACCOUNTANT',
  BOOKING: 'BOOKING',
  SETUPNFT: 'SETUPNFT',
  MARKETPLACEADMIN: 'MARKETPLACEADMIN',
  NONE: 'NONE'
}

export const ROLE_DEFINE: UserRoleInterface[] = [
  {
    userRole: ROLE_CODE.SYSTEMADMIN,
    roles: [
      {
        module: 'crowd-sale',
        roles: ['all']
      },
      {
        module: 'kyc',
        roles: ['all']
      },
      {
        module: 'customer',
        roles: ['all']
      },
      {
        module: 'balance',
        roles: ['all']
      },
      {
        module: 'request',
        roles: ['all']
      },
      {
        module: 'transaction',
        roles: ['all']
      },
      {
        module: 'exception',
        roles: ['all']
      },
      {
        module: 'member',
        roles: ['all']
      },

      {
        module: 'report',
        roles: ['all']
      },
      {
        module: 'fee',
        roles: ['all']
      },
      {
        module: 'NFT',
        roles: ['all']
      },
      {
        module: 'request-nft',
        roles: ['all']
      },
      {
        module: 'inventory',
        roles: ['all']
      },
      {
        module: 'transaction-nft',
        roles: ['all']
      },
      {
        module: 'fee-nft',
        roles: ['all']
      },
      {
        module: 'staking-tvl',
        roles: ['all']
      },
      {
        module: 'staking-setup',
        roles: ['all']
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  },
  {
    userRole: ROLE_CODE.SUPERADMIN,
    roles: [
      {
        module: 'crowd-sale',
        roles: ['all']
      },
      {
        module: 'kyc',
        roles: ['all']
      },
      {
        module: 'customer',
        roles: ['all']
      },
      {
        module: 'balance',
        roles: ['all']
      },
      {
        module: 'request',
        roles: ['all']
      },
      {
        module: 'transaction',
        roles: ['view', 'add-deposit']
      },
      {
        module: 'exception',
        roles: ['all']
      },
      {
        module: 'member',
        roles: ['all']
      },
      {
        module: 'report',
        roles: ['all']
      },

      {
        module: 'fee',
        roles: ['all']
      },
      {
        module: 'NFT',
        roles: ['all']
      },
      {
        module: 'request-nft',
        roles: ['all']
      },
      {
        module: 'inventory',
        roles: ['all']
      },
      {
        module: 'transaction-nft',
        roles: ['all']
      },
      {
        module: 'fee-nft',
        roles: ['all']
      },
      {
        module: 'staking-tvl',
        roles: ['all']
      },
      {
        module: 'staking-setup',
        roles: ['all']
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  },
  {
    userRole: ROLE_CODE.ADMIN,
    roles: [
      {
        module: 'crowd-sale',
        roles: ['view']
      },
      {
        module: 'kyc',
        roles: ['all']
      },
      {
        module: 'customer',
        roles: ['all']
      },
      {
        module: 'balance',
        roles: ['all']
      },
      {
        module: 'request',
        roles: ['all']
      },
      {
        module: 'transaction',
        roles: ['view']
      },
      {
        module: 'exception',
        roles: ['all']
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: ['all']
      },

      {
        module: 'fee',
        roles: ['all']
      },
      {
        module: 'NFT',
        roles: ['all']
      },
      {
        module: 'request-nft',
        roles: ['all']
      },
      {
        module: 'inventory',
        roles: ['all']
      },
      {
        module: 'transaction-nft',
        roles: ['all']
      },
      {
        module: 'fee-nft',
        roles: ['all']
      },
      {
        module: 'staking-tvl',
        roles: ['all']
      },
      {
        module: 'staking-setup',
        roles: ['all']
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  },
  {
    userRole: ROLE_CODE.SUPPORT,
    roles: [
      {
        module: 'crowd-sale',
        roles: []
      },
      {
        module: 'kyc',
        roles: ['view']
      },
      {
        module: 'customer',
        roles: ['view', 'view-kyc-customer-detail', 'view-detail-customer', 'view-detail-device']
      },
      {
        module: 'balance',
        roles: []
      },
      {
        module: 'request',
        roles: []
      },
      {
        module: 'transaction',
        roles: []
      },
      {
        module: 'exception',
        roles: []
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },

      {
        module: 'fee',
        roles: []
      },
      {
        module: 'NFT',
        roles: []
      },
      {
        module: 'request-nft',
        roles: []
      },
      {
        module: 'inventory',
        roles: []
      },
      {
        module: 'transaction-nft',
        roles: []
      },
      {
        module: 'fee-nft',
        roles: []
      },
      {
        module: 'staking-tvl',
        roles: []
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: []
      }
    ]
  },
  {
    userRole: ROLE_CODE.MARKETING,
    roles: [
      {
        module: 'crowd-sale',
        roles: []
      },
      {
        module: 'kyc',
        roles: []
      },
      {
        module: 'customer',
        roles: ['view', 'view-kyc-customer-detail']
      },
      {
        module: 'balance',
        roles: []
      },
      {
        module: 'request',
        roles: []
      },
      {
        module: 'transaction',
        roles: []
      },
      {
        module: 'exception',
        roles: []
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },

      {
        module: 'fee',
        roles: []
      },
      {
        module: 'NFT',
        roles: []
      },
      {
        module: 'request-nft',
        roles: []
      },
      {
        module: 'inventory',
        roles: []
      },
      {
        module: 'transaction-nft',
        roles: ['view']
      },
      {
        module: 'fee-nft',
        roles: []
      },
      {
        module: 'staking-tvl',
        roles: []
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  },
  {
    userRole: ROLE_CODE.ACCOUNTANT,
    roles: [
      {
        module: 'crowd-sale',
        roles: ['view', 'export']
      },
      {
        module: 'kyc',
        roles: []
      },
      {
        module: 'customer',
        roles: ['view', 'view-detail-customer']
      },
      {
        module: 'balance',
        roles: ['view']
      },
      {
        module: 'request',
        roles: ['view']
      },
      {
        module: 'transaction',
        roles: ['view', 'add-deposit']
      },
      {
        module: 'exception',
        roles: ['view']
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },
      {
        module: 'fee',
        roles: ['all']
      },
      {
        module: 'NFT',
        roles: ['view']
      },
      {
        module: 'request-nft',
        roles: []
      },
      {
        module: 'inventory',
        roles: ['view']
      },
      {
        module: 'transaction-nft',
        roles: ['all']
      },
      {
        module: 'fee-nft',
        roles: ['all']
      },
      {
        module: 'staking-tvl',
        roles: ['all']
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  },
  {
    userRole: ROLE_CODE.BOOKING,
    roles: [
      {
        module: 'crowd-sale',
        roles: []
      },
      {
        module: 'kyc',
        roles: []
      },
      {
        module: 'customer',
        roles: []
      },
      {
        module: 'balance',
        roles: []
      },
      {
        module: 'request',
        roles: []
      },
      {
        module: 'transaction',
        roles: []
      },
      {
        module: 'exception',
        roles: []
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },

      {
        module: 'fee',
        roles: []
      },

      {
        module: 'request-nft',
        roles: ['view']
      },
      {
        module: 'NFT',
        roles: ['view']
      },
      {
        module: 'inventory',
        roles: ['view']
      },
      {
        module: 'transaction-nft',
        roles: []
      },
      {
        module: 'fee-nft',
        roles: []
      },
      {
        module: 'staking-tvl',
        roles: []
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: []
      }
    ]
  },
  {
    userRole: ROLE_CODE.SETUPNFT,
    roles: [
      {
        module: 'crowd-sale',
        roles: []
      },
      {
        module: 'kyc',
        roles: []
      },
      {
        module: 'customer',
        roles: []
      },
      {
        module: 'balance',
        roles: []
      },
      {
        module: 'request',
        roles: []
      },
      {
        module: 'transaction',
        roles: []
      },
      {
        module: 'exception',
        roles: []
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },

      {
        module: 'fee',
        roles: []
      },
      {
        module: 'NFT',
        roles: ['view', 'all-action-nft']
      },
      {
        module: 'request-nft',
        roles: []
      },
      {
        module: 'inventory',
        roles: []
      },
      {
        module: 'transaction-nft',
        roles: []
      },
      {
        module: 'fee-nft',
        roles: []
      },
      {
        module: 'staking-tvl',
        roles: []
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: []
      }
    ]
  },
  {
    userRole: ROLE_CODE.MARKETPLACEADMIN,
    roles: [
      {
        module: 'crowd-sale',
        roles: []
      },
      {
        module: 'kyc',
        roles: []
      },
      {
        module: 'customer',
        roles: []
      },
      {
        module: 'balance',
        roles: []
      },
      {
        module: 'request',
        roles: []
      },
      {
        module: 'transaction',
        roles: []
      },
      {
        module: 'exception',
        roles: []
      },
      {
        module: 'member',
        roles: []
      },
      {
        module: 'report',
        roles: []
      },

      {
        module: 'fee',
        roles: []
      },
      {
        module: 'NFT',
        roles: ['all']
      },
      {
        module: 'request-nft',
        roles: ['all']
      },

      {
        module: 'inventory',
        roles: ['all']
      },
      {
        module: 'transaction-nft',
        roles: ['all']
      },
      {
        module: 'fee-nft',
        roles: ['all']
      },
      {
        module: 'staking-tvl',
        roles: []
      },
      {
        module: 'staking-setup',
        roles: []
      },
      {
        module: 'commission',
        roles: ['all']
      }
    ]
  }
]

export const MODULE_WITH_ROUTENAME: Record<string, any> = {
  'crowd-sale': { name: 'Crowdsale', params: {} },
  kyc: { name: 'Kyc', params: {} },
  customer: { name: 'CustomerMain', params: {} },
  balance: { name: 'Balance', params: {} },
  request: { name: 'Request', params: {} },
  'request-nft': { name: 'RequestNFT', params: { type: 'pending' } },
  NFT: { name: 'Nft', params: {} }
}

// export const MODULE_WITH_ROUTENAME = {
//   CROWDSALE: 'crowd-sale',
//   KYC: 'kyc',
//   CUSTOMER: 'customer',
//   balance: 'BALANCE',
//   REQUEST: 'request',
//   TRANSACTION: 'transaction',
//   EXCEPTION: 'exception',
//   MEMBER: 'member',
//   REPORT: 'report',
//   FEE: 'fee',
//   NFT: 'NFT',
//   'REQUEST-NFT': 'request-nft'
//   // 'fee-nft': 'NFT',
//   // inventory: 'NFT',
//   // 'transaction-nft': 'NFT'
// }
