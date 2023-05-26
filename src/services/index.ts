import AuthRepository from './AuthRepository'
import ParamRepository from './ParamRepository'
import ProductRepository from '@/services/ProductRepository'
import CategoryRepository from '@/services/CategoryRepository'
import EnumAttributeRepository from '@/services/EnumAttributeRepository'
import CartRepository from '@/services/CartRepository'
import OrderRepository from '@/services/OrderRepository'

export const apiAuth: AuthRepository = new AuthRepository()
export const apiParam: ParamRepository = new ParamRepository()
export const apiProduct: ProductRepository = new ProductRepository()
export const apiCategory: CategoryRepository = new CategoryRepository()
export const apiAttribute: EnumAttributeRepository = new EnumAttributeRepository()
export const apiCart: CartRepository = new CartRepository()
export const apiOrder: OrderRepository = new OrderRepository()
