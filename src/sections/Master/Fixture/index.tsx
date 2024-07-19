import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatDateDaysMonth } from "@/lib/utils";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import useRoles from "@/hooks/useRoles";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import UpdateMatchDialog from "@/sections/Matches/Update/dialog";
import { MdOutlineScoreboard } from "react-icons/md";
import { useMatchStore } from "@/hooks/useMatch";
import AddShiftDialog from "@/sections/Auth/Profile/Matches/NewShift/new-shift";

export function FixtureGroupStage({
  groupFixture,
  updateMatches,
}: {
  groupFixture: GroupFixtureDto[];
  updateMatches: () => void;
}) {
  const { isAdmin } = useRoles();
  const { selectMatch } = useMatchStore();
  const [isAddResultDialogOpen, setIsAddResultDialogOpen] = useState(false);
  const [isAddShiftDialogOpen, setIsAddShiftDialogOpen] = useState(false);

  const handleAddResult = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddResultDialogOpen(true);
  };

  const handleAddShift = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddShiftDialogOpen(true);
  };

  if (groupFixture.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 ">
          No hay partidos disponibles para esta categoría.
        </p>
      </div>
    );
  }

  const groupedByFixtureAndGroup = groupFixture.reduce((acc, match) => {
    const fixture = `Fecha ${match.fixture}`;
    const group = match.groupName;
    if (!acc[fixture]) acc[fixture] = {};
    if (!acc[fixture][group]) acc[fixture][group] = [];
    acc[fixture][group].push(match);
    return acc;
  }, {} as Record<string, Record<string, GroupFixtureDto[]>>);

  if (window.innerWidth < 768) {
    return (
      <div>
        {Object.entries(groupedByFixtureAndGroup).map(([fixture, groups]) => (
          <div key={fixture} className="mb-6">
            <div className="px-4 py-3 font-semibold text-lg">{fixture}</div>
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(groups).map(([groupName, matches]) => (
                <div key={groupName} className="mb-4">
                   <div className="bg-slate-700 px-4 py-2 font-medium text-md text-white rounded-md">
                    Grupo {groupName}
                  </div>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-white rounded-md shadow-md p-4 flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isAdmin && (
                              <div className="flex items-center space-x-2">
                                <>
                                  {match.shift === null && (
                                    <button
                                      onClick={() => handleAddShift(match)}
                                    >
                                      <FaCalendarAlt className="text-slate-800 hover:text-slate-800" />
                                    </button>
                                  )}
                                  {match.shift !== null &&
                                    match.status !== "played" && (
                                      <button
                                        onClick={() => handleAddResult(match)}
                                      >
                                        <MdOutlineScoreboard className="text-green-800 hover:text-slate-800" />
                                      </button>
                                    )}
                                </>
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
                              <p className="font-medium flex">
                                {/* <span className="text-gray-500 text-sm">
                                {match.user1.position ?? "Sin posición"}°{" "}
                              </span> */}
                                {match.user1.name}{" "}
                              </p>
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
                                          {set.pointsPlayer1}-
                                          {set.pointsPlayer2}
                                          {index < match.sets.length - 1
                                            ? " "
                                            : ""}
                                        </span>
                                      ))}
                                </p>
                                <p className="text-gray-500  text-sm">
                                  {formatDateDaysMonth(match.shift?.startHour)}{" "}
                                  {"  "}
                                  {match.court ? `Cancha ${match.court}` : ""}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-medium">vs</p>
                                <p className="text-gray-500  text-sm">
                                  {match.shift === null
                                    ? ""
                                    : formatDateDaysMonth(
                                        match.shift?.startHour
                                      )}{" "}
                                  {"  "}
                                  {match.court ? `Cancha ${match.court}` : ""}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <div className="text-right">
                              <p className="font-medium">
                                {/* <span className="text-gray-500 text-sm">
                                  {match.user2.position ?? "Sin posición"}°{" "}
                                </span> */}
                                {match.user2.name}{" "}
                              </p>
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <UpdateMatchDialog
          isOpen={isAddResultDialogOpen}
          updateMatches={updateMatches}
          onClose={() => setIsAddResultDialogOpen(false)}
        />
        <AddShiftDialog
          isOpen={isAddShiftDialogOpen}
          updateMatches={updateMatches}
          onClose={() => setIsAddShiftDialogOpen(false)}
        />
      </div>
    );
  }

  return (
    <div>
      {Object.entries(groupedByFixtureAndGroup).map(([fixture, groups]) => (
        <div key={fixture} className="mb-6">
          <div className="px-4 py-3 font-semibold">{fixture}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groups).map(([groupName, matches]) => (
              <div key={groupName} className="mb-4">
                <div className="bg-slate-700 px-4 py-2 font-medium text-md text-white rounded-md">
                  Grupo {groupName}
                </div>

                <table className="w-full bg-white  rounded-md shadow-md mb-4 table-fixed">
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.id} className="border-t">
                        <td className="p-2 text-left w-1/4">
                          {isAdmin && (
                            <div className="flex items-center space-x-2">
                              <>
                                {match.shift === null && (
                                  <button onClick={() => handleAddShift(match)}>
                                    <FaCalendarAlt className="text-slate-800 hover:text-slate-800" />
                                  </button>
                                )}
                                {match.shift !== null &&
                                  match.status !== "played" && (
                                    <button
                                      onClick={() => handleAddResult(match)}
                                    >
                                      <MdOutlineScoreboard className="text-green-800 hover:text-slate-800" />
                                    </button>
                                  )}
                              </>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
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
                              <p className="font-medium">{match.user1.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center w-1/2">
                          {match.status === "played" ? (
                            <div>
                              <p className="font-medium">
                                {match.sets && match.sets.length > 0
                                  ? match.sets
                                      .sort((a, b) => a.setNumber - b.setNumber)
                                      .map((set, index) => (
                                        <span key={index}>
                                          {set.pointsPlayer1}-
                                          {set.pointsPlayer2}
                                          {index < match.sets.length - 1
                                            ? " "
                                            : ""}
                                        </span>
                                      ))
                                  : " "}
                              </p>
                              <p className="text-gray-500  text-sm">
                                {formatDate(match.shift?.startHour)} {"  "}
                                {match.court ? `Cancha ${match.court}` : ""}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium">vs</p>
                              <p className="text-gray-500  text-sm">
                                {match.shift === null
                                  ? ""
                                  : formatDate(match.shift?.startHour)}{" "}
                                {"  "}
                                {match.court ? `Cancha ${match.court}` : ""}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-right w-1/4">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="text-right">
                              <p className="font-medium">{match.user2.name}</p>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}
      <UpdateMatchDialog
        isOpen={isAddResultDialogOpen}
        updateMatches={updateMatches}
        onClose={() => setIsAddResultDialogOpen(false)}
      />
      <AddShiftDialog
        isOpen={isAddShiftDialogOpen}
        updateMatches={updateMatches}
        onClose={() => setIsAddShiftDialogOpen(false)}
      />
    </div>
  );
}
