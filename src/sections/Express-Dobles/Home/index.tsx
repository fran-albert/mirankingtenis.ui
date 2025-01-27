import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MatchGrid from "../MatchGrid";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { User } from "@/types/User/User";

export default function Home({
  doublesMatches,
  users,
}: {
  doublesMatches: DoublesExhibitionMatchResponse[];
  users: User[];
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/dobles%20express%20logo%20sin%20fondo.png"
            alt="Dobles Express Logo"
            width={150}
            height={150}
            className="mx-auto"
          />
          <h1 className="text-4xl font-semibold text-foreground">
            Dobles Express
          </h1>
        </div>
        {doublesMatches.length < 0 && (
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
