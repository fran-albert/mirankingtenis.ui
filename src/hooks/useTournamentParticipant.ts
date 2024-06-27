import { create } from 'zustand';
import { createParticipantsForTournament } from '@/modules/tournament-participant/application/create-participants-for-tournament/create';
import { desactivatePlayer } from '@/modules/tournament-participant/application/desactivate-player/desactivatePlayer';
import { getParticipantsByTournamentCategory } from '@/modules/tournament-participant/application/get-players-by-tournament-category/getParticipantsByTournamentCategory';
import { getPlayersByTournament } from '@/modules/tournament-participant/application/get-players-by-tournament/getPlayersByTournament';
import { TournamentParticipant } from '@/modules/tournament-participant/domain/TournamentParticipant';
import { createApiTournamentParticipantRepository } from '@/modules/tournament-participant/infra/ApiTournamentRepository';
import { NonParticipantsDto } from '@/common/types/non-participants.dto';

const tournamentParticipantRepository = createApiTournamentParticipantRepository();

interface TournamentParticipantState {
    tournamentParticipants: TournamentParticipant[];
    loading: boolean;
    error: string | null;
    nonParticipants: NonParticipantsDto[];
    hasPlayers: boolean;
    create: (idTournament: number, idCategory: number, userIds: number[], positionInitials: number[] | null, directToPlayoffsFlags: boolean[]) => Promise<string>;
    findNonParticipants: (idTournament: number) => Promise<NonParticipantsDto[]>;
    getPlayersByTournament: (idTournament: number) => Promise<TournamentParticipant[]>;
    hasPlayersForCategory: (idTournament: number, idCategory: number) => Promise<boolean>;
    desactivatePlayer: (idPlayer: number, tournamentId: number) => Promise<string>;
    getParticipantsByTournamentCategory: (idTournament: number, idCategory: number) => Promise<TournamentParticipant[]>;
}

const desactivatePlayerFn = desactivatePlayer(tournamentParticipantRepository);
const getPlayersByTournamentFn = getPlayersByTournament(tournamentParticipantRepository);
const getParticipantsByTournamentCategoryFn = getParticipantsByTournamentCategory(tournamentParticipantRepository);

export const useTournamentParticipantStore = create<TournamentParticipantState>((set) => ({
    tournamentParticipants: [],
    nonParticipants: [],
    hasPlayers: false,
    loading: false,
    error: null,

    create: async (idTournament, idCategory, userIds, positionInitials, directToPlayoffsFlags) => {
        set({ loading: true, error: null });
        try {
            const response = await tournamentParticipantRepository.createParticipantsForTournament(idTournament, idCategory, userIds, positionInitials, directToPlayoffsFlags);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return '';
        } finally {
            set({ loading: false });
        }
    },

    hasPlayersForCategory: async (idTournament, idCategory) => {
        set({ loading: true, error: null });
        try {
            const hasPlayers = await tournamentParticipantRepository.hasPlayersForCategory(idTournament, idCategory);
            set({ hasPlayers });
            return hasPlayers;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    findNonParticipants: async (idTournament) => {
        set({ loading: true, error: null });
        try {
            const nonParticipants = await tournamentParticipantRepository.findNonParticipants(idTournament);
            set({ nonParticipants });
            return nonParticipants;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return [];
        } finally {
            set({ loading: false });
        }
    },

    getPlayersByTournament: async (idTournament) => {
        set({ loading: true, error: null });
        try {
            const tournamentParticipants = await getPlayersByTournamentFn(idTournament);
            set({ tournamentParticipants });
            return tournamentParticipants;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return [];
        } finally {
            set({ loading: false });
        }
    },

    desactivatePlayer: async (idPlayer, tournamentId) => {
        set({ loading: true, error: null });
        try {
            const response = await desactivatePlayerFn(idPlayer, tournamentId);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return "";
        } finally {
            set({ loading: false });
        }
    },

    getParticipantsByTournamentCategory: async (idTournament, idCategory) => {
        set({ loading: true, error: null });
        try {
            const tournamentParticipants = await getParticipantsByTournamentCategoryFn(idTournament, idCategory);
            set({ tournamentParticipants });
            return tournamentParticipants;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            set({ error: errorMessage });
            return [];
        } finally {
            set({ loading: false });
        }
    },
}));
