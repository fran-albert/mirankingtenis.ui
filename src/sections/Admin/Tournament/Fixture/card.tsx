import React from "react";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Create } from "@/components/Button/Create/button";
import { Category } from "@/modules/category/domain/Category";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
function CategoriesCard({
  category,
  nextMatchDay,
  idTournament
}: {
  category: TournamentCategory;
  idTournament: number;
  nextMatchDay: any;
}) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Categoría {category.nameCategory}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="flex items-center gap-2">
            <span>Team A</span>
            <span>vs</span>
            <span>Team B</span>
          </div>
          <div className="mt-2">
            <span>Date: 13th December 2023, 10:00 AM</span>
          </div> */}
        </CardContent>
        <CardFooter>
          <Create
            idTournament={idTournament}
            path="admin/torneos/"
            category={category}
            number={nextMatchDay}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

export default CategoriesCard;
