import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatsData {
  time: string;
  patients: number;
  prescriptions: number;
}

type Props = {
  data: StatsData[];
};

export default function StatisticsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="patients" fill="#8884d8" name="Bệnh nhân" />
        <Bar dataKey="prescriptions" fill="#82ca9d" name="Đơn thuốc" />
      </BarChart>
    </ResponsiveContainer>
  );
}
