import { Group } from "@/modules/group/domain/Group";

export interface GroupStage {
    id: number;
    idTournamentCategory: number;
    groups: Group[];
}