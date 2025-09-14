import type { Horse } from '@/types'
import { generateHorses } from '@/shared/lib/utils'

export interface GameStatesData {
  horses: Horse[]
}

interface ActionContext {
  commit: (mutation: string, payload?: unknown) => void
  state: GameStatesData
}

const gameStatesModule = {
  namespaced: true,

  state: (): GameStatesData => ({
    horses: [],
  }),

  mutations: {
    SET_HORSES(state: GameStatesData, horses: Horse[]) {
      state.horses = horses
    },
  },

  actions: {
    generateHorses({ commit }: ActionContext, count: number = 20) {
      const horses = generateHorses(count)
      commit('SET_HORSES', horses)
    },
  },

  getters: {
    allHorses: (state: GameStatesData) => state.horses,
  }
}

export default gameStatesModule
