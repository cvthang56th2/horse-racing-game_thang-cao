import type { Horse } from "./horse";

export type RaceProgram = {
  id: number;
  horses: Horse[];
};

export type RaceResult = {
  programId: number;
  result: {
    hourseId: number;
    position: number;
  }[];
}
