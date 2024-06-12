import { create } from 'zustand';
import { createApiTournamentRepository } from '@/modules/tournament/infra/ApiTournamentRepository';
import { Tournament } from '@/modules/tournament/domain/Tournament';
import { getTournament } from '@/modules/tournament/application/get/get';
import { createTournament } from '@/modules/tournament/application/create/createTournament';
import { startTournament } from '@/modules/tournament/application/start/start';
import { finishTournament } from '@/modules/tournament/application/finish/finish';
import { deleteTournament } from '@/modules/tournament/application/delete/delete';
import { getAllTournaments } from '@/modules/tournament/application/get-all-tournaments/getAllTournaments';
import { GetPlayerInfoDto } from '@/common/types/get-player-info.dto';

const tournamentRepository = createApiTournamentRepository();

interface TournamentState {
    tournaments: Tournament[];
    activeTournament: number;
    setTournaments: (tournaments: Tournament[]) => void;
    setActiveTournament: (activeTournament: number) => void;
    loading: boolean;
    error: string | null;
    getAllTournaments: () => Promise<void>;
    fetchAllDataForPlayer: (idUser: number) => Promise<void>;
    getPlayerInfo(idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto | null>;
    isCurrentTournament(idTournament: number): Promise<boolean>;
    getCurrentTournamentByPlayer(idPlayer: number): Promise<Tournament | undefined>;
    getCompletedTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
    getAllTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
    currentTournaments: Tournament | null;
    allTournaments: Tournament[];
    completedTournaments: Tournament[];
    playerInfo: GetPlayerInfoDto | null
    // startTournament: (idTournament: number) => Promise<void>;
    // finishTournament: (idTournament: number) => Promise<void>;
    // deleteTournament: (idTournament: number) => Promise<void>;
    // createTournament: (newTournament: Tournament) => Promise<void>;
}


const loadAllTournamentsFn = getAllTournaments(tournamentRepository);
const loadTournamentFn = getTournament(tournamentRepository);
const createTournamentFn = createTournament(tournamentRepository);
const startTournamentFn = startTournament(tournamentRepository);
const finishTournamentFn = finishTournament(tournamentRepository);
const deleteTournamentFn = deleteTournament(tournamentRepository);
const getPlayerInfoFn = tournamentRepository.getPlayerInfo;
const isCurrentTournamentFn = tournamentRepository.isCurrentTournament;
const getCurrentTournamentByPlayerFn = tournamentRepository.getCurrentTournamentByPlayer;
const getAllTournamentsByPlayerFn = tournamentRepository.getAllTournamentsByPlayer;
const getCompletedTournamentsByPlayerFn = tournamentRepository.getCompletedTournamentsByPlayer;


export const useTournamentStore = create<TournamentState>((set) => ({
    tournaments: [],
    loading: false,
    activeTournament: 1,
    setTournaments: (tournaments) => set(() => ({ tournaments })),
    setActiveTournament: (activeTournament) => set(() => ({ activeTournament })),
    currentTournaments: null,
    allTournaments: [],
    completedTournaments: [],
    playerInfo: null,
    error: null,


    fetchAllDataForPlayer: async (idUser: number) => {
        set({ loading: true, error: null });
        try {
            const currentTournamentsData = await tournamentRepository.getCurrentTournamentByPlayer(idUser);
            const allTournamentsData = await tournamentRepository.getAllTournamentsByPlayer(idUser);
            const completedTournamentsData = await tournamentRepository.getCompletedTournamentsByPlayer(idUser);

            let playerInfoData: GetPlayerInfoDto | null = null;
            if (currentTournamentsData) {
                const activeTournamentId = currentTournamentsData.id; 
                playerInfoData = await tournamentRepository.getPlayerInfo(activeTournamentId, idUser);
            }

            set({
                currentTournaments: currentTournamentsData,
                allTournaments: allTournamentsData,
                completedTournaments: completedTournamentsData,
                playerInfo: playerInfoData,
                loading: false
            });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },


    getAllTournaments: async () => {
        set({ loading: true, error: null });
        try {
            const tournaments = await loadAllTournamentsFn();
            set({ tournaments, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getPlayerInfo: async (idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto | null> => {
        set({ loading: true, error: null });
        try {
            const playerInfo = await getPlayerInfoFn(idTournament, idPlayer);
            set({ loading: false });
            return playerInfo;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return null;
        }
    },

    isCurrentTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const isCurrent = await isCurrentTournamentFn(idTournament);
            set({ loading: false });
            return isCurrent;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
        }
    },

    getCurrentTournamentByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await getCurrentTournamentByPlayerFn(idPlayer);
            set({ loading: false });
            return tournaments;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return;
        }
    },

    getCompletedTournamentsByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await getCompletedTournamentsByPlayerFn(idPlayer);
            set({ loading: false });
            return tournaments;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return [];
        }
    },

    getAllTournamentsByPlayer: async (idPlayer: number) => {
        set({ loading: true, error: null });
        try {
            const tournaments = await getAllTournamentsByPlayerFn(idPlayer);
            set({ loading: false });
            return tournaments;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return [];
        }
    },



}));
