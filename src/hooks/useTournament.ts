import create from 'zustand';
import { createApiTournamentRepository } from '@/modules/tournament/infra/ApiTournamentRepository';
import { Tournament } from '@/modules/tournament/domain/Tournament';
import { getAllTournaments } from '@/modules/tournament/application/get-all-tournaments/getAllTournaments';
import { GetPlayerInfoDto } from '@/common/types/get-player-info.dto';

const tournamentRepository = createApiTournamentRepository();

interface TournamentState {
    tournaments: Tournament[];
    tournament: Tournament | null;
    activeTournament: number;
    setTournaments: (tournaments: Tournament[]) => void;
    setActiveTournament: (activeTournament: number) => void;
    loading: boolean;
    error: string | null;
    getAllTournaments: () => Promise<void>;
    getTournament: (idTournament: number) => Promise<Tournament>
    fetchAllDataForPlayer: (idUser: number) => Promise<void>;
    getPlayerInfo(idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto>;
    isCurrentTournament(idTournament: number): Promise<boolean>;
    getCurrentTournamentByPlayer(idPlayer: number): Promise<Tournament | undefined>;
    getCompletedTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
    getAllTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
    startTournament: (idTournament: number) => Promise<any[]>;
    finishTournament: (idTournament: number) => Promise<any[]>;
    currentTournaments: Tournament | null;
    allTournaments: Tournament[];
    completedTournaments: Tournament[];
    playerInfo: GetPlayerInfoDto;
}

const loadAllTournamentsFn = getAllTournaments(tournamentRepository);

export const useTournamentStore = create<TournamentState>((set) => ({
    tournaments: [],
    tournament: null,
    loading: false,
    activeTournament: 1,
    setTournaments: (tournaments) => set(() => ({ tournaments })),
    setActiveTournament: (activeTournament) => set(() => ({ activeTournament })),
    currentTournaments: null,
    allTournaments: [],
    completedTournaments: [],
    playerInfo: {} as GetPlayerInfoDto,
    error: null,

    fetchAllDataForPlayer: async (idUser: number) => {
        set({ loading: true, error: null });
        try {
            const currentTournamentsData = await tournamentRepository.getCurrentTournamentByPlayer(idUser);
            const allTournamentsData = await tournamentRepository.getAllTournamentsByPlayer(idUser);
            // const completedTournamentsData = await tournamentRepository.getCompletedTournamentsByPlayer(idUser);

            let playerInfoData: GetPlayerInfoDto | null = null;
            if (currentTournamentsData) {
                const activeTournamentId = currentTournamentsData.id;
                playerInfoData = await tournamentRepository.getPlayerInfo(activeTournamentId, idUser);
            }

            set({
                currentTournaments: currentTournamentsData,
                allTournaments: allTournamentsData,
                // completedTournaments: completedTournamentsData || [] as Tournament[],
                playerInfo: playerInfoData || {} as GetPlayerInfoDto,
                loading: false
            });
        } catch (error: any) {
            console.error("Error fetching data for player:", error);
            set({ error: error.message, loading: false });
        }
    },

    getAllTournaments: async () => {
        set({ loading: true, error: null });
        try {
            const tournaments = await loadAllTournamentsFn();
            set({ tournaments, loading: false });
        } catch (error: any) {
            console.error("Error fetching all tournaments:", error);
            set({ error: error.message, loading: false });
        }
    },

    startTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const response = await tournamentRepository.startTournament(idTournament);
            const tournament = response as any;
            set((state) => ({
                tournaments: state.tournaments.map(t => t.id === idTournament ? tournament : t),
                loading: false
            }));
            return tournament;
        } catch (error: any) {
            console.error("Error starting tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    finishTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const response = await tournamentRepository.finishTournament(idTournament);
            const tournament = response as any;
            set((state) => ({
                tournaments: state.tournaments.map(t => t.id === idTournament ? tournament : t),
                loading: false
            }));
            return tournament;
        } catch (error: any) {
            console.error("Error finishing tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    getTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const tournament = await tournamentRepository.getTournament(idTournament);
            set({ tournament, loading: false });
            return tournament;
        } catch (error: any) {
            console.error("Error fetching tournament:", error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    getPlayerInfo: async (idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto> => {
        set({ loading: true, error: null });
        try {
            const playerInfo = await tournamentRepository.getPlayerInfo(idTournament, idPlayer);
            set({ loading: false });
            return playerInfo;
        } catch (error: any) {
            console.error("Error fetching player info:", error);
            set({ error: error.message, loading: false });
            return {} as GetPlayerInfoDto;
        }
    },

    isCurrentTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const isCurrent = await tournamentRepository.isCurrentTournament(idTournament);
            set({ loading: false });
            return isCurrent;
        } catch (error: any) {
            console.error("Error checking if current tournament:", error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    getCurrentTournamentByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await tournamentRepository.getCurrentTournamentByPlayer(idPlayer);
            set({ loading: false });
            return tournaments;
        } catch (error: any) {
            console.error("Error fetching current tournament by player:", error);
            set({ error: error.message, loading: false });
            return;
        }
    },

    getCompletedTournamentsByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await tournamentRepository.getCompletedTournamentsByPlayer(idPlayer);
            set({ completedTournaments: tournaments, loading: false });
            return tournaments;
        } catch (error: any) {
            console.error("Error fetching completed tournaments by player:", error);
            set({ error: error.message, loading: false });
            return [];
        }
    },

    getAllTournamentsByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await tournamentRepository.getAllTournamentsByPlayer(idPlayer);
            set({ allTournaments: tournaments, loading: false });
            return tournaments;
        } catch (error: any) {
            console.error("Error fetching all tournaments by player:", error);
            set({ error: error.message, loading: false });
            return [];
        }
    },
}));
