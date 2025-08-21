import { Group } from "@/types/Group/Group";

export interface GroupStage {
    id: number;
    idTournamentCategory: number;
    groups: Group[];
}