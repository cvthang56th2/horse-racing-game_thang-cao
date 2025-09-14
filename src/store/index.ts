import { createStore } from 'vuex'
import gameStatesModule from './modules/gameStates'

const store = createStore({
  modules: {
    gameStates: gameStatesModule
  }
})

export type StoreType = typeof store
export default store
