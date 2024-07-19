import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineScoreboard } from "react-icons/md";
import { formatDateDaysMonth } from "@/lib/utils";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import useRoles from "@/hooks/useRoles";
import UpdateMatchDialog from "@/sections/Matches/Update/dialog";
import AddShiftDialog from "@/sections/Auth/Profile/Matches/NewShift/new-shift";

const FinalCard = ({
  matches,
  handleAddResult,
  handleAddShift,
}: {
  matches: GroupFixtureDto[];
  handleAddResult: (match: GroupFixtureDto) => void;
  handleAddShift: (match: GroupFixtureDto) => void;
}) => {
  const { isAdmin } = useRoles();

  return (
    <div key="quarter-finals" className="mb-8">
      <div className="px-6 py-4 bg-slate-700 text-white rounded-t-lg shadow-lg">
        <h2 className="font-bold text-center text-xl">FINAL</h2>
      </div>
      <div className="grid gap-4 p-2 bg-white rounded-b-lg shadow-lg">
        {matches.map((match) => (
          <div key={match.match} className="rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    {match.shift === null && (
                      <button onClick={() => handleAddShift(match)}>
                        <FaCalendarAlt className="text-gray-700 hover:text-blue-500" />
                      </button>
                    )}
                    {match.shift !== null && match.status !== "played" && (
                      <button onClick={() => handleAddResult(match)}>
                        <MdOutlineScoreboard className="text-gray-700 hover:text-blue-500" />
                      </button>
                    )}
                  </div>
                )}
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      match.user1.photo
                        ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${match.user1.photo}.jpeg`
                        : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                    }
                    alt={match.user1.name.charAt(0)}
                  />
                  <AvatarFallback>{match.user1.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">
                    {match.user1.lastname}
                  </p>
                </div>
              </div>
              <div className="text-center w-full">
                {match.status === "played" ? (
                  <div>
                    <p className="font-medium text-gray-700">
                      {match.sets &&
                        match.sets
                          .sort((a, b) => a.setNumber - b.setNumber)
                          .map((set, index) => (
                            <span key={index}>
                              {set.pointsPlayer1}-{set.pointsPlayer2}
                              {index < match.sets.length - 1 ? " " : ""}
                            </span>
                          ))}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatDateDaysMonth(match.shift?.startHour)}{" "}
                      {match.court ? `Cancha ${match.court}` : ""}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-700">vs</p>
                    <p className="text-gray-500 text-sm">
                      {match.shift === null
                        ? ""
                        : formatDateDaysMonth(match.shift?.startHour)}{" "}
                      {match.court ? `Cancha ${match.court}` : ""}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {match.user2.lastname}
                  </p>
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      match.user2.photo
                        ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${match.user2.photo}.jpeg`
                        : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                    }
                    alt={match.user2.name.charAt(0)}
                  />
                  <AvatarFallback>{match.user2.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalCard;
