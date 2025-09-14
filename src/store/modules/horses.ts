import type { Horse } from '@/types'
import { generateHorses } from '@/shared/lib/utils'

export interface HorsesState {
  horses: Horse[]
  isRacing: boolean
}

interface ActionContext {
  commit: (mutation: string, payload?: unknown) => void
  state: HorsesState
}

const horsesModule = {
  namespaced: true,

  state: (): HorsesState => ({
    horses: [],
    isRacing: false,
  }),

  mutations: {
    SET_HORSES(state: HorsesState, horses: Horse[]) {
      state.horses = horses
    },

    UPDATE_HORSE_POSITION(state: HorsesState, { id, position }: { id: number; position: number }) {
      const horse = state.horses.find((h: Horse) => h.id === id)
      if (horse) {
        horse.position = position
      }
    },

    SET_RACING_STATUS(state: HorsesState, isRacing: boolean) {
      state.isRacing = isRacing
    },

    RESET_RACE(state: HorsesState) {
      state.horses.forEach((horse: Horse) => {
        horse.position = 0
      })
      state.isRacing = false
    }
  },

  actions: {
    generateHorses({ commit }: ActionContext, count: number = 20) {
      const horses = generateHorses(count)
      commit('SET_HORSES', horses)
    },

    updateHorsePosition({ commit }: ActionContext, payload: { id: number; position: number }) {
      commit('UPDATE_HORSE_POSITION', payload)
    },

    startRace({ commit }: ActionContext) {
      commit('SET_RACING_STATUS', true)
    },

    stopRace({ commit }: ActionContext) {
      commit('SET_RACING_STATUS', false)
    },

    resetRace({ commit }: ActionContext) {
      commit('RESET_RACE')
    }
  },

  getters: {
    allHorses: (state: HorsesState) => state.horses,
    isRacing: (state: HorsesState) => state.isRacing,
    horseCount: (state: HorsesState) => state.horses.length,
    leader: (state: HorsesState) => {
      return state.horses.reduce((leader: Horse, horse: Horse) =>
        horse.position > leader.position ? horse : leader
        , state.horses[0] || null)
    }
  }
}

export default horsesModule
