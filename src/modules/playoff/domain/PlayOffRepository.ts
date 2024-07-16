import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import { ResponsePlayOffDto } from "./PlayOff";

export interface PlayOffRepository {
    getQuarterFinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
    getSemifinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
    getFinals: (idTournament: number, idCategory: number) => Promise<GroupFixtureDto[]>;
}
