import { ROLE_TYPE } from '@/configs/role/index'
export type RoleActions =
  | 'view'
  | 'edit'
  | 'remove'
  | 'all'
  | 'view-detail-device'
  | 'view-kyc-customer-detail'
  | 'view-detail-customer'
  | 'add-deposit'
  | 'export'
  | 'add-transfer'
  | 'add-crowdsale'
  | 'action-inventory'
  | 'all-action-nft'
  | 'setup-interest'
  | 'view-all-transaction-nft'

//view-kyc-customer-detail: quyền xem tab kyc trong popup detail customer
//view-detail-customer: quyền xem chi tiết customer
//view-detail-device: quyền xem tab device
//export : quyền export excel
// add-transfer: quyền transfer module transaction
// add-deposit: quyền deposit module transaction
// add-crowdsale: quyền buy crowdsale module transaction
// action-inventory: quyền lock / burn ... chi tiết inventory
// all-action-nft: quyền add / edit / delete nft
// setup-interest: quyền setup trả lãi
// view-all-transaction-nft:  xem tất cả tab trong NFT Transaction

export type UserRoles = ROLE_TYPE[keyof ROLE_TYPE]

export interface RoleInterface {
  module: string
  roles: RoleActions[]
}

export interface UserRoleInterface {
  userRole: UserRoles
  roles: RoleInterface[]
}

export interface UserRoleStoreInterface {
  userRole: UserRoles[]
  roles: RoleInterface[]
}
