import { User } from "@/modules/users/domain/User"

export interface GroupParticipant {
    id: number;
    groupId: number;
    user: User;
}