import { Module } from 'vuex'
import bcInventory from './inventory'

const inventoryStores: Record<string, Module<any, any>> = {
  bcInventory
}

export default inventoryStores
