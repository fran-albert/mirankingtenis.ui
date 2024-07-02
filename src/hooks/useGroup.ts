import { create } from 'zustand';
import { GroupDto, GroupRankingDto } from '@/common/types/group-ranking.dto';
import { createApiGroupRepository } from '@/modules/group/infra/ApiGroupRepository';
import { createApiGroupStageRepository } from '@/modules/group-stage/infra/ApiGroupStageRepository';

const groupRepository = createApiGroupRepository();
const groupStageRepository = createApiGroupStageRepository();
interface GroupState {
    groups: GroupDto[];
    groupRankings: GroupRankingDto[];
    groupStageId: number | null;
    loading: boolean;
    error: string | null;
    hasGroup: boolean;
    hasGroupsForCategory: (idTournament: number, idCategory: number) => Promise<boolean>;
    findAllByGroupStage: (groupStageId: number) => Promise<void>;
    getGroupRankings: (groupStageId: number) => Promise<void>;
     clearRankings: () => void;
    getGroupStagesByTournamentCategory: (idTournament: number, idCategory: number) => Promise<number>;
}

export const useGroupStore = create<GroupState>((set) => ({
    groups: [],
    groupRankings: [],
    groupStageId: null,
    hasGroup: false,
    loading: false,
    error: null,

    findAllByGroupStage: async (groupStageId: number) => {
        set({ loading: true, error: null });
        try {
            const groups = await groupRepository.findAllByGroupStage(groupStageId);
            set({ groups, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

     clearRankings: () => {
        set({ groupRankings: [] });
    },

    hasGroupsForCategory: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const hasGroup = await groupRepository.hasGroupsForCategory(idTournament, idCategory);
            set({ hasGroup, loading: false });
            return hasGroup;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    getGroupRankings: async (groupStageId: number) => {
        set({ loading: true, error: null });
        try {
            const groupRankings = await groupRepository.getGroupRankings(groupStageId);
            set({ groupRankings, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getGroupStagesByTournamentCategory: async (idTournament: number, idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const groupStageId = await groupStageRepository.getGroupStagesByTournamentCategory(idTournament, idCategory);
            set({ groupStageId, loading: false });
            return groupStageId;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },
}));
