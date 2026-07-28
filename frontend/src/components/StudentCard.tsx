type Props = {
  title: string;
  value: string | number;
  color: string;
};

function StatsCard({ title, value, color }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">

      <h3 className="text-gray-500 text-sm mb-2">
        {title}
      </h3>

      <h1 className={`text-4xl font-bold ${color}`}>
        {value}
      </h1>

    </div>
  );
}

export default StatsCard;