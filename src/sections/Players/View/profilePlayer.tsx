import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AiOutlineFileJpg } from "react-icons/ai";
import { MdHeight } from "react-icons/md";
import { IoIosBody } from "react-icons/io";
import {
  FaBirthdayCake,
  FaWeight,
  FaRulerVertical,
  FaFlag,
  FaHandPaper,
  FaUserAlt,
  FaPlus,
  FaEdit,
  FaUpload,
  FaUser,
  FaRegFilePdf,
} from "react-icons/fa";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiWeightLiftingUp } from "react-icons/gi";
import UserCardComponent from "./Card/card";
import DetailsPlayer from "./Details/card";
import PersonalData from "./PersonalData/card";
import MatchesDetails from "./Matches/card";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import { Match } from "@/modules/match/domain/Match";
import PlayerChart from "./HistoryRanking/chart";

function ProfilePlayer() {
  const params = useParams();
  const idParam = params.id;
  const [player, setPlayer] = useState<User>();
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = useMemo(() => createApiMatchRepository(), []);
  const userRepository = useMemo(() => createApiUserRepository(), []);

  const loadMatches = useCallback(
    (id: number) => getMatchesByUser(matchRepository)(id),
    [matchRepository]
  );
  const loadUser = useCallback(
    (id: number) => getUser(userRepository)(id),
    [userRepository]
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const idUser = Number(idParam);
  useEffect(() => {
    setIsLoading(true);
    const fetchUserAndMatches = async () => {
      try {
        const userData = await loadUser(idUser);
        setPlayer(userData);
        const userMatches = await loadMatches(idUser);
        setMatches(userMatches);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAndMatches();
  }, [idUser, loadMatches, loadUser]);

  return (
    <>
      <div className="md:flex flex-wrap -mx-4">
        <div className="md:w-1/2 p-4">
          <div className=" mb-4">
            <UserCardComponent player={player} />
          </div>
          <div className="">
            <PlayerChart player={player} />
          </div>
        </div>
        <div className="md:w-1/2 p-4 ">
          <div className=" mb-4">
            <PersonalData player={player} />
          </div>
          <div className="">
            <MatchesDetails matches={matches} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePlayer;
