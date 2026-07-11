import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./AdminLayout.css";

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">+</div>

          <div>
            <strong>Clínica Premium</strong>
            <span>Painel administrativo</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <span className="admin-link-icon">⌂</span>
            Visão geral
          </NavLink>

          <NavLink
            to="/admin/agenda"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <span className="admin-link-icon">▣</span>
            Agenda
          </NavLink>

          <NavLink
            to="/admin/pacientes"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <span className="admin-link-icon">◉</span>
            Pacientes
          </NavLink>

          <NavLink
            to="/admin/servicos"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <span className="admin-link-icon">✚</span>
            Serviços
          </NavLink>

          <NavLink
            to="/admin/configuracoes"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <span className="admin-link-icon">⚙</span>
            Configurações
          </NavLink>
        </nav>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          Sair do painel
        </button>
      </aside>

      <div className="admin-area">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">Painel administrativo</span>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">DR</div>

            <div>
              <strong>Dra. Marina Lopes</strong>
              <span>Administradora</span>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;