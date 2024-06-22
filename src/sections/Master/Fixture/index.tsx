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
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-md shadow-md mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        <Avatar>
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
                      </div>
                      <div>
                        <p className="font-medium">{match.user1.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {match.user1.position ?? "Sin posición"}°
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">vs</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {match.shift === null ? "" : formatDate(match.shift)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        <Avatar>
                          <AvatarImage
                            src={
                              match.user2.photo
                                ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${match.user2.photo}.jpeg`
                                : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                            }
                            alt="@shadcn"
                          />
                          <AvatarFallback>
                            {match.user2.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{match.user2.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {match.user2.position ?? "Sin posición"}°
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
