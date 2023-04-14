import AuthRepository from './AuthRepository'
import ParamRepository from './ParamRepository'
import CustomerRepository from './CustomerRepository'
import TransactionRepository from './TransactionRepository'
import BalanceRepository from '@/services/BalanceRepository'
import RequestRepository from '@/services/RequestRepository'
import FeeRepository from '@/services/FeeRepository'

export const apiAuth: AuthRepository = new AuthRepository()
export const apiParam: ParamRepository = new ParamRepository()
export const apiCustomer: CustomerRepository = new CustomerRepository()
export const apiTransaction: TransactionRepository = new TransactionRepository()
export const apiBalance: BalanceRepository = new BalanceRepository()
export const apiRequest: RequestRepository = new RequestRepository()
export const apiFee: FeeRepository = new FeeRepository()
