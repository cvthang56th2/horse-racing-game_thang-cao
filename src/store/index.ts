import { createStore } from 'vuex'
import horsesModule, { type HorsesState } from './modules/horses'

export interface RootState {
  horses: HorsesState
}

const store = createStore({
  modules: {
    horses: horsesModule
  }
})

export type StoreType = typeof store
export default store
