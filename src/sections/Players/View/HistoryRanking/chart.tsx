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
  Dot,
} from "recharts";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { HistoryRankingDto } from "@/common/types/history-ranking.dto";

type DataType = {
  date: string;
  position: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DataType;
  }>;
  label?: string;
}

function PlayerChart({
  player,
  tournamentCategoryId,
}: {
  player: HistoryRankingDto[] | null;
  tournamentCategoryId: number;
}) {
  const historyRankings = player || [];

  const initialRanking = historyRankings.find(ranking => ranking.jornada === null);
  const initialDataPoint = initialRanking ? { date: "Inicio del Torneo", position: initialRanking.position } : null;
  
  const data = [
    initialDataPoint,
    ...historyRankings.filter(ranking => ranking.jornada !== null).map((ranking: HistoryRankingDto) => ({
      date: ranking.jornada,
      position: ranking.position,
    })),
  ].filter((d): d is DataType => d !== null);

  const minY = data.length > 0 ? Math.min(...data.map((d) => d.position)) : 1;

  const maxY =
    data.length > 0
      ? Math.max(5, Math.max(...data.map((d) => d.position)) + 5)
      : 5;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffffff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
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
              stroke="#4B513F"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={<Dot r={5} fill="#4B513F" stroke="none" />}
            />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#333333" }}
              tickMargin={10}
              style={{ fontSize: "12px" }}
              label={{
                value: "Fechas",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis
              allowDecimals={false}
              domain={[maxY, minY]}
              type="number"
              tickFormatter={(value) => value.toFixed(0)}
              tick={{ fill: "#333333" }}
              tickMargin={10}
              reversed
              style={{ fontSize: "12px" }}
              label={{
                value: "Posiciones",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PlayerChart;
