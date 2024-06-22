import { GroupParticipant } from "@/modules/group-participant/domain/GroupParticipant";

export interface Group {
    id: number;
    name: string;
    groupStageId: number;
    participants: GroupParticipant[]
}