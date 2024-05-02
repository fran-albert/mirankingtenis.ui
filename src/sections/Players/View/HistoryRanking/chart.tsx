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

type DataType = {
  date: string;
  position: number;
};
function PlayerChart({ player }: { player: User | undefined }) {
  const historyRankings = player?.historyRankings || [];

  const data = historyRankings.map((ranking) => ({
    date: new Date(ranking.date).toLocaleDateString(),
    position: ranking.position,
  }));

  const minY = data.length > 0 ? Math.min(...data.map((d) => d.position)) : 1;

  const maxY =
    data.length > 0
      ? Math.max(5, Math.max(...data.map((d) => d.position)) + 5)
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
      <div className="flex sm:mx-auto">
        <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 bg-gray-100 p-2">
              Historial de Posiciones
            </h3>
            <div className="space-y-4">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerChart;
