import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const players = [
  {
    id: 1,
    name: "Novak Djokovic",
    position: 1,
    image: "/novak-djokovic-tennis-player.png",
  },
  {
    id: 2,
    name: "Carlos Alcaraz",
    position: 2,
    image: "/carlos-alcaraz-professional.png",
  },
  {
    id: 3,
    name: "Daniil Medvedev",
    position: 3,
    image: "/daniil-medvedev-tennis.png",
  },
  {
    id: 4,
    name: "Jannik Sinner",
    position: 4,
    image: "/jannik-sinner-tennis.png",
  },
  {
    id: 5,
    name: "Andrey Rublev",
    position: 5,
    image: "/andrey-rublev-tennis.png",
  },
  {
    id: 6,
    name: "Stefanos Tsitsipas",
    position: 6,
    image: "/stefanos-tsitsipas-tennis.png",
  },
  {
    id: 7,
    name: "Holger Rune",
    position: 7,
    image: "/holger-rune-tennis.png",
  },
  {
    id: 8,
    name: "Casper Ruud",
    position: 8,
    image: "/casper-ruud-tennis.png",
  },
];

export default function TournamentPlayers() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600">Pre Clasificados al Master</p>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <Card
              key={player.id}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-gray-100"
            >
              <CardContent className="p-6">
                {/* Position Badge */}
                <div className="flex justify-center mb-4">
                  <Badge
                    variant={player.position <= 3 ? "default" : "secondary"}
                    className={`text-lg px-4 py-2 font-bold ${
                      player.position === 1
                        ? "bg-yellow-500 text-white"
                        : player.position === 2
                        ? "bg-gray-400 text-white"
                        : player.position === 3
                        ? "bg-amber-600 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    #{player.position}
                  </Badge>
                </div>

                {/* Player Image */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      height={32}
                      width={32}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Player Name */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {player.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
