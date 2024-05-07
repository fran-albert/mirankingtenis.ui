import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import UserCardComponent from "@/sections/Players/View/Card/card";
import { User } from "@/modules/users/domain/User";
import "./style.css";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import PersonalData from "@/sections/Players/View/PersonalData/card";
import { Match } from "@/modules/match/domain/Match";
import MatchesDetails from "@/sections/Players/View/Matches/card";
export function PlayerComponent({
  player,
  currentUser,
  matches,
}: {
  player: User | undefined;
  currentUser: any;
  matches: Match[];
}) {
  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr] lg:block">
      <div className="flex flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6 md:gap-8">
            <div className="user-card-container">
              <div className="user-card">
                <UserCardComponent player={player} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <PlayerChart player={player} />
              <PersonalData player={player} />
              <MatchesDetails matches={matches} currentUser={currentUser} />
            </div>
          </div>
        </main>
        {/* <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UserCardComponent player={player} />
              <UserCardComponent player={player} />
              <UserCardComponent player={player} />
              <Card>
                <CardHeader>
                  <CardTitle>Raffle 2</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Raffles Posted</span>
                    <span>50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Shares</span>
                    <span>5,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shares Sold</span>
                    <span>4,200</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm">View Details</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Raffle 3</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Raffles Posted</span>
                    <span>75</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Shares</span>
                    <span>7,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shares Sold</span>
                    <span>6,800</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm">View Details</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>Total Balance</span>
                    <span className="text-2xl font-bold">R$ 12,345.67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Available Balance</span>
                    <span className="text-2xl font-bold">R$ 10,345.68</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minimum Withdrawal</span>
                    <span className="text-lg font-bold">R$ 40.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Withdrawal Fee</span>
                    <span className="text-lg font-bold">R$ 1.99</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Withdraw</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>May 1, 2023</span>
                    <span className="text-lg font-bold">R$ 500.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>April 15, 2023</span>
                    <span className="text-lg font-bold">R$ 300.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>March 30, 2023</span>
                    <span className="text-lg font-bold">R$ 200.00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main> */}
      </div>
    </div>
  );
}
