import { Form, NavLink } from "@remix-run/react";

export default function Navigation() {
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
            to="/auth"
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
            <Form
              id="logoutForm"
              action={`/logout`}
              method="post"
            >
              <button type="submit" className="btn btn-xs btn-error bg-red-400">Logout</button>
            </Form>
          </li>
      </ul>
    </nav>
  );
}
