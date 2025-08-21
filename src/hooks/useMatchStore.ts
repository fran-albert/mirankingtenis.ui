import { create } from 'zustand';
import { Match } from "@/types/Match/Match";
import { GroupFixtureDto } from '@/common/types/group-fixture.dto';

// Store simplificado solo para el estado local (selectedMatch)
interface MatchState {
    selectedMatch: Match | GroupFixtureDto;
    selectMatch: (match: Match | GroupFixtureDto) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
    selectedMatch: {} as Match,
    selectMatch: (match: Match | GroupFixtureDto) => {
        set({ selectedMatch: match });
    },
}));