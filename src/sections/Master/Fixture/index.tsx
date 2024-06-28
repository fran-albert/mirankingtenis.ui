import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export function FixtureGroupStage({
  groupFixture,
}: {
  groupFixture: GroupFixtureDto[];
}) {
  if (groupFixture.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
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

  return (
    <div>
      {Object.entries(groupedByFixtureAndGroup).map(([fixture, groups]) => (
        <div key={fixture} className="mb-6">
          <div className="px-4 py-3 font-semibold">{fixture}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groups).map(([groupName, matches]) => (
              <div key={groupName} className="mb-4">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 font-medium">
                  Grupo {groupName}
                </div>
                <table className="w-full bg-white dark:bg-gray-900 rounded-md shadow-md mb-4 table-fixed">
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.id} className="border-t">
                        <td className="p-2 text-left w-1/4">
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
                              <p className="font-medium">
                                <span className="text-gray-500 text-sm">
                                  {" "}
                                  {match.user1.position ?? "Sin posición"}°{" "}
                                </span>
                                {match.user1.name}{" "}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center w-1/2">
                          <p className="font-medium">vs</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {match.shift === null
                              ? ""
                              : formatDate(match.shift)}{" "}
                            {" - "}
                            {match.court ? `Cancha ${match.court}` : ""}
                          </p>
                        </td>
                        <td className="p-2 text-right w-1/4">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="text-right">
                              <p className="font-medium">
                                <span className="text-gray-500 text-sm">
                                  {" "}
                                  {match.user2.position ?? "Sin posición"}°{" "}
                                </span>
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
    </div>
  );
}
