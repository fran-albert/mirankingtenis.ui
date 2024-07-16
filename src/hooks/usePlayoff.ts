import create from 'zustand';
import { createApiTournamentRepository } from '@/modules/tournament/infra/ApiTournamentRepository';
import { Tournament } from '@/modules/tournament/domain/Tournament';
import { getAllTournaments } from '@/modules/tournament/application/get-all-tournaments/getAllTournaments';
import { GetPlayerInfoDto } from '@/common/types/get-player-info.dto';
import { ResponsePlayOffDto } from '@/modules/playoff/domain/PlayOff';
import { createApiPlayOffRepository } from '@/modules/playoff/infra/ApiPlayOffRepository';
import { GroupFixtureDto } from '@/common/types/group-fixture.dto';

const playOffRepository = createApiPlayOffRepository();

interface PlayOffState {
    quarterFinals: GroupFixtureDto[];
    semiFinals: GroupFixtureDto[];
    finals: GroupFixtureDto[];
    loading: boolean;
    error: string | null;
    fetchQuarterFinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
    fetchSemiFinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
    fetchFinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
}


export const usePlayOffStore = create<PlayOffState>((set) => ({
    loading: false,
    quarterFinals: [],
    semiFinals: [],
    finals: [],
    error: null,

    fetchQuarterFinals: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const quarterFinals = await playOffRepository.getQuarterFinals(idTournament, idCategory);
            set({ quarterFinals, loading: false });
            return quarterFinals;
        } catch (error: any) {
            console.error("Error fetching tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },
    fetchSemiFinals: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const semiFinals = await playOffRepository.getSemifinals(idTournament, idCategory);
            set({ semiFinals, loading: false });
            return semiFinals;
        } catch (error: any) {
            console.error("Error fetching tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },
    fetchFinals: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const finals = await playOffRepository.getFinals(idTournament, idCategory);
            set({ finals, loading: false });
            return finals;
        } catch (error: any) {
            console.error("Error fetching tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },


}));
