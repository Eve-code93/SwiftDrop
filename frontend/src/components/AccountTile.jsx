import { Link } from "react-router-dom";

function AccountTile({ title, value, icon, color = "text-gray-800" }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition">
      <img
        src={icon}
        alt={title}
        className="w-16 h-16 object-contain" // Bigger icon
      />
      <h3 className="text-md text-gray-500 font-medium">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
export default AccountTile;
