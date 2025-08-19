import { GroupParticipant } from "@/types/Group-Participant/GroupParticipant";

export interface Group {
    id: number;
    name: string;
    groupStageId: number;
    participants: GroupParticipant[]
}