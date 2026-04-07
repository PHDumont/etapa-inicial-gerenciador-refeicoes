import { NavLink } from "react-router";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Meal Tracker</div>
      <ul className="nav-menu">
        <NavLink className="nav-item" to="/diary">Diário</NavLink>
        <NavLink className="nav-item active" to="/food-catalog">Catálogo de Alimentos</NavLink>
      </ul>
    </aside>
  );
}
