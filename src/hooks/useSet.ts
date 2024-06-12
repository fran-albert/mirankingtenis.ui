import { create } from 'zustand';
import { Sets } from '@/modules/sets/domain/Sets';
import { Match } from '@/modules/match/domain/Match';
import { SetSummaryDto } from '@/common/types/set-summary.dto';
import { createApiSetsRepository } from '@/modules/sets/infra/ApiSetsRepository';

const setsRepository = createApiSetsRepository();

interface SetsState {
    sets: Sets[];
    setSummary: SetSummaryDto | undefined;
    loading: boolean;
    error: string | null;
    createSets: (match: Match) => Promise<void>;
    getTotalPlayerSetSummary: (playerId: number) => Promise<void>;
}

export const useSetsStore = create<SetsState>((set) => ({
    sets: [],
    setSummary: undefined,
    loading: false,
    error: null,

    createSets: async (match: Match) => {
        set({ loading: true, error: null });
        try {
            const createdSets = await setsRepository.createSets(match);
            set((state) => ({ sets: [...state.sets, ...(createdSets?.sets || [])], loading: false }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getTotalPlayerSetSummary: async (playerId: number) => {
        set({ loading: true, error: null });
        try {
            const summary = await setsRepository.getTotalPlayerSetSummary(playerId);
            set({ setSummary: summary, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
