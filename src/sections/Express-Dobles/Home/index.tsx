import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MatchGrid from "../MatchGrid";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { User } from "@/types/User/User";

export default function Home({
  doublesMatches,
  users,
  points,
}: {
  doublesMatches: DoublesExhibitionMatchResponse[];
  users: User[];
  points: number;
}) {
  return (
    <div className="mx-auto p-4">
      <header className="mb-8">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/dobles%20express%20logo%20sin%20fondo.png"
            alt="Dobles Express Logo"
            width={150}
            height={150}
            className="mx-auto"
          />
          <h1 className="text-4xl font-bold text-primary mt-2">
            Doubles Express
          </h1>
        </div>
        <div className="flex justify-end">
          <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full">
            Mis Puntos: <span className="font-bold">{points}</span>
          </div>
        </div>
        <div className="h-1 bg-slate-700 mt-4"></div>
      </header>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Partidos Disponibles</h2>
        <Link href="/turnos" className=" block">
          <Button className="text-sm bg-slate-800 hover:bg-slate-900" size="sm">
            Nuevo partido
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-md space-y-8">
        {doublesMatches.length <= 0 && (
          <div className="space-y-4">
            <Link href="/turnos" className="w-full block">
              <Button
                className="w-full text-xl py-8 bg-slate-800 hover:bg-slate-900"
                size="lg"
              >
                Nuevo partido
              </Button>
            </Link>
            <Link href="/turnos" className="w-full block">
              <Button
                className="w-full text-xl py-8"
                size="lg"
                variant="secondary"
              >
                Visualizar turnos
              </Button>
            </Link>
          </div>
        )}
      </div>
      <MatchGrid doublesMatches={doublesMatches} users={users} />
    </div>
  );
}
