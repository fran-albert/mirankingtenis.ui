import React, { useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/dataTable";

function MatchesIndex({
  match,
  onUpdateMatches,
}: {
  match: any | undefined;
  onUpdateMatches: any;
}) {
  const playersColums = getColumns(onUpdateMatches);

  return (
    <>
      <div className="flex flex-col py-2">
        <DataTable
          columns={playersColums}
          data={match}
          showSearch={false}
          canAddUser={false}
        />
      </div>
    </>
  );
}

export default MatchesIndex;
