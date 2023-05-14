import AuthRepository from './AuthRepository'
import ParamRepository from './ParamRepository'
import CustomerRepository from './CustomerRepository'
import TransactionRepository from './TransactionRepository'
import BalanceRepository from '@/services/BalanceRepository'
import RequestRepository from '@/services/RequestRepository'
import FeeRepository from '@/services/FeeRepository'
import ProductRepository from '@/services/ProductRepository'
import CategoryRepository from '@/services/CategoryRepository'
import EnumAttributeRepository from '@/services/EnumAttributeRepository'
import CartRepository from '@/services/CartRepository'

export const apiAuth: AuthRepository = new AuthRepository()
export const apiParam: ParamRepository = new ParamRepository()
export const apiCustomer: CustomerRepository = new CustomerRepository()
export const apiTransaction: TransactionRepository = new TransactionRepository()
export const apiBalance: BalanceRepository = new BalanceRepository()
export const apiRequest: RequestRepository = new RequestRepository()
export const apiFee: FeeRepository = new FeeRepository()
export const apiProduct: ProductRepository = new ProductRepository()
export const apiCategory: CategoryRepository = new CategoryRepository()
export const apiAttribute: EnumAttributeRepository = new EnumAttributeRepository()
export const apiCart: CartRepository = new CartRepository()
