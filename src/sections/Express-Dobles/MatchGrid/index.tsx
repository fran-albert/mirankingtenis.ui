"use client";

import { useEffect, useState } from "react";
import MatchCard from "../Match-Card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import useRoles from "@/hooks/useRoles";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from "@/types/User/User";

const transformMatches = (apiMatches: DoublesExhibitionMatchResponse[]) => {
  return apiMatches.map((match) => {
    const startDate = match.shift ? new Date(match.shift.startHour) : null;
    const formattedDate = startDate
      ? format(startDate, "EEEE, d 'de' MMMM", { locale: es })
      : "Fecha desconocida";
    const formattedTime = startDate ? format(startDate, "HH:mm 'horas'") : "Hora desconocida";

    const courtName =
      match.shift && typeof match.shift.court === "object"
        ? `Cancha ${match.shift.court.name}`
        : "Cancha Desconocida";

    return {
      id: `P${match.id}`,
      date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      time: formattedTime,
      court: courtName,
      players: [
        {
          id: match.player1 ? match.player1.id : null,
          category: "A",
          name: match.player1 ? `${match.player1.name} ${match.player1.lastname}` : null,
        },
        {
          id: match.player2 ? match.player2.id : null,
          category: "B",
          name: match.player2 ? `${match.player2.name} ${match.player2.lastname}` : null,
        },
        {
          id: match.player3 ? match.player3.id : null,
          category: "C",
          name: match.player3 ? `${match.player3.name} ${match.player3.lastname}` : null,
        },
        {
          id: match.player4 ? match.player4.id : null,
          category: "D",
          name: match.player4 ? `${match.player4.name} ${match.player4.lastname}` : null,
        },
      ],
    };
  });
};


const MATCHES_PER_PAGE = 6;

export default function MatchGrid({
  doublesMatches,
  users,
}: {
  doublesMatches: DoublesExhibitionMatchResponse[];
  users: User[];
}) {
  const [matches, setMatches] = useState<any[]>([]);
  const { session, isAdmin } = useRoles();
  const userId = session?.user.id;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(matches.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const endIndex = startIndex + MATCHES_PER_PAGE;
  const currentMatches = matches.slice(startIndex, endIndex);
  useEffect(() => {
    if (doublesMatches.length) {
      setMatches(transformMatches(doublesMatches));
    }
  }, [doublesMatches]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMatches.map((match) => (
          <MatchCard
            key={match.id}
            {...match}
            jugadoresDisponibles={users}
            isAdmin={isAdmin}
            authenticatedUserId={userId}
          />
        ))}
      </div>
      {matches.length > 0 && ( 
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
