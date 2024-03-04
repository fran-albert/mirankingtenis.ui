import React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/dataTable";

function MatchesIndex({ match }: { match: any | undefined }) {
  const playersColums = getColumns();

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
