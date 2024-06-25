import { create } from 'zustand';
import { Match } from '@/modules/match/domain/Match';
import { createApiMatchRepository } from '@/modules/match/infra/ApiMatchRepository';
import { GetPlayerInfoDto } from '@/common/types/get-player-info.dto';
import { NextMatchDto } from '@/common/types/next-match.dto';
import { GroupFixtureDto } from '@/common/types/group-fixture.dto';

const matchRepository = createApiMatchRepository();

interface MatchState {
    matches: Match[];
    groupFixture: GroupFixtureDto[];
    nextMatch: NextMatchDto | undefined;
    loading: boolean;
    error: string | null;
    getAllMatches: () => Promise<void>;
    getAllByDate: () => Promise<void>;
    getByCategoryAndMatchday: (idCategory: number, matchDay: number) => Promise<void>;
    getMatchesByUser: (idUser: number, idTournament: number, idCategory: number) => Promise<void>;
    getAllMatchesByUser: (idUser: number) => Promise<void>;
    findMatchesByGroupStage: (idGroupStage: number) => Promise<void>;
    deleteMatch: (id: number) => Promise<void>;
    decideMatch: (id: number, winnerUserId: number, tournamentCategoryId: number) => Promise<void>;
    getMatchesByTournamentCategoryAndMatchday: (idTournamentCategory: number, matchDay: number) => Promise<void>;
    getNextMatch: (idTournament: number, idUser: number) => Promise<void>;
}

export const useMatchStore = create<MatchState>((set) => ({
    matches: [],
    nextMatch: undefined,
    groupFixture: [],
    loading: false,
    error: null,

    getAllMatches: async () => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getAllMatches();
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getAllByDate: async () => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getAllByDate();
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getByCategoryAndMatchday: async (idCategory: number, matchDay: number) => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getByCategoryAndMatchday(idCategory, matchDay);
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getMatchesByUser: async (idUser: number, idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getMatchesByUser(idUser, idTournament, idCategory);
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getAllMatchesByUser: async (idUser: number) => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getAllMatchesByUser(idUser);
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    findMatchesByGroupStage: async (idGroupStage: number) => {
        set({ loading: true, error: null });
        try {
            const groupFixture = await matchRepository.findMatchesByGroupStage(idGroupStage);
            set({ groupFixture, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },


    deleteMatch: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await matchRepository.deleteMatch(id);
            set((state) => ({ matches: state.matches.filter(match => match.id !== id), loading: false }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    decideMatch: async (id: number, winnerUserId: number, tournamentCategoryId: number) => {
        set({ loading: true, error: null });
        try {
            await matchRepository.decideMatch(id, winnerUserId, tournamentCategoryId);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getMatchesByTournamentCategoryAndMatchday: async (idTournamentCategory: number, matchDay: number) => {
        set({ loading: true, error: null });
        try {
            const matches = await matchRepository.getMatchesByTournamentCategoryAndMatchday(idTournamentCategory, matchDay);
            set({ matches, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getNextMatch: async (idTournament: number, idUser: number) => {
        set({ loading: true, error: null });
        try {
            const nextMatch = await matchRepository.getNextMatch(idTournament, idUser);
            set({ nextMatch, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
