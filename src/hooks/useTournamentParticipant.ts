import { create } from 'zustand';
import { createParticipantsForTournament } from '@/modules/tournament-participant/application/create-participants-for-tournament/create';
import { desactivatePlayer } from '@/modules/tournament-participant/application/desactivate-player/desactivatePlayer';
import { getParticipantsByTournamentCategory } from '@/modules/tournament-participant/application/get-players-by-tournament-category/getParticipantsByTournamentCategory';
import { getPlayersByTournament } from '@/modules/tournament-participant/application/get-players-by-tournament/getPlayersByTournament';
import { TournamentParticipant } from '@/modules/tournament-participant/domain/TournamentParticipant';
import { createApiTournamentParticipantRepository } from '@/modules/tournament-participant/infra/ApiTournamentRepository';

const tournamentParticipantRepository = createApiTournamentParticipantRepository();

interface TournamentParticipantState {
    tournamentParticipants: TournamentParticipant[];
    loading: boolean;
    error: string | null;
    create: (idTournament: number, idCategory: number, userIds: number[], positionInitials: number[]) => Promise<TournamentParticipant[]>;
    getPlayersByTournament: (idTournament: number) => Promise<TournamentParticipant[]>;
    desactivatePlayer: (idPlayer: number, tournamentId: number) => Promise<string>;
    getParticipantsByTournamentCategory: (idTournament: number, idCategory: number) => Promise<TournamentParticipant[]>;
}

const createTournamentFn = createParticipantsForTournament(tournamentParticipantRepository);
const desactivatePlayerFn = desactivatePlayer(tournamentParticipantRepository);
const getPlayersByTournamentFn = getPlayersByTournament(tournamentParticipantRepository);
const getParticipantsByTournamentCategoryFn = getParticipantsByTournamentCategory(tournamentParticipantRepository);

export const useTournamentParticipantStore = create<TournamentParticipantState>((set) => ({
    tournamentParticipants: [],
    loading: false,
    error: null,

    create: async (idTournament, idCategory, userIds, positionInitials) => {
        set({ loading: true, error: null });
        try {
            const tournamentParticipants = await createTournamentFn(idTournament, idCategory, userIds, positionInitials);
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
