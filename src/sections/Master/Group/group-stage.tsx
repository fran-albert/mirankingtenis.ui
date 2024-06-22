import { GroupRankingDto } from "@/common/types/group-ranking.dto";

export function GroupStage({
  groupRankings,
}: {
  groupRankings: GroupRankingDto[];
}) {
  if (groupRankings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          No hay grupos disponibles para esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groupRankings.map((group) => (
        <div key={group.groupId} className="border rounded-lg overflow-hidden translate-x-0">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 font-semibold">
            Grupo {group.groupName}
          </div>
          <div className="overflow-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-left">
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Jugador</th>
                  <th className="px-4 py-3">PTS</th>
                  <th className="px-4 py-3">PJ</th>
                  <th className="px-4 py-3">PG</th>
                  <th className="px-4 py-3">PP</th>
                </tr>
              </thead>
              <tbody>
                {group.rankings.map((ranking) => (
                  <tr
                    key={ranking.userId}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {ranking.position}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {ranking.userName}
                    </td>
                    <td className="px-4 py-3">{ranking.points}</td>
                    <td className="px-4 py-3">{ranking.playedMatches}</td>
                    <td className="px-4 py-3">{ranking.wonMatches}</td>
                    <td className="px-4 py-3">{ranking.lostMatches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
