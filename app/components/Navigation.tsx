import { NavLink, useNavigate } from "@remix-run/react";
import { useContext } from "react";
import { GlobalContext } from "~/context/globalcontext";

export default function Navigation() {
  const UserContext = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleClick = () => {
    UserContext.setUser({ id: null });
    navigate("/");
  }
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={UserContext?.user?.id ? `/profile/${UserContext.user.id}` : "/auth"}
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            User Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <button className="btn btn-xs btn-error bg-red-400" onClick={handleClick}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}
