import "./Sidebar.css"

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Meal Tracker</div>
      <ul className="nav-menu">
        <li className="nav-item">Diário</li>
        <li className="nav-item active">Catálogo de Alimentos</li>
      </ul>
    </aside>
  );
};

