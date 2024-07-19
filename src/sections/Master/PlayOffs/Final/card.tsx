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
    <div key="quarter-finals" className="mb-6">
      <div className="px-4 py-3 font-semibold text-lg">Final</div>
      <div className="grid md:grid-cols-2 md:gap-2">
        {matches.map((match) => (
          <div key={match.match} className="mb-4">
            <div className="space-y-4">
              <div className="bg-white rounded-md shadow-md p-4 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        {match.shift === null && (
                          <button onClick={() => handleAddShift(match)}>
                            <FaCalendarAlt className="text-slate-800 hover:text-slate-800" />
                          </button>
                        )}
                        {match.shift !== null && match.status !== "played" && (
                          <button onClick={() => handleAddResult(match)}>
                            <MdOutlineScoreboard className="text-green-800 hover:text-slate-800" />
                          </button>
                        )}
                      </div>
                    )}
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          match.user1.photo
                            ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${match.user1.photo}.jpeg`
                            : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                        }
                        alt={match.user1.name.charAt(0)}
                      />
                      <AvatarFallback>
                        {match.user1.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium flex">{match.user1.lastname}</p>
                    </div>
                  </div>
                  <div className="text-center w-full">
                    {match.status === "played" ? (
                      <div>
                        <p className="font-medium">
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
                        <p className="font-medium">vs</p>
                        <p className="text-gray-500 text-sm">
                          {match.shift === null
                            ? ""
                            : formatDateDaysMonth(match.shift?.startHour)}{" "}
                          {match.court ? `Cancha ${match.court}` : ""}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="text-right">
                      <p className="font-medium">{match.user2.lastname}</p>
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          match.user2.photo
                            ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${match.user2.photo}.jpeg`
                            : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                        }
                        alt={match.user2.name.charAt(0)}
                      />
                      <AvatarFallback>
                        {match.user2.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalCard;
