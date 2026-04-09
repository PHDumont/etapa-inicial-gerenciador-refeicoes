import "./Sidebar.css"
import { NavLink } from "react-router";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Meal Tracker</div>
      <ul className="nav-menu">
        <NavLink 
          to="/diary"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} 
        >
          Diário
        </NavLink>
        
        <NavLink 
          to="/food-catalogy"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} 
        >
          Catálogo de Alimentos
        </NavLink>
      </ul>
    </aside>
  );
}