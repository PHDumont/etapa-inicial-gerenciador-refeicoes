import "./Sidebar.css";
import { NavLink } from "react-router";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="nav-menu">
        <NavLink
          to="/diary"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Diary
        </NavLink>

        <NavLink
          to="/food-catalogy"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Food Catalog
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Profile
        </NavLink>
      </ul>
    </aside>
  );
}
