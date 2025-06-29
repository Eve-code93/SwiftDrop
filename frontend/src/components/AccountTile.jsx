import { Link } from "react-router-dom";

function AccountTile({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
    >
      <img src={icon} alt={label} className="w-12 h-12 mb-2 mx-auto" />
      <span className="text-sm font-medium text-gray-700 text-center">
        {label}
      </span>
    </Link>
  );
}

export default AccountTile;
