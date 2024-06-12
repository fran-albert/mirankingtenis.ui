import { create } from 'zustand';
import { createApiFixtureRepository } from '@/modules/fixture/infra/ApiFixtureRepository';
import { createFixture } from '@/modules/fixture/application/create/createFixture';
import { getFixtureByCategory } from '@/modules/fixture/application/get-fixture-by-category/getFixtureByCategory';
import { getFixtureByCategoryAndTournament } from '@/modules/fixture/application/get-fixture-by-category-and-tournament/getFixtureByCategoryAndTournament';
import { Fixture } from '@/modules/fixture/domain/Fixture';

const fixtureRepository = createApiFixtureRepository();

interface FixtureState {
    fixture: Fixture[];
    loading: boolean;
    error: string | null;
    createFixture: (newFixture: Fixture) => Promise<void>;
    getFixtureByCategory: (idCategory: number) => Promise<void>;
    getFixtureByCategoryAndTournament: (idCategory: number, idTournament: number) => Promise<void>;
}

const createFixtureFn = createFixture(fixtureRepository);
const getFixtureByCategoryFn = getFixtureByCategory(fixtureRepository);
const getFixtureByCategoryAndTournamentFn = getFixtureByCategoryAndTournament(fixtureRepository);

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

export const useFixtureStore = create<FixtureState>((set) => ({
    fixture: [],
    loading: false,
    error: null,

    createFixture: async (newFixture: Fixture) => {
        set({ loading: true, error: null });
        try {
            await createFixtureFn(newFixture);
            set({ loading: false });
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
        }
    },

    getFixtureByCategory: async (idCategory: number) => {
        set({ loading: true, error: null });
        try {
            await getFixtureByCategoryFn(idCategory);
            set({ loading: false });
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
        }
    },

    getFixtureByCategoryAndTournament: async (idCategory: number, idTournament: number) => {
        set({ loading: true, error: null });
        try {
            await getFixtureByCategoryAndTournamentFn(idCategory, idTournament);
            set({ loading: false });
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
        }
    },
}));
