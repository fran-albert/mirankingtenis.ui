import { create } from 'zustand';
import { createApiTournamentRankingRepository } from '@/modules/tournament-ranking/infra/ApiTournamentRankingRepository';
import { TournamentRanking } from '@/modules/tournament-ranking/domain/TournamentRanking';
import { MatchSummaryDto } from '@/common/types/match-summary.dto';
import { HistoryRankingDto } from '@/common/types/history-ranking.dto';

const tournamentRankingRepository = createApiTournamentRankingRepository();

interface TournamentRankingState {
    ranking: TournamentRanking[];
    loading: boolean;
    error: string | null;
    playerMatchSummary: MatchSummaryDto | undefined;
    historyRanking: HistoryRankingDto[];
    getAllRankingsByTournamentCategory: (idTournament: number, idCategory: number) => Promise<void>;
    getTotalPlayerMatchSummary: (idPlayer: number) => Promise<void>;
    getTotalPlayerTournamentMatchSummary: (idPlayer: number, idTournament: number, idCategory: number) => Promise<void>;
    getHistoryRanking: (idPlayer: number, idTournament: number, idCategory: number) => Promise<void>;
}

export const useTournamentRankingStore = create<TournamentRankingState>((set) => ({
    ranking: [],
    playerMatchSummary: undefined,
    loading: false,
    historyRanking: [],
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
    },

    getTotalPlayerTournamentMatchSummary: async (idPlayer: number, idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const playerMatchSummary = await tournamentRankingRepository.getTotalPlayerTournamentMatchSummary(idPlayer, idTournament, idCategory);
            set({ playerMatchSummary, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getHistoryRanking: async (idPlayer: number, idTournamet: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const historyRanking = await tournamentRankingRepository.getHistoryRanking(idPlayer, idTournamet, idCategory);
            set({ historyRanking, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
