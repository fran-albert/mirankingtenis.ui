import { create } from 'zustand';
import { createApiFixtureRepository } from '@/modules/fixture/infra/ApiFixtureRepository';
import { createFixture } from '@/modules/fixture/application/create/createFixture';
import { getFixtureByCategory } from '@/modules/fixture/application/get-fixture-by-category/getFixtureByCategory';
import { getFixtureByCategoryAndTournament } from '@/modules/fixture/application/get-fixture-by-category-and-tournament/getFixtureByCategoryAndTournament';
import { Fixture } from '@/modules/fixture/domain/Fixture';
import { Match } from '@/modules/match/domain/Match';

const fixtureRepository = createApiFixtureRepository();

interface FixtureState {
    fixture: Fixture[];
    quartelFinal: Match[];
    semiFinal: Match[];
    final: Match[];
    loading: boolean;
    error: string | null;
    createFixture: (newFixture: Fixture) => Promise<void>;
    isGroupStageFixturesCreated: (idTournament: number, idCategory: number) => Promise<boolean>;
    getFinals: (idCategory: number, idTournament: number) => Promise<Match[]>;
    getQuarterFinals: (idCategory: number, idTournament: number) => Promise<Match[]>;
    getSemiFinals: (idCategory: number, idTournament: number) => Promise<Match[]>;
    createPlayOff: (idCategory: number, idTournament: number) => Promise<string>;
    createFixtureGroup: (idTournament: number, idCategory: number) => Promise<string>;
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
    quartelFinal: [],
    semiFinal: [],
    final: [],
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

    createFixtureGroup: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const fixture = await fixtureRepository.createFixtureGroup(idTournament, idCategory);
            set({ loading: false });
            return fixture;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    createPlayOff: async (idCategory: number, idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const fixture = await fixtureRepository.createPlayOff(idCategory, idTournament);
            set({ loading: false });
            return fixture;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    getFinals: async (idCategory: number, idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const final = await fixtureRepository.getFinals(idCategory, idTournament);
            set({ loading: false });
            return final;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    getQuarterFinals: async (idCategory: number, idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const quartelFinal = await fixtureRepository.getQuarterFinals(idCategory, idTournament);
            set({ loading: false });
            return quartelFinal;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    getSemiFinals: async (idCategory: number, idTournament: number) => {
        set({ loading: true, error: null });
        try {
            const semiFinal = await fixtureRepository.getSemiFinals(idCategory, idTournament);
            set({ loading: false });
            return semiFinal;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    isGroupStageFixturesCreated: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const fixture = await fixtureRepository.isGroupStageFixturesCreated(idTournament, idCategory);
            set({ loading: false });
            return fixture;
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            return false;
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
