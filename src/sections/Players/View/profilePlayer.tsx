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
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiWeightLiftingUp } from "react-icons/gi";
import UserCardComponent from "./Card/card";
import DetailsPlayer from "./Details/card";
import PersonalData from "./PersonalData/card";
import MatchesDetails from "./Matches/card";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import { Match } from "@/modules/match/domain/Match";

function ProfilePlayer() {
  const params = useParams();
  const id = params.id;
  const [player, setPlayer] = useState<User>();
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = createApiMatchRepository();
  const loadMatches = getMatchesByUser(matchRepository);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserAndMatches = async () => {
      try {
        const idUser = Number(id);
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
  }, [Number(id)]);

  return (
    <>
      <div className="md:flex block">
        <div className="md:flex-1 md:mr-3 p-4">
          <UserCardComponent player={player} />
          <PersonalData player={player} />
          {/* <DetailsPlayer /> */}
        </div>
        <div className="flex-1 mt-3 md:mt-0 p-4">
          <MatchesDetails matches={matches} />
        </div>
      </div>
    </>
  );
}

export default ProfilePlayer;
