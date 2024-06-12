import { create } from 'zustand';
import { createCategoryForTournament } from '@/modules/tournament-category/application/create/createCategoryForTournament';
import { getCategoriesForTournament } from '@/modules/tournament-category/application/get-categories-for-tournament/getCategoriesForTournament';
import { TournamentCategory } from '@/modules/tournament-category/domain/TournamentCategory';
import { createApiTournamentCategoryRepository } from '@/modules/tournament-category/infra/ApiTournamentCategoryRepository';

const tournamentCategoryRepository = createApiTournamentCategoryRepository();

interface TournamentCategoryState {
    categories: TournamentCategory[];
    tournamentCategoryId: number;
    loading: boolean;
    error: string | null;
    getCategoriesForTournament: (idTournament: number) => Promise<void>;
    createCategoryForTournament: (idTournament: number, idCategory: number[]) => Promise<void>;
    getTournamentCategoryId: (idTournament: number, idCategory: number) => Promise<void>;

}

const loadAllCategoriesFn = getCategoriesForTournament(tournamentCategoryRepository);
const createCategoryForTournamentFn = createCategoryForTournament(tournamentCategoryRepository);
const getTournamentCategoryId = tournamentCategoryRepository.getTournamentCategoryId;

export const useTournamentCategoryStore = create<TournamentCategoryState>((set) => ({
    categories: [],
    loading: false,
    tournamentCategoryId: 0,
    error: null,

    getCategoriesForTournament: async (idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const categories = await loadAllCategoriesFn(idTournament);
            set({ categories, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createCategoryForTournament: async (idTournament: number, idCategory: number[]) => {
        set({ loading: true, error: null });
        try {
            const categories = await createCategoryForTournamentFn(idTournament, idCategory);
            set({ categories, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getTournamentCategoryId: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const tournamentCategoryId = await getTournamentCategoryId(idTournament, idCategory);
            set({ tournamentCategoryId, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
