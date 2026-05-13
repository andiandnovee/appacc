import { create } from 'zustand';
import { Stage } from '../types';

interface StageState {
  selectedStage: Stage | null;
  setSelectedStage: (stage: Stage) => void;
  clearStage: () => void;
}

const useStageStore = create<StageState>((set) => ({
  selectedStage: null,
  setSelectedStage: (stage) => set({ selectedStage: stage }),
  clearStage: () => set({ selectedStage: null }),
}));

export default useStageStore;