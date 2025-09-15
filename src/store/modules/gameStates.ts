import type { Horse, RaceProgram, RaceResult, LiveRaceResult } from '@/types'
import { generateHorses, generateProgramName } from '@/utils'

export interface GameStatesData {
  horses: Horse[]
  programs: RaceProgram[]
  runningPrograms: Set<number>
  horsePositions: Record<string, number>;
  raceResults: Record<number, Array<{ horseId: number; position: number; finishTime: number }>>;
  raceIntervals: Record<number, number>;
  results: RaceResult[]
  liveResults: LiveRaceResult[]
  isRacing: boolean
  isPaused: boolean
}

interface ActionContext {
  commit: (mutation: string, payload?: unknown) => void
  dispatch: (action: string, payload?: unknown) => void
  state: GameStatesData
}

const gameStatesModule = {
  namespaced: true,

  state: (): GameStatesData => ({
    horses: generateHorses(20),
    programs: [],
    runningPrograms: new Set<number>(),
    horsePositions: {},
    raceResults: {},
    raceIntervals: {},
    results: [],
    liveResults: [],
    isRacing: false,
    isPaused: false,
  }),

  mutations: {
    SET_HORSES(state: GameStatesData, horses: Horse[]) {
      state.horses = horses
    },
    SET_PROGRAMS(state: GameStatesData, programs: RaceProgram[]) {
      state.programs = programs
    },
    ADD_RESULT(state: GameStatesData, result: RaceResult) {
      state.results.push(result)
    },
    REMOVE_RESULT(state: GameStatesData, programId: number) {
      state.results = state.results.filter(result => result.programId !== programId)
    },
    CLEAR_ALL_RESULTS(state: GameStatesData) {
      state.results = []
    },
    UPDATE_LIVE_RESULT(state: GameStatesData, liveResult: LiveRaceResult) {
      const existingIndex = state.liveResults.findIndex(r => r.programId === liveResult.programId)
      if (existingIndex >= 0) {
        state.liveResults[existingIndex] = liveResult
      } else {
        state.liveResults.push(liveResult)
      }
    },
    CLEAR_LIVE_RESULT(state: GameStatesData, programId: number) {
      state.liveResults = state.liveResults.filter(result => result.programId !== programId)
    },
    CLEAR_ALL_LIVE_RESULTS(state: GameStatesData) {
      state.liveResults = []
    },
    TOGGLE_RACING(state: GameStatesData) {
      state.isRacing = !state.isRacing
    },
    SET_RACING(state: GameStatesData, isRacing: boolean) {
      state.isRacing = isRacing
    },
    SET_PAUSED(state: GameStatesData, isPaused: boolean) {
      state.isPaused = isPaused
    },
    TOGGLE_PAUSE(state: GameStatesData) {
      state.isPaused = !state.isPaused
    },
  },

  actions: {
    regenerateHorses({ commit }: ActionContext, horseCount: number = 20) {
      const newHorses = generateHorses(horseCount)
      commit('SET_HORSES', newHorses)
    },
    generateProgram({ commit, state }: ActionContext, programCount: number = 6) {
      if (state.horses.length === 0) {
        return
      }

      const horsesPerProgram = 10
      const programs: RaceProgram[] = new Array(programCount).fill(0).map((_, index) => {
        const programHorses: Horse[] = [...state.horses].sort(() => 0.5 - Math.random()).slice(0, horsesPerProgram)

        return {
          id: index + 1,
          name: generateProgramName(index),
          distance: 1200 + index * 200, // Example distances: 1000m, 1200m, 1400m, etc.
          horses: programHorses
        }
      })

      commit('SET_PROGRAMS', programs)
    },
    startRace({ commit, state }: ActionContext, program: RaceProgram) {
      // Don't start if already running
      if (state.runningPrograms.has(program.id)) {
        return;
      }

      // Initialize horse positions for this program
      program.horses.forEach((horse: Horse) => {
        const key = `${program.id}-${horse.id}`;
        state.horsePositions[key] = 0;
      });

      // Add to running programs
      state.runningPrograms.add(program.id);
      commit('SET_RACING', true);

      // Create array to track horse progress and finish order
      const horseProgress: Array<{
        horse: Horse;
        position: number;
        speed: number;
        isFinished: boolean;
        finishTime?: number;
        condition: number;
      }> = program.horses.map(horse => ({
        horse,
        position: 0,
        condition: horse.condition,
        speed: Math.random() * 2 + 1, // Random speed between 1-3
        isFinished: false
      }));

      let raceTime = 0;
      const finishedHorses: Array<{ horseId: number; position: number; finishTime: number }> = [];

      // Start race interval
      const raceInterval = setInterval(() => {
        // Skip if paused
        if (state.isPaused) {
          return;
        }

        raceTime += 100; // Increment by 100ms
        let allFinished = true;

        horseProgress.forEach((horseData) => {
          if (!horseData.isFinished) {
            // Calculate horse speed based on condition (better condition = faster)
            // Add some randomness to make races interesting
            const distanceFactor = 1000 / program.distance;
            const baseSpeed = 1 + (horseData.condition / 100) * (2 * distanceFactor);
            const randomFactor = 0.5 + Math.random(); // 0.5-1.5 multiplier
            const speed = baseSpeed * randomFactor;

            // Update position
            horseData.position += speed;

            // Ensure position doesn't go negative or exceed 100%
            horseData.position = Math.max(0, Math.min(100, horseData.position));

            // Update position in state
            const key = `${program.id}-${horseData.horse.id}`;
            state.horsePositions[key] = horseData.position;

            // Check if horse finished (reached 95% to account for horse width)
            if (horseData.position >= 95 && !horseData.isFinished) {
              horseData.isFinished = true;
              horseData.finishTime = raceTime;
              finishedHorses.push({
                horseId: horseData.horse.id,
                position: finishedHorses.length + 1,
                finishTime: raceTime
              });
            }

            if (!horseData.isFinished) {
              allFinished = false;
            }
          }
        });

        // Update live results
        const liveResult: LiveRaceResult = {
          programId: program.id,
          result: horseProgress
            .map((horseData, index) => ({
              horseId: horseData.horse.id,
              position: horseData.isFinished
                ? finishedHorses.find(fh => fh.horseId === horseData.horse.id)?.position || index + 1
                : horseProgress.filter(h => h.position > horseData.position).length + 1,
              isFinished: horseData.isFinished
            }))
            .sort((a, b) => {
              // Sort by finish status first, then by position
              if (a.isFinished && !b.isFinished) return -1;
              if (!a.isFinished && b.isFinished) return 1;
              return a.position - b.position;
            }),
          isLive: true
        };

        commit('UPDATE_LIVE_RESULT', liveResult);

        // Check if race is complete
        if (allFinished || raceTime > 60000) { // Maximum 60 seconds per race
          clearInterval(raceInterval);
          delete state.raceIntervals[program.id];
          state.runningPrograms.delete(program.id);

          // If no more races running, set racing to false
          if (state.runningPrograms.size === 0) {
            commit('SET_RACING', false);
          }

          // Create final results
          const finalResult: RaceResult = {
            programId: program.id,
            result: finishedHorses.length > 0
              ? finishedHorses.map(fh => ({ horseId: fh.horseId, position: fh.position }))
              : horseProgress
                .sort((a, b) => b.position - a.position)
                .map((horseData, index) => ({
                  horseId: horseData.horse.id,
                  position: index + 1
                }))
          };

          // Store final results (with finishTime for state.raceResults)
          state.raceResults[program.id] = finishedHorses.length > 0
            ? finishedHorses.sort((a, b) => a.position - b.position)
            : horseProgress
              .sort((a, b) => b.position - a.position)
              .map((horseData, index) => ({
                horseId: horseData.horse.id,
                position: index + 1,
                finishTime: raceTime
              }));
          commit('ADD_RESULT', finalResult);

          // Clear live results for this program
          commit('CLEAR_LIVE_RESULT', program.id);
        }
      }, 100); // Update every 100ms

      // Store interval reference for cleanup
      state.raceIntervals[program.id] = raceInterval as unknown as number;
    },
    resetRace({ commit, state }: ActionContext, programId: number) {
      // Clear any running interval
      if (state.raceIntervals[programId]) {
        clearInterval(state.raceIntervals[programId]);
        delete state.raceIntervals[programId];
      }

      state.runningPrograms.delete(programId);

      // Check if all programs stopped racing
      if (state.runningPrograms.size === 0) {
        commit('SET_RACING', false);
      }

      // Reset positions for this program's horses
      const program = state.programs.find((p: RaceProgram) => p.id === programId);
      if (program) {
        program.horses.forEach((horse: Horse) => {
          const key = `${programId}-${horse.id}`;
          state.horsePositions[key] = 0;
        });
      }

      // Clear race results
      delete state.raceResults[programId];

      // Remove results from store
      commit('REMOVE_RESULT', programId);

      // Clear live results from store
      commit('CLEAR_LIVE_RESULT', programId);
    },
    startAllRaces({ dispatch, state }: ActionContext) {
      state.programs.forEach((program: RaceProgram) => {
        dispatch('startRace', program);
      });
    },
    resetAllRaces({ commit, dispatch, state }: ActionContext) {
      state.programs.forEach((program: RaceProgram) => {
        dispatch('resetRace', program.id);
      });

      // Clear all results from store
      commit('CLEAR_ALL_RESULTS');

      // Clear all live results from store
      commit('CLEAR_ALL_LIVE_RESULTS');

      // Reset pause state
      commit('SET_PAUSED', false);
    },
    togglePauseRaces({ commit }: ActionContext) {
      commit('TOGGLE_PAUSE');
    }
  },

  getters: {
    allHorses: (state: GameStatesData) => state.horses,
    allPrograms: (state: GameStatesData) => state.programs,
    allHorsePositions: (state: GameStatesData) => state.horsePositions,
    allRaceResults: (state: GameStatesData) => state.raceResults,
    allRunningPrograms: (state: GameStatesData) => state.runningPrograms,
    allResults: (state: GameStatesData) => state.results,
    allLiveResults: (state: GameStatesData) => state.liveResults,
    isRacing: (state: GameStatesData) => state.isRacing,
    isPaused: (state: GameStatesData) => state.isPaused,
    getProgramById: (state: GameStatesData) => (id: number) => state.programs.find(p => p.id === id),
  }
}

export default gameStatesModule
