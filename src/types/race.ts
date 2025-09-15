import type { Horse } from "./horse";

export type RaceProgram = {
  id: number;
  distance: number; // in meters
  horses: Horse[];
};

export type RaceResult = {
  programId: number;
  result: {
    horseId: number;
    position: number;
  }[];
}

export type LiveRaceResult = {
  programId: number;
  result: {
    horseId: number;
    position: number;
    isFinished: boolean;
  }[];
  isLive: boolean;
}
