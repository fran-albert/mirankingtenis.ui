import { User } from "@/modules/users/domain/User";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
  Dot,
} from "recharts";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DataType = {
  date: string;
  position: number;
};
function PlayerChart({ player }: { player: any | null }) {
  const historyRankings = player?.historyRankings || [];

  const data = historyRankings.map((ranking: any) => ({
    date: new Date(ranking.date).toLocaleDateString(),
    position: ranking.position,
  }));

  const minY =
    data.length > 0 ? Math.min(...data.map((d: any) => d.position)) : 1;

  const maxY =
    data.length > 0
      ? Math.max(5, Math.max(...data.map((d: any) => d.position)) + 5)
      : 5;
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="font-medium">{`Posición: ${payload[0].value}°`}</p>
          <p>{`Fecha: ${label}`}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Posiciones</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <Line
                type="monotone"
                dataKey="position"
                stroke="#8884d8"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={<Dot r={5} fill="#8884d8" stroke="none" />}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#2E4053" }}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                domain={[maxY, minY]}
                type="number"
                tickFormatter={(value) => value.toFixed(0)}
                tick={{ fill: "#2E4053" }}
                tickMargin={10}
                reversed
              />

              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}

export default PlayerChart;
