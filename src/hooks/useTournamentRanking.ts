import { create } from 'zustand';
import { createApiTournamentRankingRepository } from '@/modules/tournament-ranking/infra/ApiTournamentRankingRepository';
import { TournamentRanking } from '@/modules/tournament-ranking/domain/TournamentRanking';
import { MatchSummaryDto } from '@/common/types/match-summary.dto';

const tournamentRankingRepository = createApiTournamentRankingRepository();

interface TournamentRankingState {
    ranking: TournamentRanking[];
    loading: boolean;
    error: string | null;
    playerMatchSummary: MatchSummaryDto | undefined;
    getAllRankingsByTournamentCategory: (idTournament: number, idCategory: number) => Promise<void>;
    getTotalPlayerMatchSummary: (idPlayer: number) => Promise<void>;
}

export const useTournamentRankingStore = create<TournamentRankingState>((set) => ({
    ranking: [],
    playerMatchSummary: undefined,
    loading: false,
    error: null,

    getAllRankingsByTournamentCategory: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const ranking = await tournamentRankingRepository.getAllRankingsByTournamentCategory(idTournament, idCategory);
            set({ ranking, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getTotalPlayerMatchSummary: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const playerMatchSummary = await tournamentRankingRepository.getTotalPlayerMatchSummary(idPlayer);
            set({ playerMatchSummary, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
