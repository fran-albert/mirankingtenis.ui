import { User } from "../User/User";

export interface GroupParticipant {
    id: number;
    groupId: number;
    user: User;
}