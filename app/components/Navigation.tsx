import { Form, NavLink } from "@remix-run/react";

export default function Navigation({ context }: any) {
  const { session } = context;
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
        {session?.user ? (
          <li>
            <Form
              id="logoutForm"
              action={`/logout/${session.user.id}`}
              method="post"
            >
              <button type="submit" className="btn btn-xs btn-error">Logout</button>
            </Form>
          </li>
        ) : (
          <div className=""></div>
        )}
      </ul>
    </nav>
  );
}
