import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  total: number;
  present: number;
  absent: number;
};

function AttendanceChart({
  total,
  present,
  absent,
}: Props) {

  const data = [
    {
      name: "Students",
      Total: total,
      Present: present,
      Absent: absent,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6 text-slate-700">
        Attendance Report
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="Total"
            fill="#2563eb"
          />

          <Bar
            dataKey="Present"
            fill="#16a34a"
          />

          <Bar
            dataKey="Absent"
            fill="#dc2626"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default AttendanceChart;